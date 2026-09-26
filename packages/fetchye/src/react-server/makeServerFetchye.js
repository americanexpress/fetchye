/*
 * Copyright 2026 American Express Travel Related Services Company, Inc.
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

import { ssrFetcher, FETCHYE_PROMISE_DOMAIN } from 'fetchye-core';
import { runAsync } from './runAsync';
import { computeKey } from '../computeKey';
import { coerceSsrField } from '../queryHelpers';

/**
 * The react-server variant of makeServerFetchye drops the ineraction with the 'cache'
 * and calls the react-server variant of runAsync
 */
const makeServerFetchye = ({
  cache = null,
  store = null,
  fetchClient,
  promiseStore,
}) => async (
  key,
  options = {},
  fetcher = ssrFetcher
) => {
  if (cache) {
    throw new Error('This function does not support a cache in RSC, it is passed as null from oneFetchye, you should not be calling makeServerFetchye directly');
  }
  if (store) {
    throw new Error('This function does not support a store in RSC, it is passed as null from oneFetchye, you should not be calling makeServerFetchye directly');
  }
  const computedKey = computeKey(key, options);
  const run = () => runAsync({
    computedKey: computeKey(key, options),
    fetcher,
    fetchClient,
    options,
  });

  // shares an in flight request between callers of the same key, ie two modules
  // requesting the same data within their loadModuleData
  const canDedupe = !!promiseStore && !!computedKey;
  const inFlightPromise = canDedupe
    && promiseStore.getLocalPromise(FETCHYE_PROMISE_DOMAIN, computedKey.hash);
  const runDeduped = () => {
    if (inFlightPromise) {
      return inFlightPromise;
    }
    const promise = runAsync({
      computedKey, fetcher, fetchClient, options,
    });
    if (canDedupe) {
      promiseStore.storeLocalPromise(FETCHYE_PROMISE_DOMAIN, computedKey.hash, promise);
    }
    return promise;
  };

  const res = await runDeduped();
  return {
    data: coerceSsrField(res.data),
    error: coerceSsrField(res.error),
    run,
  };
};

export default makeServerFetchye;
