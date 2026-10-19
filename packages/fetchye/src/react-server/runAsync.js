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

import { handleDynamicHeaders } from '../handleDynamicHeaders';

/**
 * The runAsync function for react-server is the same as the
 * standard one, except all dispatches are removed, since
 * there is no concept of updating the redux store in react-server
 * land
 */
export const runAsync = async ({
  computedKey, fetcher, fetchClient, options,
}) => {
  const {
    payload: data,
    error: requestError,
  } = await fetcher(fetchClient, computedKey.key, handleDynamicHeaders(options));
  /*
    This option overrides the default fetchye behavior of catching failed requests.
    When enabled, unsuccessful responses will throw an error containing the payload of the request.
    This is intended to be used within a suspense boundary.
  */
  if (options?.throwOnError && (!data?.ok || requestError)) {
    const errorWithPayload = {
      ...data,
      error: requestError || data?.body,
    };

    throw errorWithPayload;
  }

  return { data, error: requestError };
};

export default runAsync;
