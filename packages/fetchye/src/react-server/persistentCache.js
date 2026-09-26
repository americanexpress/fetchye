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

import { TTLCache } from '@isaacs/ttlcache';
import computeHash from 'object-hash';

// Applied to newly created entries when a persistentCache config does not provide
// its own ttl. A ttl is always required by the underlying cache.
export const DEFAULT_PERSISTENT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * A single, module-level TTL cache shared by every call made with a `persistentCache`
 * option. Unlike the promiseStore (which is only used to dedupe in-flight requests for
 * the lifetime of a single request/render), this cache is intended to live across
 * requests, which is what makes it "persistent".
 *
 * By default it checks the age of an entry whenever it is read (`checkAgeOnGet`) so that
 * stale entries which have not yet been purged by their timer are never returned, and it
 * does not extend/refresh an entry's TTL when it is overwritten with a fresh value
 * (`noUpdateTTL`), so that the original expiration keeps counting down.
 */
export const persistentCacheStore = new TTLCache({
  ttl: DEFAULT_PERSISTENT_CACHE_TTL,
  checkAgeOnGet: true,
  noUpdateTTL: true,
});

/**
 * Validates the shape of a `persistentCache` option. Throws when invalid.
 */
export const validatePersistentCache = (persistentCache) => {
  if (!persistentCache) {
    return;
  }
  if (!persistentCache.isolationKey) {
    throw new Error('makeServerFetchye persistentCache.isolationKey is required when using persistentCache');
  }
  if (persistentCache.ttl === Number.POSITIVE_INFINITY) {
    throw new Error('makeServerFetchye persistentCache.ttl cannot be Infinity');
  }
};

/**
 * Combines the request specific computedKey.hash with the caller supplied
 * isolationKey (eg. tenant, locale, environment, etc) so that separate
 * isolation boundaries never share cache entries, even for the same request key.
 */
export const getPersistentCacheKey = (computedKey, isolationKey) => computeHash(
  [computedKey.hash, isolationKey],
  { respectType: false }
);

/**
 * Normalizes a `persistentCache` option into the get/set overrides accepted by
 * @isaacs/ttlcache, applying fetchye's defaults of checking age on get and not
 * extending the TTL when a value is refreshed.
 */
export const getPersistentCacheOptions = ({
  ttl,
  checkAgeOnGet = true,
  noUpdateTTL = true,
} = {}) => ({
  ttl,
  checkAgeOnGet,
  noUpdateTTL,
});
