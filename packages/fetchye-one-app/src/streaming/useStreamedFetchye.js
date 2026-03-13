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

// eslint-disable-next-line import/no-extraneous-dependencies -- transitive from fetchye-redux-provider
import { useDispatch } from 'react-redux';
import { computeKey } from 'fetchye';
import { useCallback, useMemo } from 'react';
import { STREAM_DOMAIN } from './constants';
import oneFetchye from '../oneFetchye';
import { useStreamedPromise } from './hooks';
import { getLocalPromise, storeLocalPromise } from './actions';

export const useStreamedFetchye = (
  key,
  options = {},
  fetcher = undefined
) => {
  const dispatch = useDispatch();
  const { hash: promiseStoreKey } = computeKey(key, options);
  const serverPromise = useStreamedPromise(promiseStoreKey);

  const makeClientRequest = useCallback(() => {
    const localPromise = dispatch(getLocalPromise(STREAM_DOMAIN, promiseStoreKey));
    if (localPromise) {
      return localPromise;
    }

    const promise = dispatch(oneFetchye(key, options, fetcher));

    dispatch(storeLocalPromise(
      STREAM_DOMAIN,
      promiseStoreKey,
      promise
    ));

    return promise;
  }, [key, options, fetcher, promiseStoreKey, dispatch]);

  const shouldUseLocalPromise = !serverPromise;

  const localPromise = useMemo(() => {
    if (!shouldUseLocalPromise) return null;
    return makeClientRequest();
  }, [shouldUseLocalPromise, makeClientRequest]);

  return localPromise || serverPromise;
};
