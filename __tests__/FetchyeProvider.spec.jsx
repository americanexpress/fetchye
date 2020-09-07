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

import React, { useContext, useEffect } from 'react';
import { render } from '@testing-library/react';
import * as actions from '../src/cache/actions';
import { FetchyeContext } from '../src/FetchyeContext';
import { FetchyeProvider } from '../src/FetchyeProvider';

global.fetch = () => {};

describe('FetchyeProvider', () => {
  it('should create fetchye context with global fetch', () => {
    let contextResult;
    render(
      <FetchyeProvider>
        {React.createElement(() => {
          contextResult = useContext(FetchyeContext);
          return <fake-element />;
        })}
      </FetchyeProvider>
    );
    expect(contextResult.fetchClient).toEqual(global.fetch);
  });
  it('should create fetchye context with custom fetch', () => {
    const fakeFetchClient = jest.fn();
    render(
      <FetchyeProvider fetchClient={fakeFetchClient}>
        {React.createElement(() => {
          const { fetchClient } = useContext(FetchyeContext);
          fetchClient();
          return <fake-element />;
        })}
      </FetchyeProvider>
    );
    expect(fakeFetchClient).toHaveBeenCalled();
  });
  it('should receive loading action and return loading state', () => {
    let res;
    render(
      <FetchyeProvider>
        {React.createElement(() => {
          const { dispatch, useFetchyeSelector } = useContext(FetchyeContext);
          useEffect(() => {
            dispatch(actions.loadingAction({ hash: 'abc123' }));
          }, [dispatch]);
          res = useFetchyeSelector('abc123');
          return <fake-element />;
        })}
      </FetchyeProvider>
    );
    expect(res).toMatchInlineSnapshot(`
      Object {
        "current": Object {
          "data": undefined,
          "error": undefined,
          "loading": true,
        },
      }
    `);
  });
  it('should receive data action and return data state', () => {
    let res;
    render(
      <FetchyeProvider>
        {React.createElement(() => {
          const { dispatch, useFetchyeSelector } = useContext(FetchyeContext);
          useEffect(() => {
            dispatch(actions.setAction({ hash: 'abc123', value: 'fakeData' }));
          }, [dispatch]);
          res = useFetchyeSelector('abc123');
          return <fake-element />;
        })}
      </FetchyeProvider>
    );
    expect(res).toMatchInlineSnapshot(`
      Object {
        "current": Object {
          "data": "fakeData",
          "error": undefined,
          "loading": false,
        },
      }
    `);
  });
  it('should receive error action and return error state', () => {
    let res;
    render(
      <FetchyeProvider>
        {React.createElement(() => {
          const { dispatch, useFetchyeSelector } = useContext(FetchyeContext);
          useEffect(() => {
            dispatch(actions.errorAction({ hash: 'abc123', error: 'fake error' }));
          }, [dispatch]);
          res = useFetchyeSelector('abc123');
          return <fake-element />;
        })}
      </FetchyeProvider>
    );
    expect(res).toMatchInlineSnapshot(`
      Object {
        "current": Object {
          "data": undefined,
          "error": "fake error",
          "loading": false,
        },
      }
    `);
  });
});
