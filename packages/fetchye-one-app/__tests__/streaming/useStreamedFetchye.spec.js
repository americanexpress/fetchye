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

import { renderHook } from '@testing-library/react-hooks';
import * as redux from 'react-redux';
import { useStreamedFetchye } from '../../src/streaming/useStreamedFetchye';
import * as streamingHooks from '../../src/streaming/hooks';

const mockComputeKeySymbol = Symbol('computeKey');
const mockFetchClientSymbol = Symbol('fetchClient');

jest.mock('fetchye', () => ({
  ...jest.requireActual('fetchye'),
  makeServerFetchye: jest.fn((...makeFetchyeArgs) => jest.fn((...fetcheArgs) => Promise.resolve(
    { makeFetchyeArgs, fetcheArgs }
  ))),
  computeKey: jest.fn(() => ({ hash: mockComputeKeySymbol })),
}));

const mockOneCacheSymbol = Symbol('oneCache');
jest.mock('../../src/OneCache', () => jest.fn(() => mockOneCacheSymbol));

const promiseStore = {
  storeLocalPromise: jest.fn(),
  getLocalPromise: jest.fn(),
  getStreamingPromises: jest.fn(),
  storeStreamingPromise: jest.fn(),
};

const useStreamedPromiseSpy = jest.spyOn(streamingHooks, 'useStreamedPromise');
const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
const noop = jest.fn();
const extraArguments = { promiseStore, fetchClient: mockFetchClientSymbol };
const dispatchMock = jest.fn((t) => t(noop, noop, extraArguments));
useDispatchSpy.mockImplementation(() => dispatchMock);

describe('useStreamedFetchye', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return data from promise store if streamed promise is present', async () => {
    const streamedData = Symbol('streamed-data');
    useStreamedPromiseSpy.mockResolvedValue(streamedData);

    const { result } = renderHook(() => useStreamedFetchye('http://example.com'));

    expect(await result.current).toEqual(streamedData);
  });

  it('should return data from promise store if local promise is present', async () => {
    expect.assertions(2);
    const localData = Symbol('local-promise-data');
    promiseStore.getLocalPromise.mockResolvedValue(localData);
    useStreamedPromiseSpy.mockReturnValue(null);

    const { result } = renderHook(() => useStreamedFetchye('http://example-2.com'));
    expect(dispatchMock).toHaveBeenCalled();
    expect(await result.current).toEqual(localData);
  });

  it('should create a request on the client if no streamed or local promise is present', async () => {
    expect.assertions(2);

    useStreamedPromiseSpy.mockReturnValue(null);
    promiseStore.getLocalPromise.mockReturnValue(null);

    const { result } = renderHook(() => useStreamedFetchye('http://example-3.com'));

    expect(dispatchMock).toHaveBeenCalledTimes(3);

    expect(await result.current).toStrictEqual({ fetcheArgs: ['http://example-3.com', {}, undefined], makeFetchyeArgs: [{ cache: mockOneCacheSymbol, fetchClient: mockFetchClientSymbol, store: { dispatch: noop, getState: noop } }] });
  });
});
