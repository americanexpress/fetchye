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

import { computeKey } from '../src/computeKey';

describe('computeKey', () => {
  it('should return an object', () => {
    expect(computeKey('abcd', {})).toMatchInlineSnapshot(`
      Object {
        "hash": "037ace2918f4083eda9c4be34cccb93de5051b5a",
        "key": "abcd",
      }
    `);
  });
  it('should return an object if passed key function', () => {
    expect(computeKey(() => 'abcd', {})).toMatchInlineSnapshot(`
      Object {
        "hash": "037ace2918f4083eda9c4be34cccb93de5051b5a",
        "key": "abcd",
      }
    `);
  });
  it('should return false if key func throws error', () => {
    expect(
      computeKey(() => {
        throw new Error('error');
      }, {})
    ).toBeFalsy();
  });
  it('should return false if key func returns false', () => {
    expect(computeKey(() => false, {})).toBeFalsy();
  });
});
