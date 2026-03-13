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

import * as actions from '../../src/streaming/actions';

const storeLocalPromiseMock = jest.fn();
const getLocalPromiseMock = jest.fn();
const getStreamingPromisesMock = jest.fn();
const storeStreamingPromiseMock = jest.fn();
const promiseStore = {
  storeLocalPromise: storeLocalPromiseMock,
  getLocalPromise: getLocalPromiseMock,
  getStreamingPromises: getStreamingPromisesMock,
  storeStreamingPromise: storeStreamingPromiseMock,
};
const dispatchMock = jest.fn((thunk) => thunk(undefined, undefined, { promiseStore }));

describe('Streaming actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('storeLocalPromise', () => {
    it('stores a promise in the promise store', () => {
      expect.assertions(1);

      const promise = new Promise(() => { });
      const domain = Symbol('domain');
      const key = Symbol('key');
      dispatchMock(actions.storeLocalPromise(domain, key, promise));

      expect(storeLocalPromiseMock).toHaveBeenCalledWith(domain, key, promise);
    });
  });

  describe('getLocalPromise', () => {
    it('retrieves a promise from the promise store', () => {
      expect.assertions(1);

      const promise = new Promise(() => { });
      const domain = Symbol('domain');
      const key = Symbol('key');
      dispatchMock(actions.getLocalPromise(domain, key, promise));

      expect(getLocalPromiseMock).toHaveBeenCalledWith(domain, key);
    });
  });

  describe('getStreamingPromises', () => {
    it('retrieves all promises in promise store', () => {
      expect.assertions(2);

      getStreamingPromisesMock.mockReturnValue(null);

      expect(dispatchMock(actions.getStreamingPromises())).toEqual([]);

      const promises = [Symbol('promise-1'), Symbol('promise-2')];
      getStreamingPromisesMock.mockReturnValue(promises);

      expect(dispatchMock(actions.getStreamingPromises())).toEqual(promises);
    });
  });

  describe('stream', () => {
    const { stream } = actions;

    test.each([
      {
        input: 'not an array',
        error: 'PromiseArray must be an array',
        label: 'promiseArray is not an array',
      },
      {
        input: [{ domain: 1 }],
        error: 'Domain must be a string',
        label: 'domain is provided but not a string',
      },
      {
        input: [{ key: 1 }],
        error: 'Key must be a string',
        label: 'key not a string',
      },
      {
        input: [{ key: 'test', promise: 'not a promise' }],
        error: 'Promise must be an instance of Promise',
        label: 'promise is not an instance of Promise',
      },
    ].map((testCase) => [testCase.label, testCase.input, testCase.error]))('should throw an error when %s', (_, input, error) => {
      expect(() => dispatchMock(stream(input))).toThrow(error);
    });

    it('should call promiseStore.storeStreamingPromise with correct parameters', () => {
      expect.assertions(1);

      const promise = Promise.resolve('test');

      dispatchMock(stream([{ domain: 'domain1', key: 'key1', promise }]));

      expect(storeStreamingPromiseMock).toHaveBeenCalledWith('domain1', 'key1', promise);
    });

    it('should call promiseStore.storeStreamingPromise with domain not provided', () => {
      expect.assertions(1);

      const promise = Promise.resolve('test');

      dispatchMock(stream([{ key: 'key1', promise }]));

      expect(storeStreamingPromiseMock).toHaveBeenCalledWith('key1', 'key1', promise);
    });
  });
});
