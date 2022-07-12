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

import {
  IS_LOADING,
  SET_DATA,
  DELETE_DATA,
  ERROR,
  CLEAR_ERROR,
  ACTION_NAMESPACE,

} from 'fetchye-core';

// eslint-disable-next-line default-param-last -- the first default param value takes care of explicitly calling this function with `undefined` the second param can't be defaulted as it must be provided
function reducer(state = {
  errors: {},
  loading: {},
  data: {},
}, action) {
  if (!action.type.startsWith(ACTION_NAMESPACE)) {
    return state;
  }
  switch (action.type) {
    case DELETE_DATA: {
      const { [action.hash]: deletedEntry, ...nextData } = state.data;
      return {
        ...state,
        data: {
          ...nextData,
        },
      };
    }
    case CLEAR_ERROR: {
      const { [action.hash]: deletedEntry, ...nextErrors } = state.errors;
      return {
        ...state,
        errors: {
          ...nextErrors,
        },
      };
    }
    case ERROR: {
      const { [action.hash]: deletedEntry, ...nextLoading } = state.loading;
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.hash]: action.error,
        },
        loading: {
          ...nextLoading,
        },
      };
    }
    case IS_LOADING: {
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.hash]: action.hash,
        },
      };
    }
    case SET_DATA: {
      const { [action.hash]: deletedEntry, ...nextLoading } = state.loading;
      return {
        ...state,
        data: {
          ...state.data,
          [action.hash]: action.value,
        },
        loading: {
          ...nextLoading,
        },
      };
    }
    default:
      return state;
  }
}

const getCacheByKey = (cache = {}, key = undefined) => {
  const data = cache.data?.[key];
  const loading = !!cache.loading?.[key];
  const error = cache.errors?.[key];
  return { data, loading, error };
};

function SimpleCache({ cacheSelector = (state) => state } = {}) {
  return {
    getCacheByKey,
    reducer,
    cacheSelector,
  };
}
export default SimpleCache;
