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

export const getCacheByKey = (cache = {}, computedKey) => {
  const unpackedCache = cache.toJS ? cache.toJS() : cache;
  const data = unpackedCache.data?.[computedKey.hash];
  const loading = !!unpackedCache.loading && unpackedCache.loading.includes(computedKey.hash);
  const error = unpackedCache.errors?.[computedKey.hash];
  return { data, loading, error };
};

export default getCacheByKey;
