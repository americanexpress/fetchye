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

import { defaultEqualityChecker } from '../src/defaultEqualityChecker';

const fakeSliceOfState = {
  loading: true,
  data: { fake: 'data' },
  error: new Error('stuff'),
};

describe('defaultEqualityChecker', () => {
  it('should return true when a and b are equal', () => {
    expect(defaultEqualityChecker(fakeSliceOfState, fakeSliceOfState)).toEqual(true);
  });
  it('should return false when a.error and b.error arent equal', () => {
    const b = {
      ...fakeSliceOfState,
      error: new Error('changed'),
    };
    expect(defaultEqualityChecker(fakeSliceOfState, b)).toEqual(false);
  });
  it('should return false when a.data and b.data arent equal', () => {
    const b = {
      ...fakeSliceOfState,
      data: { fake: 'new data' },
    };
    expect(defaultEqualityChecker(fakeSliceOfState, b)).toEqual(false);
  });
  it('should return false when a.loading and b.loading arent equal', () => {
    const b = {
      ...fakeSliceOfState,
      loading: false,
    };
    expect(defaultEqualityChecker(fakeSliceOfState, b)).toEqual(false);
  });
});
