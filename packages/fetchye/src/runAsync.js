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

import {
  loadingAction,
  setAction,
  errorAction,
  setQuery,
  updateDataAction,
} from 'fetchye-core';
import { handleDynamicHeaders } from './handleDynamicHeaders';

export const runAsync = async ({
  dispatch, computedKey, fetcher, fetchClient, options,
}) => {
  const {
    body: {
      query,
    } = {},
    isGraphQL = false,
  } = options;
  dispatch(loadingAction({ hash: computedKey.hash }));
  if (isGraphQL) {
    dispatch(setQuery({ hash: computedKey.hash, query }));
  }
  const {
    payload: data,
    error: requestError,
  } = await fetcher(
    fetchClient, computedKey.key, handleDynamicHeaders(options)
  );
  if (!requestError) {
    if (isGraphQL) {
      dispatch(updateDataAction({ hash: computedKey.hash, value: data }));
    } else {
      dispatch(setAction({ hash: computedKey.hash, value: data }));
    }
  } else {
    dispatch(errorAction({ hash: computedKey.hash, error: requestError }));
  }
  return { data, error: requestError };
};

export default runAsync;
