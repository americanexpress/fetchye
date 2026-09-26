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

import {
  persistentCacheStore,
  validatePersistentCache,
  getPersistentCacheKey,
  DEFAULT_PERSISTENT_CACHE_TTL,
  invalidateFetchyeTags,
} from '../../src/react-server/persistentCache';

describe('react-server/persistentCache', () => {
  afterEach(async () => {
    await persistentCacheStore.clear();
  });

  describe('persistentCacheStore', () => {
    it('is a shared cacheable instance backed by an in-memory TTL primary store', async () => {
      await persistentCacheStore.set('some-key', 'some-value');
      await expect(persistentCacheStore.get('some-key')).resolves.toBe('some-value');
    });
  });

  describe('validatePersistentCache', () => {
    it('does nothing when no persistentCache is provided', () => {
      expect(() => validatePersistentCache(undefined)).not.toThrow();
      expect(() => validatePersistentCache(null)).not.toThrow();
    });

    it('throws when isolationKey is missing', () => {
      expect(() => validatePersistentCache({})).toThrow('makeServerFetchye persistentCache.isolationKey is required when using persistentCache');
    });

    it('throws when ttl is Infinity', () => {
      expect(() => validatePersistentCache({
        isolationKey: 'tenant-a',
        ttl: Number.POSITIVE_INFINITY,
      })).toThrow('makeServerFetchye persistentCache.ttl cannot be Infinity');
    });

    it('does not throw for a valid persistentCache config', () => {
      expect(() => validatePersistentCache({
        isolationKey: 'tenant-a',
        ttl: 1000,
      })).not.toThrow();
    });

    it('does not throw for a valid persistentCache config with tags', () => {
      expect(() => validatePersistentCache({
        isolationKey: 'tenant-a',
        ttl: 1000,
        tags: ['users', 'profile'],
      })).not.toThrow();
    });

    it('throws when tags is an empty array', () => {
      expect(() => validatePersistentCache({
        isolationKey: 'tenant-a',
        ttl: 1000,
        tags: [],
      })).toThrow('makeServerFetchye persistentCache.tags must be a non-empty array when provided');
    });

    it('throws when tags is not an array', () => {
      expect(() => validatePersistentCache({
        isolationKey: 'tenant-a',
        ttl: 1000,
        tags: 'users',
      })).toThrow('makeServerFetchye persistentCache.tags must be a non-empty array when provided');
    });
  });

  describe('getPersistentCacheKey', () => {
    it('hashes the computedKey.hash together with the isolationKey', () => {
      const keyOne = getPersistentCacheKey({ hash: 'abc' }, 'tenant-a');
      const keyTwo = getPersistentCacheKey({ hash: 'abc' }, 'tenant-b');
      const keyThree = getPersistentCacheKey({ hash: 'abc' }, 'tenant-a');

      expect(keyOne).not.toEqual(keyTwo);
      expect(keyOne).toEqual(keyThree);
    });
  });

  it('exposes a sane default ttl', () => {
    expect(DEFAULT_PERSISTENT_CACHE_TTL).toBe(5 * 60 * 1000);
  });

  describe('invalidateFetchyeTags', () => {
    it('invalidates cache entries by a single tag', async () => {
      await persistentCacheStore.set('key1', { data: 'value1' }, { ttl: 10000, tags: ['users'] });
      await persistentCacheStore.set('key2', { data: 'value2' }, { ttl: 10000, tags: ['posts'] });

      // Verify both entries exist before invalidation
      expect(await persistentCacheStore.get('key1')).toEqual({ data: 'value1' });
      expect(await persistentCacheStore.get('key2')).toEqual({ data: 'value2' });

      await invalidateFetchyeTags(['users']);

      // After invalidating the 'users' tag, the next get should return undefined
      expect(await persistentCacheStore.get('key1')).toBeUndefined();
      expect(await persistentCacheStore.get('key2')).toEqual({ data: 'value2' });
    });

    it('invalidates cache entries by multiple tags', async () => {
      await persistentCacheStore.set('key1', { data: 'value1' }, { ttl: 10000, tags: ['users', 'profile'] });
      await persistentCacheStore.set('key2', { data: 'value2' }, { ttl: 10000, tags: ['posts'] });
      await persistentCacheStore.set('key3', { data: 'value3' }, { ttl: 10000, tags: ['comments'] });

      // Verify all entries exist before invalidation
      expect(await persistentCacheStore.get('key1')).toEqual({ data: 'value1' });
      expect(await persistentCacheStore.get('key2')).toEqual({ data: 'value2' });
      expect(await persistentCacheStore.get('key3')).toEqual({ data: 'value3' });

      await invalidateFetchyeTags(['users', 'posts']);

      expect(await persistentCacheStore.get('key1')).toBeUndefined();
      expect(await persistentCacheStore.get('key2')).toBeUndefined();
      expect(await persistentCacheStore.get('key3')).toEqual({ data: 'value3' });
    });

    it('throws when provided an empty array', async () => {
      await expect(invalidateFetchyeTags([])).rejects.toThrow(
        'invalidateFetchyeTags requires at least one tag'
      );
    });
  });
});
