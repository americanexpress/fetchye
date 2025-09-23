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
  it('should return false if defer is true, and not already loading', () => {
    expect(isLoading({
      loading: false,
      data: undefined,
      options: {
        defer: true,
      },
      error: undefined,
      refs: {},
    })).toEqual(false);
  });

  it('should return true if fetchye is loading', () => {
    expect(isLoading({
      loading: true,
      data: undefined,
      options: {},
      error: undefined,
      refs: {},
    })).toEqual(true);
  });

  it('should return true there is no data and no error and not defered', () => {
    expect(isLoading({
      data: undefined,
      loading: false,
      options: {
        defer: false,
      },
      error: undefined,
      refs: {},
    })).toEqual(true);
  });

  it('should return true if forceInitialFetch is true, even if data exists', () => {
    expect(isLoading({
      loading: false,
      data: {},
      options: {
        defer: false,
      },
      error: undefined,
      refs: {
        forceInitialFetch: true,
      },
    })).toEqual(true);
  });

  it('should return false if forceInitialFetch is true, but call is defered', () => {
    expect(isLoading({
      loading: false,
      data: {},
      options: {
        defer: true,
      },
      error: undefined,
      refs: {
        forceInitialFetch: true,
      },
    })).toEqual(false);
  });

  it('should return false if data is undefined and no error, but call is defered', () => {
    expect(isLoading({
      loading: false,
      data: undefined,
      options: {
        defer: true,
      },
      error: undefined,
      refs: {
        forceInitialFetch: false,
      },
    })).toEqual(false);
  });

  it('should return false if there are errors present', () => {
    expect(isLoading({
      loading: false,
      options: {
        defer: false,
      },
      error: {},
      refs: {},
    })).toEqual(false);
  });

  it('should return false if there is data present', () => {
    expect(isLoading({
      loading: false,
      data: { },
      options: {
        defer: false,
      },
      refs: {},
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
