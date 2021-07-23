/*
 * Copyright 2021 American Express Travel Related Services Company, Inc.
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

import { ssrFetcher } from '../src/ssrFetcher';
import { defaultFetcher } from '../src/defaultFetcher';

jest.mock('../src/defaultFetcher', () => ({
  defaultFetcher: jest.fn(() => ({
    payload: 'payloadMock',
    error: 'errorMock',
  })),
}));

describe('ssrFetcher', () => {
  it('forward all params to the default fetcher, and return the payload from the default fetcher with error: null', async () => {
    const parameters = ['paramMock1', 'paramMock2', 'paramMock3'];
    const response = await ssrFetcher(...parameters);
    expect(response).toEqual({
      payload: 'payloadMock',
      error: null,
    });

    expect(defaultFetcher.mock.calls[0]).toEqual(parameters);
  });
});
