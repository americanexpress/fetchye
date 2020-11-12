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

import { fromJS } from 'immutable';
import { ImmutableCache } from 'fetchye-immutable-cache';
import OneCache, { oneCacheSelector } from '../src/OneCache';

jest.mock('fetchye-immutable-cache', () => ({
  ImmutableCache: jest.fn(),
}));

describe('oneCache', () => {
  it('uses ImmutableCache', () => {
    OneCache();
    expect(ImmutableCache).toHaveBeenCalledWith({
      cacheSelector: oneCacheSelector,
    });
  });

  it('throws when cacheSelector provided', () => {
    expect(() => OneCache({ cacheSelector: 'some-selector' })).toThrowErrorMatchingSnapshot();
  });

  describe('oneCacheSelector', () => {
    it('uses root module name to select state', () => {
      const rootModuleName = 'some-root-modules-name';
      const state = fromJS({
        config: { rootModuleName },
        modules: {
          [rootModuleName]: { fetchye: 'fetchye-cache' },
        },
      });
      const fetchyeState = oneCacheSelector(state);
      expect(fetchyeState).toEqual('fetchye-cache');
    });
  });
});
