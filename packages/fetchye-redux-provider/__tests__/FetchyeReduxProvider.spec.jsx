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

import React, { useContext } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { FetchyeContext } from 'fetchye-core';
import { SimpleCache } from 'fetchye';
import FetchyeReduxProvider from '../src/FetchyeReduxProvider';

const store = createStore((state) => state, { initialState: {} });

global.fetch = () => {};

describe('FetchyeReduxProvider', () => {
  it('should create fetchye context with global fetch', () => {
    let contextResult;
    render(
      <Provider store={store}>
        <FetchyeReduxProvider cache={SimpleCache()}>
          {React.createElement(() => {
            contextResult = useContext(FetchyeContext);
            return <fake-element />;
          })}
        </FetchyeReduxProvider>
      </Provider>
    );
    expect(contextResult).toMatchInlineSnapshot(`
      Object {
        "cache": Object {
          "cacheSelector": [Function],
          "getCacheByKey": [Function],
          "reducer": [Function],
        },
        "defaultFetcher": [Function],
        "dispatch": [Function],
        "fetchClient": [Function],
        "useFetchyeSelector": [Function],
      }
    `);
  });
  it('should create fetchye context with custom fetch', () => {
    const fakeFetchClient = jest.fn();
    render(
      <Provider store={store}>
        <FetchyeReduxProvider cache={SimpleCache()} fetchClient={fakeFetchClient}>
          {React.createElement(() => {
            const { fetchClient } = useContext(FetchyeContext);
            fetchClient();
            return <fake-element />;
          })}
        </FetchyeReduxProvider>
      </Provider>
    );
    expect(fakeFetchClient).toHaveBeenCalled();
  });
  it('should call cacheSelector within useFetchyeSelector', () => {
    const fakeCacheSelector = jest.fn((state) => state);
    const cache = SimpleCache({ cacheSelector: fakeCacheSelector });
    render(
      <Provider store={store}>
        <FetchyeReduxProvider cache={cache}>
          {React.createElement(() => {
            const { useFetchyeSelector } = useContext(FetchyeContext);
            useFetchyeSelector();
            return <fake-element />;
          })}
        </FetchyeReduxProvider>
      </Provider>
    );
    expect(fakeCacheSelector).toHaveBeenCalled();
  });
});
