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
import SimpleCache from './cache/SimpleCache';
import { defaultFetcher } from './defaultFetcher';
import { FetchyeContext } from './FetchyeContext';
import { defaultEqualityChecker } from './defaultEqualityChecker';

const RerenderShield = React.memo(({ children }) => children);
RerenderShield.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};
RerenderShield.displayName = 'RerenderShield';

const useSubscription = () => {
  const subscribers = useRef(new Set());
  return [
    function notify() {
      subscribers.current.forEach((callback) => {
        callback();
      });
    },
    function subscribe(callback) {
      subscribers.current.add(callback);
      return () => {
        subscribers.current.delete(callback);
      };
    },
  ];
};

const makeFetchyeSelector = ({
  fetchyeState, subscribe, getCacheByKey, equalityChecker,
}) => (key) => {
  const [, forceRender] = useReducer((state) => state + 1, 0);
  const nextValue = getCacheByKey(fetchyeState.current, key);
  const lastSelectorValue = useRef(nextValue);
  const selectorValue = useRef(nextValue);
  lastSelectorValue.current = selectorValue.current;
  selectorValue.current = nextValue;
  useEffect(() => {
    function checkForUpdates() {
      if (equalityChecker(selectorValue.current, lastSelectorValue.current)) {
        return;
      }
      forceRender();
    }
    return subscribe(checkForUpdates);
  }, [key]);
  return selectorValue;
};

export const FetchyeProvider = ({
  cache = SimpleCache(), initialData = cache.reducer(undefined, { type: '' }), equalityChecker = defaultEqualityChecker, fetcher = defaultFetcher, fetchClient = fetch, children,
}) => {
  const [state, dispatch] = useReducer(cache.reducer, initialData);
  const [notify, subscribe] = useSubscription();
  const fetchyeState = useRef();
  fetchyeState.current = state;

  const memoizedConfig = useMemo(() => ({
    dispatch,
    cache,
    defaultFetcher: fetcher,
    useFetchyeSelector: makeFetchyeSelector({
      fetchyeState,
      subscribe,
      getCacheByKey: cache.getCacheByKey,
      equalityChecker,
    }),
    fetchClient,
  }), [cache, equalityChecker, fetchClient, fetcher, subscribe]);

  useEffect(() => {
    notify();
  }, [notify, state]);

  return (
    <FetchyeContext.Provider value={memoizedConfig}>
      <RerenderShield>
        {children}
      </RerenderShield>
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
