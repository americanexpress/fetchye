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

import React, { useRef } from 'react';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
// eslint-disable-next-line import/no-extraneous-dependencies -- we are importing the provider just during tests, it doesn't need to be a dep
import { FetchyeReduxProvider } from 'fetchye-redux-provider';
import FetchyeProvider from '../src/FetchyeProvider';
import useFetchye from '../src/useFetchye';
import SimpleCache from '../src/SimpleCache';

const cache = SimpleCache();
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

const ReduxSetup = (props) => {
  const currentStore = useRef(createStore(cache.reducer, cache.reducer(undefined, { type: '' })));

  return (
    <Provider store={currentStore.current}>
      <FetchyeReduxProvider {...props} />
    </Provider>
  );
};

const noop = ({ children }) => children;

describe('useFetchye', () => {
  [
    ['FetchyeReduxProvider', ReduxSetup],
    ['FetchyeProvider', FetchyeProvider],
    ['Headless', noop],
  ].forEach(([name, AFetchyeProvider]) => {
    describe(`${name}`, () => {
      beforeEach(() => {
        jest.resetAllMocks();
      });
      it('should return loading state', async () => {
        let fetchyeRes;
        global.fetch = jest.fn(async () => ({
          ...defaultPayload,
        }));
        render(
          <AFetchyeProvider cache={cache}>
            {React.createElement(() => {
              fetchyeRes = useFetchye('http://example.com');
              return null;
            })}
          </AFetchyeProvider>
        );

        expect(fetchyeRes).toMatchInlineSnapshot(`
          Object {
            "data": undefined,
            "error": undefined,
            "isLoading": true,
            "run": [Function],
          }
        `);
      });
      it('should return data success state', async () => {
        let fetchyeRes;
        global.fetch = jest.fn(async () => ({
          ...defaultPayload,
        }));
        render(
          <AFetchyeProvider cache={cache}>
            {React.createElement(() => {
              fetchyeRes = useFetchye('http://example.com');
              return null;
            })}
          </AFetchyeProvider>
        );
        await waitFor(() => fetchyeRes.isLoading === false);
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
            "isLoading": false,
            "run": [Function],
          }
        `);
      });
      it('should call fetch with the right headers when passed dynamic headers', async () => {
        let fetchyeRes;
        let dynamicValueCount = 0;
        global.fetch = jest.fn(async () => ({
          ...defaultPayload,
        }));
        render(
          <AFetchyeProvider cache={cache}>
            {React.createElement(() => {
              fetchyeRes = useFetchye('http://example.com', {
                headers: () => ({
                  dynamicHeader: `dynamic value ${dynamicValueCount}`,
                }),
                mapOptionsToKey: (options) => ({
                  ...options,
                  dynamicHeader: null,
                }),
              });
              return null;
            })}
          </AFetchyeProvider>
        );
        await waitFor(() => fetchyeRes.isLoading === false);
        dynamicValueCount += 1;
        await fetchyeRes.run();
        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(global.fetch).toHaveBeenNthCalledWith(1, 'http://example.com', {
          headers: {
            dynamicHeader: 'dynamic value 0',
          },
          mapOptionsToKey: expect.any(Function),
        });
        expect(global.fetch).toHaveBeenNthCalledWith(2, 'http://example.com', {
          headers: {
            dynamicHeader: 'dynamic value 1',
          },
          mapOptionsToKey: expect.any(Function),
        });
      });
      it('should return data success state when response is empty (204 no content)', async () => {
        let fetchyeRes;
        global.fetch = jest.fn(async () => ({
          ...defaultPayload,
          status: 204,
          text: async () => '',
        }));
        render(
          <AFetchyeProvider cache={cache}>
            {React.createElement(() => {
              fetchyeRes = useFetchye('http://example.com');
              return null;
            })}
          </AFetchyeProvider>
        );
        await waitFor(() => fetchyeRes.isLoading === false);
        expect(fetchyeRes).toMatchInlineSnapshot(`
          Object {
            "data": Object {
              "body": "",
              "headers": Object {
                "content-type": "application/json",
              },
              "ok": true,
              "status": 204,
            },
            "error": undefined,
            "isLoading": false,
            "run": [Function],
          }
        `);
      });
      it('should delay execution when awaiting the existence of a variable', async () => {
        let fetchyeResOne;
        let fetchyeResTwo;
        global.fetch = jest.fn(async (url) => {
          if (url === 'http://example.com/one') {
            return {
              ...defaultPayload,
              text: async () => JSON.stringify({
                id: 'abc123',
              }),
            };
          }
          return {
            ...defaultPayload,
            text: async () => JSON.stringify({
              resourceUrl: url,
            }),
          };
        });
        render(
          <AFetchyeProvider cache={cache}>
            {React.createElement(() => {
              fetchyeResOne = useFetchye('http://example.com/one');
              fetchyeResTwo = useFetchye(
                () => `http://example.com/two/id/${fetchyeResOne.data.body.id}`
              );
              return null;
            })}
          </AFetchyeProvider>
        );
        await waitFor(() => !!fetchyeResOne.data && !!fetchyeResTwo.data);
        expect(fetchyeResTwo).toMatchInlineSnapshot(`
          Object {
            "data": Object {
              "body": Object {
                "resourceUrl": "http://example.com/two/id/abc123",
              },
              "headers": Object {
                "content-type": "application/json",
              },
              "ok": true,
              "status": 200,
            },
            "error": undefined,
            "isLoading": false,
            "run": [Function],
          }
        `);
        expect(global.fetch.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              "http://example.com/one",
              Object {},
            ],
            Array [
              "http://example.com/two/id/abc123",
              Object {},
            ],
          ]
        `);
      });
      it('should operate lazily and not call fetchClient', async () => {
        let fetchyeRes;
        global.fetch = jest.fn(async () => ({
          ...defaultPayload,
        }));
        render(
          <AFetchyeProvider cache={cache}>
            {React.createElement(() => {
              fetchyeRes = useFetchye('http://example.com/one', { defer: true });
              return null;
            })}
          </AFetchyeProvider>
        );
        await waitFor(() => fetchyeRes.isLoading === false);
        expect(global.fetch).not.toHaveBeenCalled();
      });
      it('should return data when run method is called', async () => {
        let fetchyeRes;
        global.fetch = jest.fn(async () => ({
          ...defaultPayload,
        }));
        render(
          <AFetchyeProvider cache={cache}>
            {React.createElement(() => {
              fetchyeRes = useFetchye('http://example.com/one', { defer: true });
              return null;
            })}
          </AFetchyeProvider>
        );
        await fetchyeRes.run();
        expect(global.fetch.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              "http://example.com/one",
              Object {
                "defer": true,
              },
            ],
          ]
        `);
      });
      it('should use fetcher in hook over provider fetcher', async () => {
        const customFetchClient = jest.fn(async () => ({
          ...defaultPayload,
          status: 201,
        }));
        const customFetcher = async (fetchClient, key, options) => {
          const res = await customFetchClient(key, options);
          return {
            payload: {
              ok: res.ok,
              status: res.status,
              body: JSON.parse(await res.text()),
            },
            error: undefined,
          };
        };
        render(
          <AFetchyeProvider cache={cache}>
            {React.createElement(() => {
              useFetchye('http://example.com/test', {}, customFetcher);
              return null;
            })}
          </AFetchyeProvider>
        );
        expect(customFetchClient.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              "http://example.com/test",
              Object {},
            ],
          ]
        `);
      });
      it('should return initialState', async () => {
        let fetchyeRes;
        global.fetch = jest.fn(async () => {});
        render(
          <AFetchyeProvider cache={cache}>
            {React.createElement(() => {
              fetchyeRes = useFetchye('http://example.com', {
                initialData: {
                  data: {
                    body: {
                      initialData: true,
                    },
                  },
                  loading: false,
                  error: null,
                },
              });
              return null;
            })}
          </AFetchyeProvider>
        );
        expect(global.fetch).not.toHaveBeenCalled();
        expect(fetchyeRes).toMatchInlineSnapshot(`
          Object {
            "data": Object {
              "body": Object {
                "initialData": true,
              },
            },
            "error": null,
            "isLoading": false,
            "run": [Function],
          }
        `);
      });
      it('should ignore cache', async () => {
        let fetchyeRes;
        global.fetch = jest.fn(async () => ({ ...defaultPayload }));
        render(
          <AFetchyeProvider cache={cache}>
            {React.createElement(() => {
              const { isLoading } = useFetchye('http://example.com/one');
              if (isLoading === true) {
                return null;
              }
              return React.createElement(() => {
                fetchyeRes = useFetchye('http://example.com/one', { forceInitialFetch: true });
                return null;
              });
            })}
          </AFetchyeProvider>
        );
        await waitFor(() => fetchyeRes.isLoading === false);

        expect(global.fetch.mock.calls).toHaveLength(2);
      });
    });
  });

  describe('With provider', () => {
    [
      ['FetchyeReduxProvider', ReduxSetup],
      ['FetchyeProvider', FetchyeProvider],
    ].forEach(([name, AFetchyeProvider]) => {
      describe(`${name}`, () => {
        it('ensures fetch is called once per key', async () => {
          const fakeFetchClient = jest.fn();
          global.fetch = fakeFetchClient;
          render(
            <AFetchyeProvider cache={cache}>
              {React.createElement(() => {
                useFetchye('http://example.com');
                return null;
              })}
              {React.createElement(() => {
                useFetchye('http://example.com');
                return null;
              })}
            </AFetchyeProvider>
          );
          expect(fakeFetchClient).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
