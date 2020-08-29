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
  isLoading, getData, getError, coerceSsrField,
} from '../src/queryHelpers';

describe('isLoading', () => {
  it('should return true if loading cache true', () => {
    expect(isLoading({
      loading: true, data: undefined, numOfRenders: 2, options: {},
    })).toBeTruthy();
  });
  it('should return true if first render is true', () => {
    expect(isLoading({
      loading: false, data: undefined, numOfRenders: 1, options: { },
    })).toBeTruthy();
  });
  it('should return false if first render is true and lazy is true', () => {
    expect(isLoading({
      loading: false, data: undefined, numOfRenders: 1, options: { lazy: true },
    })).toBeFalsy();
  });
  it('should return false if all args are false', () => {
    expect(isLoading({ loading: false, numOfRenders: 2, options: { lazy: false } })).toBeFalsy();
  });
});

describe('getData', () => {
  it('should return data if data exists', () => {
    expect(getData({ fakeData: true }, 0)).toEqual({ fakeData: true });
  });
  it('should return initialData data', () => {
    expect(getData(undefined, 1, { initialData: { data: { fakeData: true } } }))
      .toEqual({ fakeData: true });
  });
  it('should return not initialData data on >1 renders', () => {
    expect(getData(undefined, 2, { initialData: { data: { fakeData: true } } })).toBeUndefined();
  });
});

describe('getError', () => {
  const error = new Error('fake error');
  it('should return error if error exists', () => {
    expect(getError(error, 0)).toEqual(error);
  });
  it('should return initialData error', () => {
    expect(getError(undefined, 1, { initialData: { error } })).toEqual(error);
  });
  it('should return not initialData error on >1 renders', () => {
    expect(getError(undefined, 2, { initialData: { error } })).toBeUndefined();
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
