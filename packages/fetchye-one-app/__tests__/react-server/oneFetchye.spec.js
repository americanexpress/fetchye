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

import oneFetchye from '../../src/react-server/oneFetchye';

jest.mock('fetchye', () => ({
  makeServerFetchye: jest.fn((...makeFetchyeArgs) => jest.fn((...fetcheArgs) => Promise.resolve(
    { makeFetchyeArgs, fetcheArgs }
  ))),
}));
describe('react-server/oneFetchye', () => {
  it('should return a one-app-thunk that calls fetchye with null cache and store', async () => {
    expect.assertions(1);
    const fetchyeParams = [Symbol('fetchyeArgs 1'), Symbol('fetchyeArgs 2')];
    const fetchyeThunk = oneFetchye(...fetchyeParams);
    const thunkParams = [Symbol('dispatch'), Symbol('getState'), Symbol('fetchClient')];
    const response = await fetchyeThunk(
      thunkParams[0], thunkParams[1], { fetchClient: thunkParams[2] }
    );
    expect(response).toStrictEqual({
      fetcheArgs: fetchyeParams,
      makeFetchyeArgs: [
        {
          cache: null,
          store: null,
          fetchClient: thunkParams[2],
          promiseStore: {
            getLocalPromise: expect.any(Function),
            storeLocalPromise: expect.any(Function),
          },
        },
      ],
    });
  });

  it('should always give fetchye a promise store to deduplicate requests', async () => {
    expect.assertions(1);
    const fetchyeThunk = oneFetchye(Symbol('fetchyeArgs 1'));
    const response = await fetchyeThunk(
      jest.fn(), jest.fn(), { fetchClient: Symbol('fetchClient') }
    );
    expect(response.makeFetchyeArgs[0].promiseStore).toStrictEqual({
      getLocalPromise: expect.any(Function),
      storeLocalPromise: expect.any(Function),
    });
  });
});
