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

import { ImmutableCache } from 'fetchye-immutable-cache';
import invariant from 'invariant';

export const oneCacheSelector = (state) => {
  const rootModuleName = state.getIn(['config', 'rootModuleName']);
  return state.getIn(['modules', rootModuleName, 'fetchye']);
};

export default function OneCache(args = {}) {
  invariant(
    !args.cacheSelector,
    '"cache" is not a permitted argument for OneCache, please use the ImmutableCache provided by fetchye-immutable-cache: https://github.com/americanexpress/fetchye#immutablecache'
  );
  return ImmutableCache({
    cacheSelector: oneCacheSelector,
  });
}
