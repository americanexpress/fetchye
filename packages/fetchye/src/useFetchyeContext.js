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

import { useContext, useReducer } from 'react';
import { defaultFetcher as libraryFetcher, FetchyeContext } from 'fetchye-core';
import SimpleCache from './SimpleCache';

export const useFetchyeContext = (fallbacks = {}) => {
  const {
    fallbackFetchClient = fetch,
    fallbackCache = SimpleCache(),
    fallbackFetcher = libraryFetcher,
  } = fallbacks;
  // Setup headless mode fallbacks
  const [state, fallbackDispatch] = useReducer(fallbackCache.reducer, fallbackCache.reducer(undefined, { type: '' }));

  const fallbackUseFetchyeSelector = (hash) => ({
    current: fallbackCache.getCacheByKey(state, hash),
  });

  const providedContext = useContext(FetchyeContext);
  const {
    cache = fallbackCache,
    defaultFetcher = fallbackFetcher,
    useFetchyeSelector = fallbackUseFetchyeSelector,
    dispatch = fallbackDispatch,
    fetchClient = fallbackFetchClient,
  } = providedContext || {};

  return {
    cache,
    defaultFetcher,
    useFetchyeSelector,
    dispatch,
    fetchClient,
    headless: true,
  };
};

export default useFetchyeContext;
