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
          "loading": "abc123",
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
          "loading": undefined,
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
          "loading": undefined,
        },
      }
    `);
  });
});
