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

describe('react-server/makeServerFetchye', () => {
  let fetchClient;
  let promiseStore;

  beforeEach(() => {
    promiseStore = createTestPromiseStore();
    fetchClient = jest.fn(async () => ({
      ...defaultPayload,
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
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

  it('should return data in success state', async () => {
    const fetchyeRes = await makeServerFetchye({
      fetchClient,
      promiseStore,
    })('http://example.com');

    expect(fetchyeRes).toMatchInlineSnapshot(expectedMakeServerFetchyeResponseSnapshot);
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

  describe('deduplication', () => {
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

    it('should serve a subsequent call from the promise store', async () => {
      const fetchye = makeServerFetchye({
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
