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

const passInitialData = ({
  value,
  initialValue,
  numOfRenders,
  forceInitialFetch,
}) => {
  if (numOfRenders === 1) {
    if (initialValue) {
      return initialValue;
    }
    if (forceInitialFetch === true) {
      return undefined;
    }
  }
  return value;
};

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
  const forceInitialFetch = useRef(options?.forceInitialFetch || false);
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

    if (data && forceInitialFetch.current) {
      // This is so it clears the cache before the forceFetch so we don't have isLoading true
      // and data also defined from the cached value.
      dispatch(setAction({ hash: computedKey.hash, value: undefined }));
      runAsync({
        dispatch, computedKey, fetcher: selectedFetcher, fetchClient, options,
      });
      forceInitialFetch.current = false;
      return;
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
      {
        value: selectorState.current.error,
        initialValue: options.initialData?.error,
        numOfRenders: numOfRenders.current,
        forceInitialFetch: options.forceInitialFetch,
      }
    ),
    data: passInitialData(
      {
        value: selectorState.current.data,
        initialValue: options.initialData?.data,
        numOfRenders: numOfRenders.current,
        forceInitialFetch: options.forceInitialFetch,
      }
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
