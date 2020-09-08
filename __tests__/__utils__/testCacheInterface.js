/* eslint-disable jest/no-export */
import { createStore } from 'redux';
import * as actions from '../../src/cache/actions';
import { ACTION_NAMESPACE } from '../../src/cache/constants';

export const createScenario = (dispatch, actionKeys, hash) => {
  const fakeError = new Error('Fake Error');
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

export function testCacheInterface(CacheFunc) {
  const cache = CacheFunc();
  let store;
  beforeEach(() => {
    store = createStore(cache.reducer, cache.reducer(undefined, { type: '' }));
  });
  it('should reflect load state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction'], 'abc1234');
    expect(getState()).toMatchSnapshot();
  });
  it('should reflect load to success state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'setAction'], 'abc1234');
    expect(getState()).toMatchSnapshot();
  });
  it('should reflect load to error state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'errorAction'], 'abc1234');
    expect(getState()).toMatchSnapshot();
  });
  it('should reflect load to success to delete state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'setAction', 'deleteAction'], 'abc1234');
    expect(getState()).toMatchSnapshot();
  });
  it('should reflect load to error to clear errors state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'errorAction', 'clearErrorsAction'], 'abc1234');
    expect(getState()).toMatchSnapshot();
  });
  it('should reflect multiple hashes stored', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'setAction'], 'abc1234');
    createScenario(dispatch, ['loadingAction', 'errorAction'], 'def5678');
    expect(getState()).toMatchSnapshot();
  });
  it(`should return default state if unknown ${ACTION_NAMESPACE} action type`, () => {
    const { dispatch, getState } = store;
    dispatch({ type: ACTION_NAMESPACE });
    expect(getState()).toMatchSnapshot();
  });

  describe('getCacheByKey', () => {
    it('should return data error loading', () => {
      const { dispatch, getState } = store;
      createScenario(dispatch, ['loadingAction', 'setAction'], 'abc1234');
      createScenario(dispatch, ['loadingAction', 'errorAction'], 'def5678');
      expect(cache.getCacheByKey(getState(), 'abc1234')).toMatchSnapshot();
    });
    it('should return empty data error loading if cache undefined', () => {
      expect(cache.getCacheByKey(undefined, 'abc1234')).toMatchSnapshot();
    });
    it('should accept a cacheSelector', () => {
      const { dispatch, getState } = store;
      createScenario(dispatch, ['loadingAction', 'errorAction'], 'def5678');
      const cacheSelector = (state) => state.someSliceOfState;
      const nextCache = CacheFunc({ cacheSelector });
      expect(nextCache.cacheSelector({ someSliceOfState: getState() })).toMatchSnapshot();
    });
    it('should return default cacheSelector', () => {
      const { dispatch, getState } = store;
      createScenario(dispatch, ['loadingAction', 'errorAction'], 'def5678');
      const nextCache = CacheFunc();
      expect(nextCache.cacheSelector(getState())).toMatchSnapshot();
    });
  });
}
