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

import { computeKey } from 'fetchye';
import { stream } from './actions';
import { STREAM_DOMAIN } from './constants';

export const streamFetchye = (fetchyeThunk, key, options = {}) => async (dispatch) => {
  const { hash: computedKey } = computeKey(key, options);
  const promise = dispatch(fetchyeThunk);

  dispatch(
    stream([
      {
        key: computedKey,
        domain: STREAM_DOMAIN,
        promise,
      },
    ])
  );

  return promise;
};
