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

import { useEffect, useRef } from 'react';
import { runAsync } from './runAsync';
import { computeKey } from './computeKey';
import {
  isLoading,
} from './queryHelpers';
import { useFetchyeContext } from './useFetchyeContext';
import { handleGraphQLRequest } from './handleGraphQLRequest';

const passInitialData = (value, initialValue, numOfRenders) => (numOfRenders === 1
  ? value || initialValue
  : value);

const useFetchye = (
  key,
  options = {},
  fetcher = undefined
) => {
  const {
    defaultFetcher, useFetchyeSelector, dispatch, fetchClient,
  } = useFetchyeContext();
  const selectedFetcher = typeof fetcher === 'function' ? fetcher : defaultFetcher;
  const computedKey = computeKey(key, options);
  const selectorState = useFetchyeSelector(computedKey.hash);
  // create a render version manager using refs
  const numOfRenders = useRef(0);
  numOfRenders.current += 1;
  const graphQLOptions = useRef(null);
  const newQuery = useRef(false);
  const graphQLArgs = options.isGraphQL
    ? [JSON.stringify(options), JSON.stringify(selectorState.current.query)] : [];

  useEffect(() => {
    const {
      query: existingQuery,
    } = selectorState.current;
    // Used for GraphQL queries to determine if a new query is being made
    ({ graphQLOptions: graphQLOptions.current, newQuery: newQuery.current } = handleGraphQLRequest({
      existingQuery,
      options,
    }));
  }, graphQLArgs);

  useEffect(() => {
    const {
      loading,
      data,
      error,
    } = selectorState.current;

    if (options.defer || !computedKey) {
      return;
    }
    // If first render and initialData.data exists from SSR then return early
    if (numOfRenders.current === 1 && options.initialData?.data) {
      return;
    }
    if ((!loading && !data && !error) || newQuery.current) {
      runAsync({
        dispatch,
        computedKey,
        fetcher: selectedFetcher,
        fetchClient,
        options: graphQLOptions.current || options,
      });
    }
  });

  return {
    isLoading: isLoading({
      loading: selectorState.current.loading,
      data: selectorState.current.data || options.initialData?.data,
      numOfRenders: numOfRenders.current,
      options,
    }),
    error: passInitialData(
      selectorState.current.error,
      options.initialData?.error,
      numOfRenders.current
    ),
    data: passInitialData(
      selectorState.current.data,
      options.initialData?.data,
      numOfRenders.current
    ),
    run() {
      return runAsync({
        dispatch,
        computedKey: computeKey(key, options),
        fetcher: selectedFetcher,
        fetchClient,
        options,
      });
    },
  };
};

export default useFetchye;
