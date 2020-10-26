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
  useMemo, useReducer, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  defaultEqualityChecker, useSubscription, defaultFetcher, FetchyeContext,
// eslint-disable-next-line import/no-unresolved
} from 'fetchye-core';
import SimpleCache from './SimpleCache';
import useRefReducer from './useRefReducer';

const makeUseFetchyeSelector = ({
  fetchyeState, subscribe, getCacheByKey, equalityChecker,
}) => (key) => {
  const [, forceRender] = useReducer((n) => n + 1, 0);
  const initialValue = getCacheByKey(fetchyeState.current, key);
  const lastSelectorValue = useRef(initialValue);
  const selectorValue = useRef(initialValue);

  useEffect(() => {
    selectorValue.current = getCacheByKey(fetchyeState.current, key);

    function checkForUpdates() {
      const nextValue = getCacheByKey(fetchyeState.current, key);
      lastSelectorValue.current = selectorValue.current;
      selectorValue.current = nextValue;
      if (equalityChecker(selectorValue.current, lastSelectorValue.current)) {
        return;
      }
      forceRender();
    }

    checkForUpdates();
    return subscribe(checkForUpdates);
  }, [key]);

  return selectorValue;
};

export const FetchyeProvider = ({
  cache = SimpleCache(),
  fetcher = defaultFetcher,
  equalityChecker = defaultEqualityChecker,
  fetchClient = fetch,
  initialData = cache.reducer(undefined, { type: '' }),
  children,
}) => {
  const [notify, subscribe] = useSubscription();
  const [fetchyeState, dispatch] = useRefReducer(cache.reducer, initialData, notify);

  const memoizedConfig = useMemo(() => ({
    dispatch,
    cache,
    defaultFetcher: fetcher,
    useFetchyeSelector: makeUseFetchyeSelector({
      fetchyeState,
      subscribe,
      getCacheByKey: cache.getCacheByKey,
      equalityChecker,
    }),
    fetchClient,
  }), [cache, equalityChecker, fetchClient, fetcher, subscribe, fetchyeState, dispatch]);

  return (
    <FetchyeContext.Provider value={memoizedConfig}>
      {children}
    </FetchyeContext.Provider>
  );
};

FetchyeProvider.propTypes = {
  cache: PropTypes.shape({
    reducer: PropTypes.func,
    getCacheByKey: PropTypes.func,
  }),
  initialData: PropTypes.shape({}),
  equalityChecker: PropTypes.func,
  fetchClient: PropTypes.func,
  fetcher: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};
