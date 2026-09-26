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

import { runAsync } from '../../src/react-server/runAsync';

const fetchClient = jest.fn();

describe('react-server/runAsync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return successful payload', async () => {
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
      computedKey,
      fetcher,
      fetchClient,
      options,
    });
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

  it('should return error like payload', async () => {
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
      computedKey,
      fetcher,
      fetchClient,
      options,
    });
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

    it('should throw an object containing the requestError as the error when a fetch error is present', async () => {
      const mockFetcherResponse = {
        payload: { body: 'something went wrong', ok: true },
        error: new Error('fake error'),
      };

      const fetcher = async () => mockFetcherResponse;
      const options = {
        throwOnError: true,
      };

      await expect(runAsync({
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
