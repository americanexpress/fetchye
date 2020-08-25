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

import { runAsync } from './runAsync';
import { defaultFetcher } from './defaultFetcher';
import { computeKey } from './computeKey';
import { getCacheByKey } from './getCacheByKey';
import { defaultMapOptionsToKey } from './defaultMapOptionsToKey';

export const makeServerFetchye = ({
  store: { dispatch, getState },
  cacheSelector,
  fetchClient,
}) => async (
  key,
  { mapOptionsToKey = (options) => options, ...options } = { },
  fetcher = defaultFetcher
) => {
  const cache = cacheSelector(getState());
  const computedKey = computeKey(key, defaultMapOptionsToKey(mapOptionsToKey(options)));
  const { data, loading, error } = getCacheByKey(cache, computedKey);
  if (!data && !error && !loading) {
    return runAsync({
      dispatch, computedKey, fetcher, fetchClient, options,
    });
  }
  return { data, error };
};

export default makeServerFetchye;
