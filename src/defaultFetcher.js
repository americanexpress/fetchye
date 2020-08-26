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

// Object.fromEntries is not compatible with Node v10
// provide our own lightweight solution
export const headersToObject = (headers = []) => [...headers]
  .reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
export const defaultFetcher = async (fetchClient, key, options) => {
  let res;
  let payload;
  let error;
  try {
    res = await fetchClient(key, options);
    const body = await res.json();
    payload = {
      body,
      ok: res.ok,
      headers: headersToObject(res.headers),
      status: res.status,
    };
  } catch (requestError) {
    console.error(requestError);
    error = requestError;
  }
  return {
    payload,
    error,
  };
};

export default defaultFetcher;
