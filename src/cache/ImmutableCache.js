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

// Immutable is an optional dependency
// eslint-disable-next-line import/no-extraneous-dependencies
import { Map as iMap } from 'immutable';
import reducer from './immutable/reducer';

const getCacheByKey = (cache = iMap(), key) => {
  const data = cache.getIn(['data', key]);
  const loading = cache.hasIn(['loading', key]);
  const error = cache.getIn(['errors', key]);
  return { data, loading, error };
};

export default function ImmutableCache({ cacheSelector = (state) => state } = {}) {
  return {
    getCacheByKey,
    reducer,
    cacheSelector,
  };
}
