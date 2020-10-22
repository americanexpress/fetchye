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

export const isLoading = ({
  loading, data, numOfRenders, options,
}) => {
  // If first render
  if (numOfRenders === 1) {
    // and defer is true
    if (options.defer) {
      // isLoading should be false
      return false;
    }
    // and no data exists and presume loading state isn't present
    if (!data) {
      // isLoading should be true
      return true;
    }
  }
  // If not on first render and loading from cache is true
  if (loading) {
    // isLoading should be true
    return true;
  }
  // else isLoading should be false
  return false;
};

export const coerceSsrField = (field) => {
  if (!field) {
    return null;
  }
  if (field instanceof Error) {
    return field.toString?.();
  }
  return field;
};
