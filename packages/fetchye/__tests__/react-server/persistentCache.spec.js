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
  getPersistentCacheOptions,
  DEFAULT_PERSISTENT_CACHE_TTL,
} from '../../src/react-server/persistentCache';

describe('react-server/persistentCache', () => {
  afterEach(() => {
    persistentCacheStore.clear();
  });

  describe('persistentCacheStore', () => {
    it('is a shared TTLCache configured to check age on get and not update TTL', () => {
      persistentCacheStore.set('some-key', 'some-value');
      expect(persistentCacheStore.get('some-key')).toBe('some-value');
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
        checkAgeOnGet: false,
        noUpdateTTL: false,
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

  describe('getPersistentCacheOptions', () => {
    it('defaults checkAgeOnGet and noUpdateTTL to true', () => {
      expect(getPersistentCacheOptions()).toEqual({
        ttl: undefined,
        checkAgeOnGet: true,
        noUpdateTTL: true,
      });
    });

    it('allows the caller to override ttl, checkAgeOnGet and noUpdateTTL', () => {
      expect(getPersistentCacheOptions({
        ttl: 1234,
        checkAgeOnGet: false,
        noUpdateTTL: false,
      })).toEqual({
        ttl: 1234,
        checkAgeOnGet: false,
        noUpdateTTL: false,
      });
    });
  });

  it('exposes a sane default ttl', () => {
    expect(DEFAULT_PERSISTENT_CACHE_TTL).toBe(5 * 60 * 1000);
  });
});
