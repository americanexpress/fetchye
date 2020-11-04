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
import OneFetchyeProvider from '../src/OneFetchyeProvider';

const store = createStore((state) => state, { initialState: {} });

global.fetch = () => {};

describe('OneFetchyeProvider', () => {
  it('creates fetchye context', () => {
    let contextResult;
    render(
      <Provider store={store}>
        <OneFetchyeProvider>
          {React.createElement(() => {
            contextResult = useContext(FetchyeContext);
            return <fake-element />;
          })}
        </OneFetchyeProvider>
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
});
