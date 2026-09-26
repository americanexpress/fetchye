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
});
