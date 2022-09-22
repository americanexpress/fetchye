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

// eslint-disable-next-line import/no-extraneous-dependencies -- importing redux just as a test fixture, it doesn't need to be a dep
import { createStore } from 'redux';
import {
  loadingAction,
  setAction,
  deleteAction,
  errorAction,
  clearErrorsAction,
  ACTION_NAMESPACE,

} from 'fetchye-core';

const actions = {
  loadingAction,
  setAction,
  deleteAction,
  errorAction,
  clearErrorsAction,
};

const fakeError = new Error('Fake Error');
// eslint-disable-next-line jest/no-export -- exporting test helpers
export const createScenario = (dispatch, actionKeys, hash) => {
  const fakeData = {
    status: 200,
    ok: true,
    body: {
      fakeData: true,
    },
  };
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

// eslint-disable-next-line jest/no-export -- exporting test helpers
export function testCacheInterface(CacheFunc) {
  const cache = CacheFunc();
  let store;
  beforeEach(() => {
    store = createStore(cache.reducer, cache.reducer(undefined, { type: '' }));
  });
  it('reflects load state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction'], 'abc1234');
    expect(getState()).toMatchSnapshot();
  });
  it('reflects load to success state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'setAction'], 'abc1234');
    expect(getState()).toMatchSnapshot();
  });
  it('reflects load to error state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'errorAction'], 'abc1234');
    expect(getState()).toMatchSnapshot();
  });
  it('reflects load to success to delete state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'setAction', 'deleteAction'], 'abc1234');
    expect(getState()).toMatchSnapshot();
  });
  it('reflects load to error to clear errors state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'errorAction', 'clearErrorsAction'], 'abc1234');
    expect(getState()).toMatchSnapshot();
  });
  it('should reflect load to success to error state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'setAction', 'errorAction'], 'abc1234');
    expect(getState()).toMatchSnapshot();
  });
  it('should reflect load to error to success state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'errorAction', 'setAction'], 'abc1234');
    expect(getState()).toMatchSnapshot();
  });
  it('reflects multiple hashes stored', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'setAction'], 'abc1234');
    createScenario(dispatch, ['loadingAction', 'errorAction'], 'def5678');
    expect(getState()).toMatchSnapshot();
  });
  it(`returns default state if unknown ${ACTION_NAMESPACE} action type`, () => {
    const { dispatch, getState } = store;
    dispatch({ type: ACTION_NAMESPACE });
    expect(getState()).toMatchSnapshot();
  });

  it('accepts a cacheSelector', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'errorAction'], 'def5678');
    const cacheSelector = (state) => state.someSliceOfState;
    const nextCache = CacheFunc({ cacheSelector });
    expect(nextCache.cacheSelector({ someSliceOfState: getState() })).toMatchSnapshot();
  });

  it('returns default cacheSelector', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'errorAction'], 'def5678');
    const nextCache = CacheFunc();
    expect(nextCache.cacheSelector(getState())).toMatchSnapshot();
  });

  describe('getCacheByKey', () => {
    it('returns correct data', () => {
      const { dispatch, getState } = store;
      createScenario(dispatch, ['loadingAction', 'setAction'], 'abc1234');
      expect(cache.getCacheByKey(getState(), 'abc1234').loading).toEqual(false);
      expect(cache.getCacheByKey(getState(), 'abc1234').data).toEqual({
        body: { fakeData: true },
        ok: true,
        status: 200,
      });
    });

    it('returns correct loading value', () => {
      const { dispatch, getState } = store;
      createScenario(dispatch, ['loadingAction'], 'abc1234');
      expect(cache.getCacheByKey(getState(), 'abc1234').loading).toEqual(true);
    });

    it('returns error', () => {
      const { dispatch, getState } = store;
      createScenario(dispatch, ['loadingAction', 'errorAction'], 'def5678');
      expect(cache.getCacheByKey(getState(), 'def5678').loading).toEqual(false);
      expect(cache.getCacheByKey(getState(), 'def5678').error).toEqual(fakeError);
    });

    it('returns empty data error loading if cache undefined', () => {
      expect(cache.getCacheByKey(undefined, 'abc1234')).toMatchSnapshot();
    });
  });
}
