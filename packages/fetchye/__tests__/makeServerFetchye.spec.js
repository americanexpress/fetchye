/*
 * Copyright 2020 American Express Travel Related Services Company, Inc.
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

import { createStore } from 'redux';
import makeServerFetchye from '../src/makeServerFetchye';
import SimpleCache from '../src/SimpleCache';

global.console.error = jest.fn();

const defaultPayload = {
  headers: new global.Headers({
    'Content-Type': 'application/json',
  }),
  ok: true,
  status: 200,
  text: async () => JSON.stringify({
    fakeData: true,
  }),
};

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

// mirrors the local promise API of holocron's promise store
const createTestPromiseStore = () => {
  const promises = new Map();
  return {
    getLocalPromise: jest.fn((domain, key) => promises.get(`${domain}:${key}`)),
    storeLocalPromise: jest.fn((domain, key, promise) => promises.set(`${domain}:${key}`, promise)),
  };
};

describe('makeServerFetchye', () => {
  let cache;
  let store;
  let fetchClient;
  let promiseStore;

  beforeEach(() => {
    cache = SimpleCache();
    store = createStore(cache.reducer, cache.reducer(undefined, { type: '' }));
    promiseStore = createTestPromiseStore();
    fetchClient = jest.fn(async () => ({
      ...defaultPayload,
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should return data in success state', async () => {
    const fetchyeRes = await makeServerFetchye({
      store,
      cache,
      fetchClient,
    })('http://example.com');

    expect(fetchyeRes).toMatchInlineSnapshot(expectedMakeServerFetchyeResponseSnapshot);
  });
  it('should return data in success state when using default cache', async () => {
    const fetchyeRes = await makeServerFetchye({
      store,
      fetchClient,
    })('http://example.com');

    expect(fetchyeRes).toMatchInlineSnapshot(expectedMakeServerFetchyeResponseSnapshot);
  });
  it('should return data in success state if no cache and no store provided', async () => {
    const fetchyeRes = await makeServerFetchye({
      fetchClient,
    })('http://example.com');

    expect(fetchyeRes).toMatchInlineSnapshot(expectedMakeServerFetchyeResponseSnapshot);
  });
  it('should return null in the error state', async () => {
    fetchClient = jest.fn(async () => {
      throw new Error('fake error');
    });
    const fetchyeRes = await makeServerFetchye({
      store,
      cache,
      fetchClient,
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
  it('should return previously loaded data', async () => {
    const fetchye = makeServerFetchye({
      store,
      cache,
      fetchClient,
    });
    await fetchye('http://example.com/two');
    const fetchyeResTwo = await fetchye('http://example.com/two');

    expect(fetchClient).toHaveBeenCalledTimes(1);
    expect(fetchyeResTwo).toMatchInlineSnapshot(expectedMakeServerFetchyeResponseSnapshot);
  });
  it('should reload the data is the run function returned is called', async () => {
    const fetchye = makeServerFetchye({
      store,
      cache,
      fetchClient,
    });
    const fetchyeResTwo = await fetchye('http://example.com/two');
    await fetchyeResTwo.run();
    expect(fetchClient).toHaveBeenCalledTimes(2);
    expect(fetchyeResTwo).toMatchInlineSnapshot(expectedMakeServerFetchyeResponseSnapshot);
  });

  describe('deduplication', () => {
    it('should share a single request between concurrent calls for the same key', async () => {
      const fetchye = makeServerFetchye({
        store,
        cache,
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
        store,
        cache,
        fetchClient,
        promiseStore,
      });

      await Promise.all([
        fetchye('http://example.com/one'),
        fetchye('http://example.com/two'),
      ]);

      expect(fetchClient).toHaveBeenCalledTimes(2);
    });

    it('should leave a concurrent caller without data when no promise store is given', async () => {
      const fetchye = makeServerFetchye({
        store,
        cache,
        fetchClient,
      });

      const [resOne, resTwo] = await Promise.all([
        fetchye('http://example.com/dedupe'),
        fetchye('http://example.com/dedupe'),
      ]);

      expect(resOne.data).not.toBeNull();
      expect(resTwo.data).toBeNull();
    });

    it('should dedupe concurrent calls when no store or cache is given', async () => {
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
    });

    it('should serve a resolved request from the cache rather than the promise store', async () => {
      const fetchye = makeServerFetchye({
        store,
        cache,
        fetchClient,
        promiseStore,
      });

      await fetchye('http://example.com/dedupe');
      const fetchyeRes = await fetchye('http://example.com/dedupe');

      expect(fetchClient).toHaveBeenCalledTimes(1);
      expect(fetchyeRes).toMatchInlineSnapshot(expectedMakeServerFetchyeResponseSnapshot);
    });

    it('should bypass deduplication when the run function is called', async () => {
      const fetchye = makeServerFetchye({
        store,
        cache,
        fetchClient,
        promiseStore,
      });

      const fetchyeRes = await fetchye('http://example.com/dedupe');
      await fetchyeRes.run();

      expect(fetchClient).toHaveBeenCalledTimes(2);
    });

    it('should reject every concurrent caller when the shared request throws', async () => {
      expect.assertions(2);
      fetchClient = jest.fn(async () => ({
        ...defaultPayload,
        ok: false,
        status: 500,
      }));
      const fetchye = makeServerFetchye({
        store,
        cache,
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
  });
});
