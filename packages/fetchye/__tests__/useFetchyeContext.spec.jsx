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

import React, { useEffect } from 'react';
import { render } from '@testing-library/react';
import {
  loadingAction,
  setAction,
  deleteAction,
  errorAction,
  clearErrorsAction,
} from 'fetchye-core';
import { useFetchyeContext } from '../src/useFetchyeContext';

global.fetch = () => {};

const actions = {
  loadingAction,
  setAction,
  deleteAction,
  errorAction,
  clearErrorsAction,
};

describe('useFetchyeContext', () => {
  it('should return fetchye context shape', () => {
    let contextResult;
    render(
      <>
        {React.createElement(() => {
          contextResult = useFetchyeContext();
          return <fake-element />;
        })}
      </>
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
        "headless": true,
        "useFetchyeSelector": [Function],
      }
    `);
  });
  it('should receive loading action and return loading state', () => {
    let res;
    render(
      <>
        {React.createElement(() => {
          const { dispatch, useFetchyeSelector } = useFetchyeContext();
          useEffect(() => {
            dispatch(actions.loadingAction({ hash: 'abc123' }));
          }, [dispatch]);
          res = useFetchyeSelector('abc123');
          return <fake-element />;
        })}
      </>
    );
    expect(res).toMatchInlineSnapshot(`
      Object {
        "current": Object {
          "data": undefined,
          "error": undefined,
          "loading": true,
          "query": undefined,
        },
      }
    `);
  });
  it('should receive data action and return data state', () => {
    let res;
    render(
      <>
        {React.createElement(() => {
          const { dispatch, useFetchyeSelector } = useFetchyeContext();
          useEffect(() => {
            dispatch(actions.setAction({ hash: 'abc123', value: 'fakeData' }));
          }, [dispatch]);
          res = useFetchyeSelector('abc123');
          return <fake-element />;
        })}
      </>
    );
    expect(res).toMatchInlineSnapshot(`
      Object {
        "current": Object {
          "data": "fakeData",
          "error": undefined,
          "loading": false,
          "query": undefined,
        },
      }
    `);
  });
  it('should receive error action and return error state', () => {
    let res;
    render(
      <>
        {React.createElement(() => {
          const { dispatch, useFetchyeSelector } = useFetchyeContext();
          useEffect(() => {
            dispatch(actions.errorAction({ hash: 'abc123', error: 'fake error' }));
          }, [dispatch]);
          res = useFetchyeSelector('abc123');
          return <fake-element />;
        })}
      </>
    );
    expect(res).toMatchInlineSnapshot(`
      Object {
        "current": Object {
          "data": undefined,
          "error": "fake error",
          "loading": false,
          "query": undefined,
        },
      }
    `);
  });
});
