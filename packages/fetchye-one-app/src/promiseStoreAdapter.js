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

import { getLocalPromise, storeLocalPromise } from './streaming/actions';

// adapts the holocron promise store, which is only reachable via thunks, to the interface
// makeServerFetchye expects. Safely no-ops when the store has no promise store.
export const promiseStoreFromDispatch = (dispatch) => ({
  getLocalPromise: (domain, key) => dispatch(getLocalPromise(domain, key)),
  storeLocalPromise: (domain, key, promise) => dispatch(storeLocalPromise(domain, key, promise)),
});

export default promiseStoreFromDispatch;
