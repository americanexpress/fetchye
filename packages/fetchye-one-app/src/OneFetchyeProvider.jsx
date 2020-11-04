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

import React from 'react';
import PropTypes from 'prop-types';
import { FetchyeReduxProvider } from 'fetchye-redux-provider';
import OneCache from './OneCache';

const OneFetchyeProvider = ({
  children,
  fetcher,
  equalityChecker,
  fetchClient = fetch,
  cache,
}) => (
  <FetchyeReduxProvider
    cache={cache || OneCache()}
    fetcher={fetcher}
    equalityChecker={equalityChecker}
    fetchClient={fetchClient}
  >
    {children}
  </FetchyeReduxProvider>
);

OneFetchyeProvider.propTypes = {
  cache: PropTypes.shape({
    reducer: PropTypes.func.isRequired,
    getCacheByKey: PropTypes.func.isRequired,
    cacheSelector: PropTypes.func.isRequired,
  }).isRequired,
  equalityChecker: PropTypes.func,
  fetchClient: PropTypes.func,
  fetcher: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default OneFetchyeProvider;
