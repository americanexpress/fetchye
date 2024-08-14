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

import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { trimQueryBody } from './trimQueryBody';

// Object.fromEntries is not compatible with Node v10
// provide our own lightweight solution
export const headersToObject = (headers = []) => [...headers]
  .reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
export const defaultFetcher = async (fetchClient, key, options) => {
  let trimmedOptions;
  let res;
  let payload;
  let error;
  const { existingQuery, isGraphQL } = options || {};

  if (existingQuery && isGraphQL) {
    const {
      body,
      ...restOfOptions
    } = options;
    const {
      query,
      ...restOfBody
    } = body || {};
    trimmedOptions = {
      ...restOfOptions,
      body: JSON.stringify({
        query: jsonToGraphQLQuery(trimQueryBody(query, existingQuery), { pretty: true }),
        ...restOfBody,
      }),
    };
  } else if (isGraphQL) {
    const {
      body,
      ...restOfOptions
    } = options;
    const {
      query,
      ...restOfBody
    } = body || {};
    trimmedOptions = {
      ...restOfOptions,
      body: JSON.stringify({
        query: jsonToGraphQLQuery(query, { pretty: true }),
        ...restOfBody,
      }),
    };
  }
  try {
    res = await fetchClient(key, trimmedOptions || options);
    let body = await res.text();
    try {
      body = JSON.parse(body);
    } catch (e) {
      // body will still be the text from the response, so no action needed here
    }
    payload = {
      body,
      ok: res.ok,
      headers: headersToObject(res.headers),
      status: res.status,
    };
  } catch (requestError) {
    // eslint-disable-next-line no-console -- error useful to developer in specific error case
    console.error(requestError);
    error = requestError;
  }
  return {
    payload,
    error,
  };
};

export default defaultFetcher;
