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

export const storeLocalPromise = (domain, key, promise) => (_a, _b, { promiseStore }) => {
  promiseStore?.storeLocalPromise(domain, key, promise);
};

// eslint-disable-next-line max-len -- length can't be reduced w/o breaking other lint rules.
export const getLocalPromise = (domain, key) => (_a, _b, { promiseStore }) => promiseStore?.getLocalPromise(domain, key);

// eslint-disable-next-line max-len -- length can't be reduced w/o breaking other lint rules.
export const getStreamingPromises = () => (_a, _b, { promiseStore }) => promiseStore?.getStreamingPromises() ?? [];

export const stream = (promiseArray) => (_a, _b, { promiseStore }) => {
  if (!Array.isArray(promiseArray)) {
    throw new TypeError('PromiseArray must be an array');
  }

  promiseArray.forEach(({ domain, key, promise }) => {
    const storeDomain = domain ?? key;
    if (domain && typeof domain !== 'string') {
      throw new TypeError('Domain must be a string');
    }

    if (typeof key !== 'string') {
      throw new TypeError('Key must be a string');
    }

    if (!(promise instanceof Promise)) {
      throw new TypeError('Promise must be an instance of Promise');
    }

    promiseStore.storeStreamingPromise(storeDomain, key, promise);
  });
};
