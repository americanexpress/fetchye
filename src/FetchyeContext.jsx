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

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import createSharedReactContext from 'create-shared-react-context';

const contextShape = {
  dispatch: null,
  fetchClient: null,
  useFetchyeSelector: () => {
    throw new Error('Could not find a Fetchye Provider. Please add one in a parent component to fix this.');
  },
};

// Touching this will cause a breaking change
export const SHARED_CONTEXT_ID = 'FetchyeContext';

export const FetchyeContext = createSharedReactContext(contextShape, SHARED_CONTEXT_ID);

const makeUseFetchyeSelector = (cacheSelector) => () => useSelector(
  (state) => cacheSelector(state)
);

export const FetchyeReduxProvider = ({
  cacheSelector, fetchClient = fetch, children,
}) => {
  const dispatch = useDispatch();
  const memoizedConfig = useMemo(() => ({
    ...contextShape,
    dispatch,
    useFetchyeSelector: makeUseFetchyeSelector(cacheSelector),
    fetchClient,
  }), []);
  return (
    <FetchyeContext.Provider value={memoizedConfig}>
      {children}
    </FetchyeContext.Provider>
  );
};

FetchyeReduxProvider.propTypes = {
  cacheSelector: PropTypes.func.isRequired,
  fetchClient: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default FetchyeReduxProvider;
