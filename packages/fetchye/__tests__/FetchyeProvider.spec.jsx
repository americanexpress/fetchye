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
import { act, render } from '@testing-library/react';
import {
  FetchyeContext,
  loadingAction,
  setAction,
  deleteAction,
  errorAction,
  clearErrorsAction,
} from 'fetchye-core';
import PropTypes from 'prop-types';
import FetchyeProvider from '../src/FetchyeProvider';

global.fetch = () => {};

const actions = {
  loadingAction,
  setAction,
  deleteAction,
  errorAction,
  clearErrorsAction,
};

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
          "query": undefined,
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
          "query": undefined,
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
          "query": undefined,
        },
      }
    `);
  });
  it('should return a stable response from useFetchyeSelector that changes properly with a changed input', () => {
    const initialData = {
      data: {
        key1: 'val1',
        key2: 'val2',
      },
      loading: {},
      errors: {},
    };
    const captureValue = jest.fn();

    const Component = ({ id }) => {
      const { useFetchyeSelector } = useContext(FetchyeContext);
      const selectedRef = useFetchyeSelector(id);
      captureValue(selectedRef.current);
      return <fake-element />;
    };

    Component.propTypes = {
      id: PropTypes.string.isRequired,
    };

    const { rerender } = render(
      <FetchyeProvider initialData={initialData}>
        <Component id="key1" />
      </FetchyeProvider>
    );
    act(() => {
      rerender(
        <FetchyeProvider initialData={initialData}>
          <Component id="key2" />
        </FetchyeProvider>
      );
    });

    // The value will have been captured 3 times.
    // The first render causes val1 to be captured.
    // The second render causes val1 to be captured again, but queues the effect
    // The effect causes a third render that captures val2 as expected
    expect(captureValue).toMatchSnapshot();
  });
});
