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

import computeHash from 'object-hash';
import mapHeaderNamesToLowerCase from './mapHeaderNamesToLowerCase';

export const computeKey = (key, options) => {
  const { headers, mapKeyToCacheKey, ...restOfOptions } = options;
  const nextOptions = { ...restOfOptions };
  if (headers) {
    nextOptions.headers = mapHeaderNamesToLowerCase(headers);
  }

  let nextKey = key;
  if (typeof key === 'function') {
    try {
      nextKey = key(nextOptions);
    } catch (error) {
      return false;
    }
    if (!nextKey) {
      return false;
    }
  }

  let cacheKey = nextKey;
  if (mapKeyToCacheKey !== undefined && typeof mapKeyToCacheKey === 'function') {
    try {
      cacheKey = mapKeyToCacheKey(nextKey, nextOptions);
    } catch (error) {
      return false;
    }
    if (!cacheKey) {
      return false;
    }
  } else if (mapKeyToCacheKey !== undefined) {
    throw new TypeError('mapKeyToCacheKey must be a function');
  }

  return { key: nextKey, hash: computeHash([cacheKey, nextOptions], { respectType: false }) };
};

export default computeKey;
