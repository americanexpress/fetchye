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

import { streamFetchye } from '../../src/streaming/streamFetchye';
import * as actions from '../../src/streaming/actions';
import { STREAM_DOMAIN } from '../../src/streaming/constants';

const mockComputeKeySymbol = Symbol('computeKey');
jest.mock('fetchye', () => ({
  computeKey: jest.fn(() => ({ hash: mockComputeKeySymbol })),
}));

const streamActionSpy = jest.spyOn(actions, 'stream');
const mockDispatch = jest.fn();

describe('streamFetchye', () => {
  const originalWindow = global.window;

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(global, 'window', {
      value: undefined,
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it('should return a one-app-thunk that dispatches an action resolving to the passed in thunk', async () => {
    expect.assertions(2);

    const fetchyeThunk = jest.fn();
    fetchyeThunk.mockResolvedValue(Symbol('fetchRequest'));

    const fetchyeParams = [fetchyeThunk, Symbol('fetchyeArgs - key')];
    const streamFetchyeThunk = streamFetchye(...fetchyeParams);
    const thunkParams = [mockDispatch, Symbol('getState'), Symbol('fetchClient')];
    const streamFetchyeResponse = await streamFetchyeThunk(
      fetchyeThunk, thunkParams[0], thunkParams[1], { fetchClient: thunkParams[2] }
    );
    const fetchyeThunkPromise = fetchyeThunk();

    expect(streamActionSpy).toHaveBeenCalledWith([{
      key: mockComputeKeySymbol,
      domain: STREAM_DOMAIN,
      promise: fetchyeThunkPromise,
    }]);
    expect(streamFetchyeResponse).toStrictEqual(await fetchyeThunkPromise);
  });

  it('should call the fetchye thunk with the correct args', async () => {
    expect.assertions(1);

    const fetchyeThunk = jest.fn();
    fetchyeThunk.mockResolvedValue(Symbol('fetchRequest'));

    const fetchyeParams = [fetchyeThunk, Symbol('fetchyeArgs - key'), Symbol('fetchyeArgs - options'), Symbol('fetchyeArgs - fetcher')];
    const streamFetchyeThunk = streamFetchye(...fetchyeParams);
    const thunkParams = [mockDispatch, Symbol('getState'), Symbol('fetchClient')];
    await streamFetchyeThunk(
      fetchyeThunk, thunkParams[0], thunkParams[1], { fetchClient: thunkParams[2] }
    );
    expect(fetchyeThunk).toHaveBeenCalledWith(...fetchyeParams.slice(1));
  });

  it('should not dispatch the stream action on the client', async () => {
    expect.assertions(1);

    global.window = originalWindow;

    const fetchyeThunk = jest.fn();
    fetchyeThunk.mockResolvedValue(Symbol('fetchRequest'));

    const fetchyeParams = [fetchyeThunk, Symbol('fetchyeArgs - key'), Symbol('fetchyeArgs - options'), Symbol('fetchyeArgs - fetcher')];
    const streamFetchyeThunk = streamFetchye(...fetchyeParams);
    const thunkParams = [mockDispatch, Symbol('getState'), Symbol('fetchClient')];
    await streamFetchyeThunk(
      fetchyeThunk, thunkParams[0], thunkParams[1], { fetchClient: thunkParams[2] }
    );
    expect(streamActionSpy).not.toHaveBeenCalled();
  });
});
