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
  getData,
  getError,
} from './queryHelpers';
import { useFetchyeContext } from './useFetchyeContext';
import { defaultMapOptionsToKey } from './defaultMapOptionsToKey';

export const useFetchye = (
  key,
  { mapOptionsToKey = (options) => options, ...options } = { },
  fetcher) => {
  const {
    defaultFetcher, useFetchyeSelector, dispatch, fetchClient,
  } = useFetchyeContext();
  const selectedFetcher = typeof fetcher === 'function' ? fetcher : defaultFetcher;
  const computedKey = computeKey(key, defaultMapOptionsToKey(mapOptionsToKey(options)));
  const { data, loading, error } = useFetchyeSelector(computedKey.hash);
  const numOfRenders = useRef(0);
  numOfRenders.current += 1;
  useEffect(() => {
    if (options.lazy || !computedKey) {
      return;
    }
    if (!data && !error && !loading) {
      (async () => {
        await runAsync({
          dispatch, computedKey, fetcher: selectedFetcher, fetchClient, options,
        });
      })();
    }
  }, [data, loading, error, computedKey, selectedFetcher, options, dispatch, fetchClient]);
  return {
    isLoading: isLoading({ loading, numOfRenders: numOfRenders.current, options }),
    error: getError(error, numOfRenders.current, options),
    data: getData(data, numOfRenders.current, options),
    run() {
      return runAsync({
        dispatch, computedKey, fetcher: selectedFetcher, fetchClient, options,
      });
    },
  };
};

export default useFetchye;
