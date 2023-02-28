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

import computeHash from 'object-hash';
import { computeKey } from '../src/computeKey';

jest.mock('object-hash', () => {
  const originalComputeHash = jest.requireActual('object-hash'); // Step 2.
  return jest.fn(originalComputeHash);
});

describe('computeKey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
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
    ).toEqual(false);
  });
  it('should return false if key func returns false', () => {
    expect(computeKey(() => false, {})).toEqual(false);
  });
  it('should return the same hash value irrespective of header name casings', () => {
    const firstOptions = {
      headers: {
        Authorization: 'fake.jw.t',
        'Content-Type': 'application/json',
      },
    };
    const secondOptions = {
      headers: {
        AUTHoriZation: 'fake.jw.t',
        'content-type': 'application/json',
      },
    };
    expect(computeKey('uri', firstOptions).hash).toBe(computeKey('uri', secondOptions).hash);
  });

  it('should return a different, stable hash, if the option mapKeyToCacheKey is passed', () => {
    expect(computeKey(() => 'abcd', {
      mapKeyToCacheKey: () => 'efgh',
    })).toMatchInlineSnapshot(`
      Object {
        "hash": "a0e09d568bb5b47c046b0fac7a61ca10196151cc",
        "key": "abcd",
      }
    `);
  });

  it('should pass generated cacheKey to the underlying hash function along with the options, and return the un-mapped key to the caller', () => {
    const computedKey = computeKey(() => 'abcd', {
      mapKeyToCacheKey: () => 'efgh',
      optionKeyMock: 'optionKeyValue',
    });
    expect(computedKey.key).toBe('abcd');
    expect(computeHash).toHaveBeenCalledWith(['efgh', { optionKeyMock: 'optionKeyValue' }], { respectType: false });
  });

  it('should return the same key if the option mapKeyToCacheKey returns the same string as the key', () => {
    expect(computeKey(() => 'abcd', {
      mapKeyToCacheKey: () => 'abcd',
    })).toMatchInlineSnapshot(`
      Object {
        "hash": "037ace2918f4083eda9c4be34cccb93de5051b5a",
        "key": "abcd",
      }
    `);
  });

  it('should return false if mapKeyToCacheKey throws error', () => {
    expect(
      computeKey(() => 'abcd', {
        mapKeyToCacheKey: () => {
          throw new Error('error');
        },
      })
    ).toEqual(false);
  });

  it('should return false if mapKeyToCacheKey returns false', () => {
    expect(computeKey(() => 'abcd', { mapKeyToCacheKey: () => false })).toEqual(false);
  });

  it('should1 throw an error if mapKeyToCacheKey is defined and not a function', () => {
    expect(() => computeKey(() => 'abcd',
      { mapKeyToCacheKey: 'string' }
    )).toThrow('mapKeyToCacheKey must be a function');
  });
});
