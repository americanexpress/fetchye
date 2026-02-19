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

import { runAsync } from '../src/runAsync';

const dispatch = jest.fn();
const fetchClient = jest.fn();

describe('runAsync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return successful payload and actions', async () => {
    const computedKey = {
      hash: '1234',
      key: 'http://example.com',
    };
    const fetcher = async () => ({
      payload: { body: { fake: true } },
      error: undefined,
    });
    const options = {};
    const data = await runAsync({
      dispatch,
      computedKey,
      fetcher,
      fetchClient,
      options,
    });
    expect(dispatch.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "hash": "1234",
            "type": "@fetchye/IS_LOADING",
          },
        ],
        Array [
          Object {
            "hash": "1234",
            "type": "@fetchye/SET_DATA",
            "value": Object {
              "body": Object {
                "fake": true,
              },
            },
          },
        ],
      ]
    `);
    expect(data).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "body": Object {
            "fake": true,
          },
        },
        "error": undefined,
      }
    `);
  });
  it('should return error like payload and actions', async () => {
    const computedKey = {
      hash: '1234',
      key: 'http://example.com',
    };
    const fetcher = async () => ({
      payload: undefined,
      error: new Error('fake error'),
    });
    const options = {};
    const data = await runAsync({
      dispatch,
      computedKey,
      fetcher,
      fetchClient,
      options,
    });
    expect(dispatch.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "hash": "1234",
            "type": "@fetchye/IS_LOADING",
          },
        ],
        Array [
          Object {
            "error": [Error: fake error],
            "hash": "1234",
            "type": "@fetchye/ERROR",
          },
        ],
      ]
    `);
    expect(data).toMatchInlineSnapshot(`
      Object {
        "data": undefined,
        "error": [Error: fake error],
      }
    `);
  });

  describe('options.throwOnError is enabled', () => {
    const computedKey = {
      hash: '1234',
      key: 'http://example.com',
    };

    it('should throw an object containing the response payload as the error', async () => {
      const mockFetcherResponse = {
        payload: { body: { fake: true }, ok: false },
      };

      const fetcher = async () => mockFetcherResponse;
      const options = {
        throwOnError: true,
      };

      await expect(runAsync({
        dispatch,
        computedKey,
        fetcher,
        fetchClient,
        options,
      })
      ).rejects.toEqual({
        ...mockFetcherResponse.payload,
        error: mockFetcherResponse.payload.body,
      });
    });

    it('should throw an object containing the requestError as the error when response payload is null', async () => {
      const mockFetcherResponse = {
        payload: { body: null, ok: false },
        error: new Error('fake error'),
      };

      const fetcher = async () => mockFetcherResponse;
      const options = {
        throwOnError: true,
      };

      await expect(runAsync({
        dispatch,
        computedKey,
        fetcher,
        fetchClient,
        options,
      })
      ).rejects.toEqual({
        ...mockFetcherResponse.payload,
        error: mockFetcherResponse.error,
      });
    });
  });
});
