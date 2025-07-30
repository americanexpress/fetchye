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
  it('should return true if loading cache true', () => {
    expect(isLoading({
      loading: true, data: undefined, numOfRenders: 2, options: {},
    })).toEqual(true);
  });
  it('should return true if first render is true', () => {
    expect(isLoading({
      loading: false, data: undefined, numOfRenders: 1, options: { },
    })).toEqual(true);
  });
  it('should return true if first render and forceInitialFetch option is true', () => {
    expect(isLoading({
      loading: false, data: undefined, numOfRenders: 1, options: { forceInitialFetch: true },
    })).toEqual(true);
  });
  it('should return false if first render is true and defer is true', () => {
    expect(isLoading({
      loading: false, data: undefined, numOfRenders: 1, options: { defer: true },
    })).toEqual(false);
  });
  it('should return false if all args are false', () => {
    expect(isLoading({
      loading: false, numOfRenders: 2, options: { defer: false },
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
