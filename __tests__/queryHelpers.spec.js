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
    expect(isLoading(true, {}, {})).toBeTruthy();
  });
  it('should return true if first render is true', () => {
    expect(isLoading(false, { current: true }, {})).toBeTruthy();
  });
  it('should return false if first render is true and lazy is true', () => {
    expect(isLoading(false, { current: true }, { lazy: true })).toBeFalsy();
  });
  it('should return false if all args are false', () => {
    expect(isLoading(false, { current: false }, { lazy: false })).toBeFalsy();
  });
});

describe('getData', () => {
  it('should return data if data exists', () => {
    expect(getData({})).toBeTruthy();
  });
  it('should return initialData data', () => {
    expect(getData(undefined, { initialData: { data: { fakeData: true } } })).toBeTruthy();
  });
});

describe('getError', () => {
  it('should return error if error exists', () => {
    expect(getError(new Error('fake error'))).toBeTruthy();
  });
  it('should return initialData error', () => {
    expect(getError(undefined, { initialData: { error: new Error('fake error') } })).toBeTruthy();
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
