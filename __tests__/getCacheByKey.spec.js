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

import { getCacheByKey } from '../src/getCacheByKey';

describe('getCacheByKey', () => {
  let fakeComputedKey;
  let fakeCache;
  let fakeImmutableCache;
  beforeEach(() => {
    fakeComputedKey = {
      hash: '12345',
    };

    fakeCache = {
      data: {
        12345: 'Some Data',
      },
      errors: {
        12345: 'Some  Error',
      },
      loading: ['12345'],
    };
    fakeImmutableCache = {
      toJS: () => fakeCache,
    };
  });
  it('should return cache by hash key object', () => {
    expect(getCacheByKey(fakeCache, fakeComputedKey)).toMatchInlineSnapshot(`
      Object {
        "data": "Some Data",
        "error": "Some  Error",
        "loading": true,
      }
    `);
  });
  it('should return empty fields if cache is undefined', () => {
    expect(getCacheByKey(undefined, fakeComputedKey)).toMatchInlineSnapshot(`
      Object {
        "data": undefined,
        "error": undefined,
        "loading": false,
      }
    `);
  });
  it('should return immutable cache by hash key object', () => {
    expect(getCacheByKey(fakeImmutableCache, fakeComputedKey)).toMatchInlineSnapshot(`
      Object {
        "data": "Some Data",
        "error": "Some  Error",
        "loading": true,
      }
    `);
  });
  it('should not throw if loading doesnt exist', () => {
    fakeCache.loading = undefined;
    expect(getCacheByKey(fakeCache, fakeComputedKey)).toMatchInlineSnapshot(`
      Object {
        "data": "Some Data",
        "error": "Some  Error",
        "loading": false,
      }
    `);
  });
});
