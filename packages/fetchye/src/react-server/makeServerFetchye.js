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
import {
  persistentCacheStore,
  validatePersistentCache,
  getPersistentCacheKey,
  getPersistentCacheOptions,
} from './persistentCache';

/**
 * The react-server variant of makeServerFetchye drops the ineraction with the 'cache'
 * and calls the react-server variant of runAsync
 *
 * This function _must_ be involked with  no cache, no store, and a valid promiseStore
 *
 * When a `persistentCache` option is provided (as part of the per-call `options`), it is
 * used in place of the promiseStore for both in-flight request deduplication and result
 * caching. `persistentCache` must include an `isolationKey`, used together with the
 * computed request key to build the cache key, and may optionally configure `ttl` (which
 * cannot be `Infinity`), `checkAgeOnGet` (defaults to `true`) and `noUpdateTTL` (defaults
 * to `true`).
 */
const makeServerFetchye = ({
  cache = null,
  store = null,
  fetchClient,
  promiseStore = null,
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
  const { persistentCache, ...fetchOptions } = options;

  validatePersistentCache(persistentCache);

  const computedKey = computeKey(key, fetchOptions);

  const runPersistentCache = async ({ skipRead = false } = {}) => {
    const { isolationKey, ...persistentCacheConfig } = persistentCache;
    const persistentCacheOptions = getPersistentCacheOptions(persistentCacheConfig);
    const persistentCacheKey = getPersistentCacheKey(computedKey, isolationKey);
    if (!skipRead) {
      const cachedPromise = persistentCacheStore.get(persistentCacheKey, {
        checkAgeOnGet: persistentCacheOptions.checkAgeOnGet,
      });

      if (cachedPromise) {
        return cachedPromise;
      }
    }
    const promise = runAsync({
      computedKey, fetcher, fetchClient, options,
    });
    persistentCacheStore.set(persistentCacheKey, promise, persistentCacheOptions);
    return promise;
  };

  const runPromiseStore = ({ skipRead = false } = {}) => {
    if (!skipRead) {
      const inFlightPromise = promiseStore.getLocalPromise(
        FETCHYE_PROMISE_DOMAIN,
        computedKey.hash
      );

      if (inFlightPromise) {
        return inFlightPromise;
      }
    }
    const promise = runAsync({
      computedKey, fetcher, fetchClient, options,
    });
    promiseStore.storeLocalPromise(FETCHYE_PROMISE_DOMAIN, computedKey.hash, promise);
    return promise;
  };

  const run = persistentCache ? runPersistentCache : runPromiseStore;

  const res = await run();
  return {
    data: coerceSsrField(res.data),
    error: coerceSsrField(res.error),
    run: () => run({ skipRead: true }),
  };
};

export default makeServerFetchye;
