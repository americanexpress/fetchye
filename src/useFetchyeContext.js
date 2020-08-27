import { useContext, useReducer } from 'react';
import { FetchyeContext } from './FetchyeContext';
import { defaultFetcher as libraryFetcher } from './defaultFetcher';
import SimpleCache from './cache/SimpleCache';

export const useFetchyeContext = (fallbacks = {}) => {
  const {
    fallbackFetchClient = fetch,
    fallbackCache = SimpleCache(),
    fallbackFetcher = libraryFetcher,
  } = fallbacks;
  // Setup headless mode fallbacks
  const [state, fallbackDispatch] = useReducer(fallbackCache.reducer, fallbackCache.reducer(undefined, { type: '' }));

  const fallbackUseFetchyeSelector = (hash) => fallbackCache.getCacheByKey(state, hash);

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
