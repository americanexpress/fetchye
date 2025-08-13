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
  isLoading, coerceSsrField,
} from '../src/queryHelpers';

describe('isLoading', () => {
  it('should return false defer is true', () => {
    expect(isLoading({
      loading: false, data: undefined, options: { defer: true }, error: undefined,
    })).toEqual(false);
  });

  it('should return true if loading cache true', () => {
    expect(isLoading({
      loading: true, data: undefined, options: {}, error: undefined,
    })).toEqual(true);
  });

  it('should return true if all args are false', () => {
    expect(isLoading({
      loading: false, options: { defer: false }, error: undefined,
    })).toEqual(true);
  });

  it('should return true if numOfRenders === 1 and options.forceInitialFetch === true', () => {
    expect(isLoading({
      loading: false,
      numOfRenders: 1,
      data: {},
      options: {
        defer: false,
        forceInitialFetch: true,
      },
      error: undefined,
    })).toEqual(true);
  });

  it('should return false if there are errors present', () => {
    expect(isLoading({
      loading: false, options: { defer: false }, error: { },
    })).toEqual(false);
  });

  it('should return false if there is data present', () => {
    expect(isLoading({
      loading: false, data: { }, numOfRenders: 2, options: { defer: false },
    })).toEqual(false);
  });
});

describe('coerceSsrField', () => {
  it('should return stringified error', () => {
    expect(coerceSsrField(new Error('Fake Error'))).toEqual('Error: Fake Error');
  });
  it('should return null if undefined', () => {
    expect(coerceSsrField(undefined)).toEqual(null);
  });
});
