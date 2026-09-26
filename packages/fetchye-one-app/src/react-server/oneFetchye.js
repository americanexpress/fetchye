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

import { makeServerFetchye } from 'fetchye';
import { promiseStoreFromDispatch } from '../promiseStoreAdapter';

const oneFetchye = (...fetchyeArgs) => async (dispatch, _, { fetchClient }) => {
  const fetchye = makeServerFetchye({
    // to match the surface API of the none rsc import,
    // we will explicitly null out the cache, and store, which should never be read
    store: null,
    cache: null,
    fetchClient,
    promiseStore: promiseStoreFromDispatch(dispatch),
  });
  return fetchye(...fetchyeArgs);
};

export default oneFetchye;
