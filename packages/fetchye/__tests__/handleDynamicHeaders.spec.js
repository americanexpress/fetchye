/*
 * Copyright 2023 American Express Travel Related Services Company, Inc.
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

import { handleDynamicHeaders } from '../src/handleDynamicHeaders';

describe('handleDynamicHeaders', () => {
  it('should pass back the exact object passed if the headers field is not a function', () => {
    const testValues = [
      {},
      { body: 'mockBody' },
      { headers: {} },
      { headers: 1 },
      { headers: { staticHeader: 'staticHeaderValue' } },
      // The function should be resistant to being passed non objects too
      Symbol('testSymbol'),
      'value',
      1234,
    ];

    testValues.forEach((testVal) => {
      expect(handleDynamicHeaders(testVal)).toBe(testVal);
    });
  });

  it('should pass back a new object with the headers handled, and other values preserved, when the headers field is a function', () => {
    const testValues = [
      {},
      { body: 'mockBody' },
      { options: { staticOption: 'staticOptionValue' } },
      { symbol: Symbol('testSymbol') },
    ];

    testValues.forEach((testVal) => {
      const valWithDynamicHeader = {
        ...testVal,
        headers: jest.fn(() => ({
          dynamicHeader: 'dynamicHeaderValue',
        })),
      };

      const result = handleDynamicHeaders(valWithDynamicHeader);

      // a new object has been created
      expect(result).not.toBe(valWithDynamicHeader);

      // the headers are no-loger a function
      expect(result.headers).toEqual({
        dynamicHeader: 'dynamicHeaderValue',
      });

      // all other keys are preserved
      Object.keys(testVal).forEach((testValKey) => {
        expect(result[testValKey]).toBe(testVal[testValKey]);
      });
    });
  });
});
