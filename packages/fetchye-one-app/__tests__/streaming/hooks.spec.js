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

import * as redux from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import { useStreamedPromise } from '../../src/streaming/hooks';
import { STREAM_DOMAIN } from '../../src/streaming/constants';

const promiseStore = {
  storeLocalPromise: jest.fn(),
  getLocalPromise: jest.fn(),
  getStreamingPromises: jest.fn(),
  storeStreamingPromise: jest.fn(),
};

const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
const dispatchMock = jest.fn((thunk) => thunk(undefined, undefined, { promiseStore }));
useDispatchSpy.mockImplementation(() => dispatchMock);

describe('useStreamedPromise', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns streamed promise if present', () => {
    const promiseOne = new Promise(() => {});
    const promiseTwo = new Promise(() => {});
    const promises = [
      {
        key: 'key-1',
        domain: 'domain-1',
        promise: promiseOne,
      },
      {
        key: 'key-2',
        domain: 'domain-2',
        promise: promiseTwo,
      },
    ];
    promiseStore.getStreamingPromises.mockReturnValue(promises);

    const { result } = renderHook(() => useStreamedPromise(promises[0].key, promises[0].domain));

    expect(result.current).toBe(promises[0].promise);
  });

  it('returns null if streamed promise is not present', () => {
    const promiseOne = new Promise(() => {});
    const promiseTwo = new Promise(() => {});
    const promiseThree = new Promise(() => {});
    const promises = [
      {
        key: 'key-1',
        domain: 'domain-1',
        promise: promiseOne,
      },
      {
        key: 'key-2',
        domain: 'domain-2',
        promise: promiseTwo,
      },
      {
        key: 'key-3',
        domain: 'domain-3',
        promise: promiseThree,
      },
    ];
    promiseStore.getStreamingPromises.mockReturnValue(promises);

    const { result } = renderHook(() => useStreamedPromise('fake-key', 'fake-domain'));

    expect(result.current).toBeUndefined();
  });

  it('returns streamed promise for promises without a custom domain', () => {
    const promiseOne = new Promise(() => {});
    const promiseTwo = new Promise(() => {});
    const promises = [
      {
        key: 'key-1',
        domain: STREAM_DOMAIN,
        promise: promiseOne,
      },
      {
        key: 'key-2',
        domain: STREAM_DOMAIN,
        promise: promiseTwo,
      },
    ];
    promiseStore.getStreamingPromises.mockReturnValue(promises);

    const { result } = renderHook(() => useStreamedPromise(promises[1].key));

    expect(result.current).toBe(promises[1].promise);
  });

  it('returns streamed promise for promises with the same key and domain', () => {
    const promiseOne = new Promise(() => {});
    const promiseTwo = new Promise(() => {});
    const promises = [
      {
        key: 'key-1',
        domain: 'key-1',
        promise: promiseOne,
      },
      {
        key: 'key-2',
        domain: STREAM_DOMAIN,
        promise: promiseTwo,
      },
    ];
    promiseStore.getStreamingPromises.mockReturnValue(promises);

    const { result } = renderHook(() => useStreamedPromise(promises[0].key, null));

    expect(result.current).toBe(promiseOne);
  });
});
