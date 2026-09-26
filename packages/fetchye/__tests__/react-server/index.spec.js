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

import * as reactServerFetchye from '../../src/react-server';

describe('react-server/index', () => {
  it('should return public methods', () => {
    expect(Object.keys(reactServerFetchye).sort()).toMatchInlineSnapshot(`
      Array [
        "computeKey",
        "ignoreHeadersByKey",
        "invalidateFetchyeTags",
        "makeServerFetchye",
      ]
    `);
  });
});
