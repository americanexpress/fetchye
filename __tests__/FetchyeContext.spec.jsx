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
import { FetchyeReduxProvider, FetchyeContext } from '../src/FetchyeContext';

const store = createStore((state) => state, { initialState: {} });

global.fetch = () => {};

describe('FetchyeContext', () => {
  it('should create fetchye context with global fetch', () => {
    let contextResult;
    render(
      <Provider store={store}>
        <FetchyeReduxProvider cacheSelector={(state) => state}>
          {React.createElement(() => {
            contextResult = useContext(FetchyeContext);
            return <fake-element />;
          })}
        </FetchyeReduxProvider>
      </Provider>
    );
    expect(contextResult).toMatchInlineSnapshot(`
      Object {
        "dispatch": [Function],
        "fetchClient": [Function],
        "useFetchyeSelector": [Function],
      }
    `);
  });
  it('should throw if default useFetchyeSelector is used', () => {
    let contextResult;
    render(
      <Provider store={store}>
        {React.createElement(() => {
          contextResult = useContext(FetchyeContext);
          return <fake-element />;
        })}
      </Provider>
    );
    expect(() => contextResult.useFetchyeSelector()).toThrowErrorMatchingInlineSnapshot(
      '"Could not find a Fetchye Provider. Please add one in a parent component to fix this."'
    );
  });
  it('should create fetchye context with custom fetch', () => {
    const fakeFetchClient = jest.fn();
    render(
      <Provider store={store}>
        <FetchyeReduxProvider fetchClient={fakeFetchClient} cacheSelector={(state) => state}>
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
    render(
      <Provider store={store}>
        <FetchyeReduxProvider cacheSelector={fakeCacheSelector}>
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
