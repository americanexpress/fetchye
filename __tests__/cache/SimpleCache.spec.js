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

import { createStore } from 'redux';
import SimpleCache from '../../src/cache/SimpleCache';
import * as actions from '../../src/cache/actions';

const fakeError = new Error('Fake Error');
const fakeData = {
  status: 200,
  ok: true,
  body: {
    fakeData: true,
  },
};

const createScenario = (dispatch, actionKeys, hash) => {
  const actionOrder = actionKeys.map((key) => actions[key]);
  actionOrder.forEach((actionCreator) => {
    dispatch(
      actionCreator({
        hash,
        error: fakeError,
        value: fakeData,
      })
    );
  });
};

describe('SimpleCache', () => {
  let store;
  const cache = SimpleCache();
  beforeEach(() => {
    store = createStore(cache.reducer, cache.reducer(undefined, { type: '' }));
  });
  it('should reflect load state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction'], 'abc1234');
    expect(getState()).toMatchInlineSnapshot(`
      Object {
        "data": Object {},
        "errors": Object {},
        "loading": Object {
          "abc1234": "abc1234",
        },
      }
    `);
  });
  it('should reflect load to success state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'setAction'], 'abc1234');
    expect(getState()).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "abc1234": Object {
            "body": Object {
              "fakeData": true,
            },
            "ok": true,
            "status": 200,
          },
        },
        "errors": Object {},
        "loading": Object {},
      }
    `);
  });
  it('should reflect load to error state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'errorAction'], 'abc1234');
    expect(getState()).toMatchInlineSnapshot(`
      Object {
        "data": Object {},
        "errors": Object {
          "abc1234": [Error: Fake Error],
        },
        "loading": Object {},
      }
    `);
  });
  it('should reflect load to success to delete state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'setAction', 'deleteAction'], 'abc1234');
    expect(getState()).toMatchInlineSnapshot(`
      Object {
        "data": Object {},
        "errors": Object {},
        "loading": Object {},
      }
    `);
  });
  it('should reflect load to error to clear errors state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'errorAction', 'clearErrorsAction'], 'abc1234');
    expect(getState()).toMatchInlineSnapshot(`
      Object {
        "data": Object {},
        "errors": Object {},
        "loading": Object {},
      }
    `);
  });
  it('should reflect multiple hashes stored', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'setAction'], 'abc1234');
    createScenario(dispatch, ['loadingAction', 'errorAction'], 'def5678');
    expect(getState()).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "abc1234": Object {
            "body": Object {
              "fakeData": true,
            },
            "ok": true,
            "status": 200,
          },
        },
        "errors": Object {
          "def5678": [Error: Fake Error],
        },
        "loading": Object {},
      }
    `);
  });
  it('should return default state if unknown @fetchye action type', () => {
    const { dispatch, getState } = store;
    dispatch({ type: '@fetchye' });
    expect(getState()).toMatchInlineSnapshot(`
      Object {
        "data": Object {},
        "errors": Object {},
        "loading": Object {},
      }
    `);
  });

  describe('getCacheByKey', () => {
    it('should return data error loading', () => {
      const { dispatch, getState } = store;
      createScenario(dispatch, ['loadingAction', 'setAction'], 'abc1234');
      createScenario(dispatch, ['loadingAction', 'errorAction'], 'def5678');
      expect(cache.getCacheByKey(getState(), 'abc1234')).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "body": Object {
              "fakeData": true,
            },
            "ok": true,
            "status": 200,
          },
          "error": undefined,
          "loading": undefined,
        }
      `);
    });
    it('should return empty data error loading if cache undefined', () => {
      expect(cache.getCacheByKey(undefined, 'abc1234')).toMatchInlineSnapshot(`
        Object {
          "data": undefined,
          "error": undefined,
          "loading": undefined,
        }
      `);
    });
  });
  it('should accept a cacheSelector', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'errorAction'], 'def5678');
    const cacheSelector = (state) => state.someSliceOfState;
    const nextCache = SimpleCache({ cacheSelector });
    expect(nextCache.cacheSelector({ someSliceOfState: getState() })).toMatchInlineSnapshot(`
        Object {
          "data": Object {},
          "errors": Object {
            "def5678": [Error: Fake Error],
          },
          "loading": Object {},
        }
      `);
  });
  it('should return default cacheSelector', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'errorAction'], 'def5678');
    const nextCache = SimpleCache();
    expect(nextCache.cacheSelector(getState())).toMatchInlineSnapshot(`
      Object {
        "data": Object {},
        "errors": Object {
          "def5678": [Error: Fake Error],
        },
        "loading": Object {},
      }
    `);
  });
});
