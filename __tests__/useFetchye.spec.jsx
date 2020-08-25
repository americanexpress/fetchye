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

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { FetchyeReduxProvider } from '../src/FetchyeContext';
import { useFetchye } from '../src/useFetchye';
import reducer from '../src/cache/immutable/reducer';

const store = createStore(reducer, reducer(undefined, { type: '' }));

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

describe('useFetchye', () => {
  it('should return loading state', () => {
    let fetchyeRes;
    const fetchClient = jest.fn(async () => ({
      ...defaultPayload,
    }));
    render(
      <Provider store={store}>
        <FetchyeReduxProvider fetchClient={fetchClient} cacheSelector={(state) => state}>
          {React.createElement(() => {
            fetchyeRes = useFetchye('http://example.com');
            return null;
          })}
        </FetchyeReduxProvider>
      </Provider>
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
    const fetchClient = jest.fn(async () => ({
      ...defaultPayload,
    }));
    render(
      <Provider store={store}>
        <FetchyeReduxProvider fetchClient={fetchClient} cacheSelector={(state) => state}>
          {React.createElement(() => {
            fetchyeRes = useFetchye('http://example.com');
            return null;
          })}
        </FetchyeReduxProvider>
      </Provider>
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
  it('should delay execution when awaiting the existence of a variable', async () => {
    let fetchyeResOne;
    let fetchyeResTwo;
    const fetchClient = jest.fn(async (url) => {
      if (url === 'http://example.com/one') {
        return {
          ...defaultPayload,
          json: async () => ({
            id: 'abc123',
          }),
        };
      }
      return {
        ...defaultPayload,
        json: async () => ({
          resourceUrl: url,
        }),
      };
    });
    render(
      <Provider store={store}>
        <FetchyeReduxProvider fetchClient={fetchClient} cacheSelector={(state) => state}>
          {React.createElement(() => {
            fetchyeResOne = useFetchye('http://example.com/one');
            fetchyeResTwo = useFetchye(
              () => `http://example.com/two/id/${fetchyeResOne.data.body.id}`
            );
            return null;
          })}
        </FetchyeReduxProvider>
      </Provider>
    );
    await waitFor(() => fetchyeResOne.isLoading === false && fetchyeResTwo.isLoading === false);
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
    expect(fetchClient.mock.calls).toMatchInlineSnapshot(`
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
    const fetchClient = jest.fn(async () => ({
      ...defaultPayload,
    }));
    render(
      <Provider store={store}>
        <FetchyeReduxProvider fetchClient={fetchClient} cacheSelector={(state) => state}>
          {React.createElement(() => {
            fetchyeRes = useFetchye('http://example.com/one', { lazy: true });
            return null;
          })}
        </FetchyeReduxProvider>
      </Provider>
    );
    await waitFor(() => fetchyeRes.isLoading === false);
    expect(fetchClient).not.toHaveBeenCalled();
  });
  it('should return data when run method is called', async () => {
    let fetchyeRes;
    const fetchClient = jest.fn(async () => ({
      ...defaultPayload,
    }));
    render(
      <Provider store={store}>
        <FetchyeReduxProvider fetchClient={fetchClient} cacheSelector={(state) => state}>
          {React.createElement(() => {
            fetchyeRes = useFetchye('http://example.com/one', { lazy: true });
            return null;
          })}
        </FetchyeReduxProvider>
      </Provider>
    );
    await fetchyeRes.run();
    expect(fetchClient.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "http://example.com/one",
          Object {
            "lazy": true,
          },
        ],
      ]
    `);
  });
});
