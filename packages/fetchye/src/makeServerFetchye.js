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

import { ssrFetcher } from 'fetchye-core';
import SimpleCache from './SimpleCache';
import { runAsync } from './runAsync';
import { computeKey } from './computeKey';
import { defaultMapOptionsToKey } from './defaultMapOptionsToKey';
import { coerceSsrField } from './queryHelpers';

const makeServerFetchye = ({
  cache = SimpleCache(),
  store: { getState, dispatch } = {},
  fetchClient,
}) => async (
  key,
  { mapOptionsToKey = (options) => options, ...options } = { },
  fetcher = ssrFetcher
) => {
  const { cacheSelector } = cache;
  const computedKey = computeKey(key, defaultMapOptionsToKey(mapOptionsToKey(options)));
  if (!getState || !dispatch || !cacheSelector) {
    const res = await runAsync({
      dispatch: () => {}, computedKey, fetcher, fetchClient, options,
    });
    return {
      data: coerceSsrField(res.data),
      error: coerceSsrField(res.error),
    };
  }
  const state = cacheSelector(getState());
  const { data, loading, error } = cache.getCacheByKey(state, computedKey.hash);
  if (!data && !error && !loading) {
    const res = await runAsync({
      dispatch, computedKey, fetcher, fetchClient, options,
    });
    return {
      data: coerceSsrField(res.data),
      error: coerceSsrField(res.error),
    };
  }
  return { data: coerceSsrField(data), error: coerceSsrField(error) };
};

export default makeServerFetchye;
