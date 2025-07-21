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
import { setAction } from 'fetchye-core';
import { runAsync } from './runAsync';
import { computeKey } from './computeKey';
import {
  isLoading,
} from './queryHelpers';
import { useFetchyeContext } from './useFetchyeContext';

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

  useEffect(() => {
    if (options.defer || !computedKey) {
      return;
    }
    // If first render and initialData.data exists from SSR then return early
    if (numOfRenders.current === 1 && options.initialData?.data) {
      return;
    }
    const { loading, data, error } = selectorState.current;
    // If first render and options.forceInitialFetch is true we want to fetch from server
    // on first render.
    // We check the numOfRenders as two here as that is when this useEffect will actually be run
    // so to make this work it needs to be on render 2
    // If data is not set here then we know cache is empty,
    // so fetch will happen anyway and this would just cause a second fetch.
    if (options.forceInitialFetch === true && data && numOfRenders.current === 2) {
      // This is so it clears the cache before the forceFetch so we don't have isLoading true
      // and data also defined from the cached value.
      dispatch(setAction({ hash: computedKey.hash, value: undefined }));
      runAsync({
        dispatch, computedKey, fetcher: selectedFetcher, fetchClient, options,
      });
    }
    if (!loading && !data && !error) {
      runAsync({
        dispatch, computedKey, fetcher: selectedFetcher, fetchClient, options,
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
