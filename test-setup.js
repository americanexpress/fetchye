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

require('@babel/polyfill');

// Jest's (older) test environments don't expose the `structuredClone` global that Node.js
// itself provides natively (since v17). `cacheable`'s in-memory store relies on it to clone
// values in/out of the cache, so polyfill it here using the same serialize/deserialize
// approach Node uses internally.
if (typeof global.structuredClone !== 'function') {
  // eslint-disable-next-line global-require -- need for only the persistent cache implementation
  const v8 = require('v8');
  global.structuredClone = (value) => v8.deserialize(v8.serialize(value));
}

// Polyfill TextEncoder/TextDecoder for Node.js environments that don't have them globally
if (typeof global.TextEncoder === 'undefined') {
  // eslint-disable-next-line global-require -- need for only the persistent cache implementation
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
