import React, { useEffect } from 'react';
import { render } from '@testing-library/react';
import * as actions from '../src/cache/actions';
import { useFetchyeContext } from '../src/useFetchyeContext';

global.fetch = () => {};

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
          "loading": "abc123",
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
          "loading": undefined,
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
          "loading": undefined,
        },
      }
    `);
  });
});
