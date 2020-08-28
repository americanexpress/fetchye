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
import { makeServerFetchye } from '../src/makeServerFetchye';
import { SimpleCache } from '../src/cache';

const cache = SimpleCache();
const store = createStore(cache.reducer, cache.reducer(undefined, { type: '' }));

global.console.error = jest.fn();

const defaultPayload = {
  headers: new global.Headers({
    'Content-Type': 'application/json',
  }),
  ok: true,
  status: 200,
  json: async () => ({
    fakeData: true,
  }),
};

describe('makeServerFetchye', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should return data in success state', async () => {
    const fetchClient = jest.fn(async () => ({
      ...defaultPayload,
    }));
    const fetchyeRes = await makeServerFetchye({
      store,
      cache,
      fetchClient,
    })('http://example.com');

    expect(fetchyeRes).toMatchInlineSnapshot(`
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
      }
    `);
  });
  it('should return data in success state when using default cache', async () => {
    const fetchClient = jest.fn(async () => ({
      ...defaultPayload,
    }));
    const fetchyeRes = await makeServerFetchye({
      store,
      fetchClient,
    })('http://example.com');

    expect(fetchyeRes).toMatchInlineSnapshot(`
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
        "error": undefined,
      }
    `);
  });
  it('should return data in success state if no cache and no store provided', async () => {
    const fetchClient = jest.fn(async () => ({
      ...defaultPayload,
    }));
    const fetchyeRes = await makeServerFetchye({
      fetchClient,
    })('http://example.com');

    expect(fetchyeRes).toMatchInlineSnapshot(`
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
      }
    `);
  });
  it('should return error in error state', async () => {
    const fetchClient = jest.fn(async () => {
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
        "data": undefined,
        "error": [Error: fake error],
      }
    `);
  });
  it('should return previously loaded data', async () => {
    const fetchClient = jest.fn(async () => ({
      ...defaultPayload,
    }));
    const fetchye = makeServerFetchye({
      store,
      cache,
      fetchClient,
    });
    await fetchye('http://example.com/two');
    const fetchyeResTwo = await fetchye('http://example.com/two');

    expect(fetchClient).toHaveBeenCalledTimes(1);
    expect(fetchyeResTwo).toMatchInlineSnapshot(`
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
        "error": undefined,
      }
    `);
  });
});
