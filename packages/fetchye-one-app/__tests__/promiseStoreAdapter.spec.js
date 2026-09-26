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

import { promiseStoreFromDispatch } from '../src/promiseStoreAdapter';

const promiseStore = {
  getLocalPromise: jest.fn(),
  storeLocalPromise: jest.fn(),
};
const noop = jest.fn();
const makeDispatch = (extraArguments) => jest.fn((thunk) => thunk(noop, noop, extraArguments));

describe('promiseStoreFromDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('stores a promise on the holocron promise store', () => {
    const promise = Promise.resolve('data');
    const dispatch = makeDispatch({ promiseStore });

    promiseStoreFromDispatch(dispatch).storeLocalPromise('domain', 'key', promise);

    expect(promiseStore.storeLocalPromise).toHaveBeenCalledWith('domain', 'key', promise);
  });

  it('gets a promise from the holocron promise store', () => {
    const promise = Promise.resolve('data');
    promiseStore.getLocalPromise.mockReturnValue(promise);
    const dispatch = makeDispatch({ promiseStore });

    expect(promiseStoreFromDispatch(dispatch).getLocalPromise('domain', 'key')).toBe(promise);
    expect(promiseStore.getLocalPromise).toHaveBeenCalledWith('domain', 'key');
  });

  it('does nothing when the store has no promise store', () => {
    const dispatch = makeDispatch({});
    const adapter = promiseStoreFromDispatch(dispatch);

    expect(() => adapter.storeLocalPromise('domain', 'key', Promise.resolve())).not.toThrow();
    expect(adapter.getLocalPromise('domain', 'key')).toBeUndefined();
  });
});
