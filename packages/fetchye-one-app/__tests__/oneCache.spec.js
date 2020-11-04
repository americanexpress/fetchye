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
import { testCacheInterface } from 'fetchye-test-utils';
import OneCache, { oneCacheSelector } from '../src/OneCache';

describe('oneCache', () => {
  testCacheInterface(OneCache);
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
