/*
 * Copyright 2026 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import makeServerFetchye from '../../src/react-server/makeServerFetchye';
import { persistentCacheStore, getPersistentCacheKey } from '../../src/react-server/persistentCache';
import { computeKey } from '../../src/computeKey';

global.console.error = jest.fn();

const makePayload = (fakeData = { fakeData: true }) => ({
  headers: new global.Headers({
    'Content-Type': 'application/json',
  }),
  ok: true,
  status: 200,
  text: async () => JSON.stringify(fakeData),
});

const defaultPayload = makePayload();

const expectedMakeServerFetchyeResponseSnapshot = `
  Object {
    "data": Object {
      "body": Object {
        "fakeData": true,
      },
      "headers": Object {
        "content-type": "application/json",
      },
      "ok": true,
      "status": 200,
    },
    "error": null,
    "run": [Function],
  }
`;

// mirrors the local promise API of holocron's promise store. Note that, unlike a
// short-lived, per-request cache, this test double (like the real implementation)
// never evicts an entry once it has been stored, so a resolved/rejected promise for a
// given key will be reused for the lifetime of the test unless `run()` is used to
// bypass it.
const createTestPromiseStore = () => {
  const promises = new Map();
  return {
    getLocalPromise: jest.fn((domain, key) => promises.get(`${domain}:${key}`)),
    storeLocalPromise: jest.fn((domain, key, promise) => promises.set(`${domain}:${key}`, promise)),
  };
};

describe('react-server/makeServerFetchye', () => {
  let fetchClient;
  let promiseStore;

  beforeEach(() => {
    promiseStore = createTestPromiseStore();
    fetchClient = jest.fn(async () => ({
      ...defaultPayload,
    }));
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await persistentCacheStore.clear();
  });

  it('should throw when a cache is provided', async () => {
    await expect(makeServerFetchye({
      cache: {},
      fetchClient,
    })('http://example.com')).rejects.toThrow('This function does not support a cache in RSC, it is passed as null from oneFetchye, you should not be calling makeServerFetchye directly');
  });

  it('should throw when a store is provided', async () => {
    await expect(makeServerFetchye({
      store: {},
      fetchClient,
    })('http://example.com')).rejects.toThrow('This function does not support a store in RSC, it is passed as null from oneFetchye, you should not be calling makeServerFetchye directly');
  });

  it('should throw when no promise store is provided', async () => {
    await expect(makeServerFetchye({
      fetchClient,
    })('http://example.com')).rejects.toThrow();
  });

  it('should return data in success state, deduping through the in-flight promise store', async () => {
    const fetchyeRes = await makeServerFetchye({
      fetchClient,
      promiseStore,
    })('http://example.com');

    expect(fetchyeRes).toMatchInlineSnapshot(expectedMakeServerFetchyeResponseSnapshot);
    expect(promiseStore.getLocalPromise).toHaveBeenCalledTimes(1);
    expect(promiseStore.storeLocalPromise).toHaveBeenCalledTimes(1);
  });

  it('should return null in the error state', async () => {
    fetchClient = jest.fn(async () => {
      throw new Error('fake error');
    });
    const fetchyeRes = await makeServerFetchye({
      fetchClient,
      promiseStore,
    })('http://example.com/one');

    expect(global.console.error.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          [Error: fake error],
        ],
      ]
    `);
    expect(fetchyeRes).toMatchInlineSnapshot(`
      Object {
        "data": null,
        "error": null,
        "run": [Function],
      }
    `);
  });

  it('should reload the data if the run function returned is called', async () => {
    const fetchye = makeServerFetchye({
      fetchClient,
      promiseStore,
    });
    const fetchyeRes = await fetchye('http://example.com/two');
    await fetchyeRes.run();
    expect(fetchClient).toHaveBeenCalledTimes(2);
    expect(fetchyeRes).toMatchInlineSnapshot(expectedMakeServerFetchyeResponseSnapshot);
  });

  it('the run function should bypass the in-flight promise store entirely, both reading and writing it', async () => {
    const fetchye = makeServerFetchye({
      fetchClient,
      promiseStore,
    });
    const fetchyeRes = await fetchye('http://example.com/two');
    const getCallsBeforeRun = promiseStore.getLocalPromise.mock.calls.length;
    const storeCallsBeforeRun = promiseStore.storeLocalPromise.mock.calls.length;

    const runResult = await fetchyeRes.run();

    expect(promiseStore.getLocalPromise).toHaveBeenCalledTimes(getCallsBeforeRun);
    expect(promiseStore.storeLocalPromise).toHaveBeenCalledTimes(storeCallsBeforeRun);
    // the run() result is the raw runAsync payload, it is not wrapped with a `run` fn
    expect(runResult).toEqual({ data: expect.any(Object), error: null });
    expect(runResult.run).toBeUndefined();
  });

  describe('deduplication via the in-flight promise store', () => {
    it('should share a single request between concurrent calls for the same key', async () => {
      const fetchye = makeServerFetchye({
        fetchClient,
        promiseStore,
      });

      const [resOne, resTwo] = await Promise.all([
        fetchye('http://example.com/dedupe'),
        fetchye('http://example.com/dedupe'),
      ]);

      expect(fetchClient).toHaveBeenCalledTimes(1);
      expect(resOne.data).toEqual(resTwo.data);
      expect(resTwo).toMatchInlineSnapshot(expectedMakeServerFetchyeResponseSnapshot);
    });

    it('should not dedupe concurrent calls for different keys', async () => {
      const fetchye = makeServerFetchye({
        fetchClient,
        promiseStore,
      });

      await Promise.all([
        fetchye('http://example.com/one'),
        fetchye('http://example.com/two'),
      ]);

      expect(fetchClient).toHaveBeenCalledTimes(2);
    });

    it('should permanently reuse the resolved promise for any later call with the same key', async () => {
      const fetchye = makeServerFetchye({
        fetchClient,
        promiseStore,
      });

      await fetchye('http://example.com/dedupe');
      const fetchyeResTwo = await fetchye('http://example.com/dedupe');

      expect(fetchClient).toHaveBeenCalledTimes(1);
      expect(fetchyeResTwo).toMatchInlineSnapshot(expectedMakeServerFetchyeResponseSnapshot);
    });

    it('should bypass deduplication when the run function is called, without replacing the stored promise', async () => {
      const fetchye = makeServerFetchye({
        fetchClient,
        promiseStore,
      });

      const fetchyeRes = await fetchye('http://example.com/dedupe');
      await fetchyeRes.run();

      expect(fetchClient).toHaveBeenCalledTimes(2);

      // a subsequent plain call still resolves from the original stored promise,
      // it is unaffected by run() having fetched fresh data
      const fetchyeResTwo = await fetchye('http://example.com/dedupe');
      expect(fetchClient).toHaveBeenCalledTimes(2);
      expect(fetchyeResTwo).toMatchInlineSnapshot(expectedMakeServerFetchyeResponseSnapshot);
    });

    it('should reject every concurrent caller when the shared request throws', async () => {
      expect.assertions(2);
      fetchClient = jest.fn(async () => ({
        ...defaultPayload,
        ok: false,
        status: 500,
      }));
      const fetchye = makeServerFetchye({
        fetchClient,
        promiseStore,
      });

      const results = await Promise.allSettled([
        fetchye('http://example.com/dedupe', { throwOnError: true }),
        fetchye('http://example.com/dedupe', { throwOnError: true }),
      ]);

      expect(fetchClient).toHaveBeenCalledTimes(1);
      expect(results.map(({ status }) => status)).toEqual(['rejected', 'rejected']);
    });

    it('should permanently reuse a previously rejected promise for a later call with the same key', async () => {
      expect.assertions(3);
      fetchClient = jest.fn(async () => ({
        ...defaultPayload,
        ok: false,
        status: 500,
      }));
      const fetchye = makeServerFetchye({
        fetchClient,
        promiseStore,
      });

      await expect(fetchye('http://example.com/dedupe', { throwOnError: true })).rejects.toBeTruthy();
      await expect(fetchye('http://example.com/dedupe', { throwOnError: true })).rejects.toBeTruthy();

      expect(fetchClient).toHaveBeenCalledTimes(1);
    });
  });

  describe('persistentCache', () => {
    it('throws when persistentCache.isolationKey is missing', async () => {
      await expect(makeServerFetchye({
        fetchClient,
        promiseStore,
      })('http://example.com/persistent', { persistentCache: {} })).rejects.toThrow('makeServerFetchye persistentCache.isolationKey is required when using persistentCache');
    });

    it('throws when persistentCache.ttl is Infinity', async () => {
      await expect(makeServerFetchye({
        fetchClient,
        promiseStore,
      })('http://example.com/persistent', {
        persistentCache: { isolationKey: 'tenant-a', ttl: Number.POSITIVE_INFINITY },
      })).rejects.toThrow('makeServerFetchye persistentCache.ttl cannot be Infinity');
    });

    it('fetches through the in-flight promise store and stores only the resolved value in the persistent cache', async () => {
      const fetchyeRes = await makeServerFetchye({
        fetchClient,
        promiseStore,
      })('http://example.com/persistent', { persistentCache: { isolationKey: 'tenant-a' } });

      const persistentCacheKey = getPersistentCacheKey(
        computeKey('http://example.com/persistent'),
        'tenant-a'
      );

      expect(fetchClient).toHaveBeenCalledTimes(1);
      // the in-flight promise store is still used to fetch/dedupe the request...
      expect(promiseStore.getLocalPromise).toHaveBeenCalledTimes(1);
      expect(promiseStore.storeLocalPromise).toHaveBeenCalledTimes(1);
      // ...but only the resolved value (never the in-flight promise) is written to
      // the persistent cache
      const cached = await persistentCacheStore.get(persistentCacheKey);
      expect(cached).toEqual({ data: expect.any(Object), error: null });
      expect(fetchyeRes).toMatchInlineSnapshot(expectedMakeServerFetchyeResponseSnapshot);
    });

    it('serves a subsequent call directly from the persistent cache, without touching the in-flight promise store', async () => {
      const fetchye = makeServerFetchye({
        fetchClient,
        promiseStore,
      });
      const options = { persistentCache: { isolationKey: 'tenant-a' } };

      await fetchye('http://example.com/persistent', options);
      const getCallsBeforeSecondCall = promiseStore.getLocalPromise.mock.calls.length;
      const storeCallsBeforeSecondCall = promiseStore.storeLocalPromise.mock.calls.length;

      const fetchyeResTwo = await fetchye('http://example.com/persistent', options);

      expect(fetchClient).toHaveBeenCalledTimes(1);
      expect(promiseStore.getLocalPromise).toHaveBeenCalledTimes(getCallsBeforeSecondCall);
      expect(promiseStore.storeLocalPromise).toHaveBeenCalledTimes(storeCallsBeforeSecondCall);
      expect(fetchyeResTwo).toMatchInlineSnapshot(expectedMakeServerFetchyeResponseSnapshot);
    });

    it('does not isolate the shared in-flight promise across different isolationKeys, but does isolate the cached values', async () => {
      const fetchye = makeServerFetchye({
        fetchClient,
        promiseStore,
      });

      await fetchye('http://example.com/persistent', { persistentCache: { isolationKey: 'tenant-a' } });
      await fetchye('http://example.com/persistent', { persistentCache: { isolationKey: 'tenant-b' } });

      const keyForTenantA = getPersistentCacheKey(
        computeKey('http://example.com/persistent'),
        'tenant-a'
      );
      const keyForTenantB = getPersistentCacheKey(
        computeKey('http://example.com/persistent'),
        'tenant-b'
      );

      // both isolationKeys compute the same request key/hash, so the second call
      // reuses the promise already stored by the first, rather than issuing a new
      // request
      expect(fetchClient).toHaveBeenCalledTimes(1);
      // the resolved value is still persisted separately for each isolationKey
      await expect(persistentCacheStore.has(keyForTenantA)).resolves.toBe(true);
      await expect(persistentCacheStore.has(keyForTenantB)).resolves.toBe(true);
    });

    it('dedupes concurrent calls through the in-flight promise store and stores the resolved value once in the persistent cache', async () => {
      const fetchye = makeServerFetchye({
        fetchClient,
        promiseStore,
      });
      const options = { persistentCache: { isolationKey: 'tenant-a' } };

      const [resOne, resTwo] = await Promise.all([
        fetchye('http://example.com/persistent-dedupe', options),
        fetchye('http://example.com/persistent-dedupe', options),
      ]);

      const persistentCacheKey = getPersistentCacheKey(
        computeKey('http://example.com/persistent-dedupe'),
        'tenant-a'
      );

      expect(fetchClient).toHaveBeenCalledTimes(1);
      expect(promiseStore.getLocalPromise).toHaveBeenCalled();
      expect(promiseStore.storeLocalPromise).toHaveBeenCalledTimes(1);
      expect(resOne.data).toEqual(resTwo.data);
      await expect(persistentCacheStore.has(persistentCacheKey)).resolves.toBe(true);
    });

    it('the run function bypasses both the in-flight promise store and the persistent cache, and does not update the cached value', async () => {
      let callCount = 0;
      fetchClient = jest.fn(async () => {
        callCount += 1;
        return makePayload({ callCount });
      });
      const fetchye = makeServerFetchye({
        fetchClient,
        promiseStore,
      });
      const options = { persistentCache: { isolationKey: 'tenant-a' } };

      const fetchyeRes = await fetchye('http://example.com/persistent', options);
      expect(fetchyeRes.data.body).toEqual({ callCount: 1 });

      const runResult = await fetchyeRes.run();
      expect(runResult.data.body).toEqual({ callCount: 2 });
      expect(fetchClient).toHaveBeenCalledTimes(2);

      // a subsequent plain call is still served from the persistent cache entry
      // written by the very first call; run() never updated it
      const fetchyeResTwo = await fetchye('http://example.com/persistent', options);
      expect(fetchClient).toHaveBeenCalledTimes(2);
      expect(fetchyeResTwo.data.body).toEqual({ callCount: 1 });
    });

    it('does not persist a rejected in-flight request to the persistent cache', async () => {
      expect.assertions(2);
      fetchClient = jest.fn(async () => ({
        ...defaultPayload,
        ok: false,
        status: 500,
      }));
      const fetchye = makeServerFetchye({
        fetchClient,
        promiseStore,
      });
      const options = { persistentCache: { isolationKey: 'tenant-a' }, throwOnError: true };

      const results = await Promise.allSettled([
        fetchye('http://example.com/persistent-dedupe', options),
        fetchye('http://example.com/persistent-dedupe', options),
      ]);

      const persistentCacheKey = getPersistentCacheKey(
        computeKey('http://example.com/persistent-dedupe', { throwOnError: true }),
        'tenant-a'
      );

      expect(results.map(({ status }) => status)).toEqual(['rejected', 'rejected']);
      // the shared promise rejected before the persistent cache write was ever
      // reached, so no entry is stored
      await expect(persistentCacheStore.has(persistentCacheKey)).resolves.toBe(false);
    });

    it('honors a custom ttl configuration', async () => {
      const fetchye = makeServerFetchye({
        fetchClient,
        promiseStore,
      });

      const beforeSet = Date.now();
      await fetchye('http://example.com/persistent', {
        persistentCache: {
          isolationKey: 'tenant-a',
          ttl: 60000,
        },
      });

      const persistentCacheKey = getPersistentCacheKey(
        computeKey('http://example.com/persistent'),
        'tenant-a'
      );
      const raw = await persistentCacheStore.getRaw(persistentCacheKey);

      expect(raw.expires).toBeGreaterThanOrEqual(beforeSet + 60000 - 1000);
      expect(raw.expires).toBeLessThanOrEqual(beforeSet + 60000 + 1000);
    });
  });
});
