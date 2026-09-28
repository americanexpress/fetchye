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

import { Cacheable } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import computeHash from 'object-hash';

// Applied to newly created entries when a persistentCache config does not provide
// its own ttl. A ttl is always required by the underlying cache.
export const DEFAULT_PERSISTENT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Returns the single, process-wide cache shared by every call made with a
 * `persistentCache` option. Unlike the promiseStore (which is only used to dedupe
 * in-flight requests for the lifetime of a single request/render), this cache is
 * intended to live across requests, which is what makes it "persistent".
 *
 * This is backed by `cacheable`'s shared static instance (`Cacheable.getStaticInstance`),
 * so it is safe to call this multiple times (or from multiple files) and always get the
 * same underlying cache. Its default (and only, unless a `secondary` store has been
 * configured via `connectToRedis`) `primary` store is an in-memory TTL cache
 * (`CacheableMemory`, via `createKeyv()`), so entries always expire on their own.
 *
 * All reads/writes go through cacheable's native, promise-based `get`/`set` API.
 *
 * Tag-based invalidation is enabled to support invalidating groups of cache entries by tags.
 *
 * This is a function rather than a direct reference to a `Cacheable` instance so that,
 * if `connectToRedis` later swaps in a new static instance (backed by Redis) via
 * `Cacheable.setStaticInstance`, every caller transparently starts using the new
 * instance on their next call, without needing to re-import anything.
 */
export const getPersistentCacheStore = () => Cacheable.getStaticInstance({
  ttl: DEFAULT_PERSISTENT_CACHE_TTL,
  tags: true,
});

/**
 * Connects the shared persistent cache to a Redis server, using it as a `secondary`
 * store alongside the existing in-memory `primary` store. This allows the persistent
 * cache to be shared across multiple server instances/processes.
 *
 * If the connection attempt fails, the existing (in-memory only) static instance is
 * left untouched, and `false` is returned so the caller can decide how to handle the
 * failure (eg. logging, retrying, or simply continuing with an in-memory-only cache).
 *
 * @param {string} connectionString - A Redis connection string (eg. redis://localhost:6379)
 * @returns {Promise<boolean>} Whether the connection succeeded and the static instance
 * was updated to use Redis as its secondary store.
 */
export const connectToRedis = async (connectionString) => {
  const keyvRedis = new KeyvRedis(connectionString);

  try {
    // getClient() establishes (and awaits) the underlying Redis connection, throwing
    // if it fails to connect (KeyvRedis defaults to throwOnConnectError: true).
    await keyvRedis.getClient();
  } catch (error) {
    return false;
  }

  Cacheable.setStaticInstance(new Cacheable({
    ttl: DEFAULT_PERSISTENT_CACHE_TTL,
    tags: true,
    secondary: keyvRedis,
  }));

  return true;
};

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
  if (persistentCache.tags !== undefined
    && (!Array.isArray(persistentCache.tags)
    || persistentCache.tags.length === 0)) {
    throw new Error('makeServerFetchye persistentCache.tags must be a non-empty array when provided');
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
 * Invalidates all cache entries associated with the given tags.
 * This leverages the underlying cacheable instance's tag-based invalidation.
 *
 * This function is intended to be called inside a server action, to allow the next
 * RSC render to fetch fresh data.
 *
 * @param {string[]} tags - An array of tags to invalidate
 * @returns {Promise<void>}
 */
export const invalidateFetchyeTags = async (tags) => {
  if (tags.length === 0) {
    throw new Error('invalidateFetchyeTags requires at least one tag');
  }

  await getPersistentCacheStore().tags.invalidateTags(tags);
};
