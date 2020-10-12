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

import React, {
  useMemo, useRef, useEffect, useReducer, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useStore } from 'react-redux';
import {
  defaultFetcher, FetchyeContext, defaultEqualityChecker, useSubscription,
} from 'fetchye';

const makeUseFetchyeSelector = ({
  getCacheByKey, cacheSelector, equalityChecker, subscribe,
}) => (key) => {
  const [, forceRender] = useReducer((n) => n + 1, 0);
  const store = useStore();
  const selector = useCallback((state) => getCacheByKey(cacheSelector(state), key), [key]);
  const initialValue = selector(store.getState());

  const lastSelectorValue = useRef(initialValue);
  const selectorValue = useRef(initialValue);

  useEffect(() => {
    selectorValue.current = selector(store.getState());

    function checkForUpdates() {
      const nextValue = selector(store.getState());
      lastSelectorValue.current = selectorValue.current;
      selectorValue.current = nextValue;

      if (!equalityChecker(selectorValue.current, lastSelectorValue.current)) {
        forceRender();
      }
    }
    checkForUpdates();
    return subscribe(checkForUpdates);
  }, [selector, store]);

  return selectorValue;
};

const FetchyeReduxProvider = ({
  cache,
  fetcher = defaultFetcher,
  equalityChecker = defaultEqualityChecker,
  fetchClient = fetch,
  children,
}) => {
  const [notify, subscribe] = useSubscription();
  const reduxDispatch = useDispatch();
  const { cacheSelector, getCacheByKey } = cache;

  const memoizedConfig = useMemo(() => ({
    cache,
    dispatch: (...args) => {
      reduxDispatch(...args);
      notify();
    },
    defaultFetcher: fetcher,
    useFetchyeSelector: makeUseFetchyeSelector({
      getCacheByKey,
      cacheSelector,
      equalityChecker,
      subscribe,
    }),
    fetchClient,
  }), [
    cache,
    cacheSelector,
    fetchClient,
    fetcher,
    getCacheByKey,
    equalityChecker,
    reduxDispatch,
    notify,
    subscribe,
  ]);
  return (
    <FetchyeContext.Provider value={memoizedConfig}>
      {children}
    </FetchyeContext.Provider>
  );
};

FetchyeReduxProvider.propTypes = {
  cache: PropTypes.shape({
    reducer: PropTypes.func.isRequired,
    getCacheByKey: PropTypes.func.isRequired,
    cacheSelector: PropTypes.func.isRequired,
  }).isRequired,
  equalityChecker: PropTypes.func,
  fetchClient: PropTypes.func,
  fetcher: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default FetchyeReduxProvider;
