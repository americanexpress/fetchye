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

import { makeServerFetchye } from 'fetchye';
import { makeOneServerFetchye } from '../src/makeOneServerFetchye';
import OneCache from '../src/OneCache';

jest.mock('../src/OneCache');
jest.mock('fetchye', () => ({
  makeServerFetchye: jest.fn(),
}));

describe('makeOneServerFetchye', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('uses OneCache by default', async () => {
    const store = jest.fn();
    const fetchClient = jest.fn();

    makeOneServerFetchye({
      store,
      fetchClient,
    });

    expect(makeServerFetchye).toHaveBeenCalledWith({
      cache: OneCache(),
      store,
      fetchClient,
    });
  });

  it('calls makeServerFetchye with given arguments', () => {
    const store = jest.fn();
    const fetchClient = jest.fn();
    const cache = jest.fn();
    makeOneServerFetchye({
      store,
      fetchClient,
      cache,
    });

    expect(makeServerFetchye).toHaveBeenCalledWith({
      store, fetchClient, cache,
    });
  });
});
