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

import { ignoreHeadersByKey } from '../src/mapOptionsToKeyHelpers';

describe('mapOptionsToKeyHelpers', () => {
  describe('ignoreHeadersByKey', () => {
    it('should do nothing if the header key is not present', () => {
      expect(ignoreHeadersByKey([])({})).toEqual({});
      expect(ignoreHeadersByKey([])(
        { otherKey: 'otherKeyValue' }
      )).toEqual(
        { otherKey: 'otherKeyValue' }
      );
    });
    it('should do nothing if the header key is present, but the mentioned keys to remove are not present', () => {
      expect(ignoreHeadersByKey(['removeHeaderKey'])(
        { headers: { preserveHeaderKey: 'preserveHeaderKeyValue' } }
      )).toEqual(
        { headers: { preserveHeaderKey: 'preserveHeaderKeyValue' } }
      );
      expect(ignoreHeadersByKey(['removeHeaderKey'])(
        { otherKey: 'otherKeyValue', headers: { preserveHeaderKey: 'preserveHeaderKeyValue' } }
      )).toEqual(
        { otherKey: 'otherKeyValue', headers: { preserveHeaderKey: 'preserveHeaderKeyValue' } }
      );
    });
    it('should remove the mentioned key if its present in the headers', () => {
      expect(ignoreHeadersByKey(['removeHeaderKey'])(
        { headers: { preserveHeaderKey: 'preserveHeaderKeyValue', removeHeaderKey: 'removeHeaderKeyValue' } }
      )).toEqual(
        { headers: { preserveHeaderKey: 'preserveHeaderKeyValue' } }
      );
      expect(ignoreHeadersByKey(['removeHeaderKey'])(
        { otherKey: 'otherKeyValue', headers: { preserveHeaderKey: 'preserveHeaderKeyValue', removeHeaderKey: 'removeHeaderKeyValue' } }
      )).toEqual(
        { otherKey: 'otherKeyValue', headers: { preserveHeaderKey: 'preserveHeaderKeyValue' } }
      );
    });
  });
});
