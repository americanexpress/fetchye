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

import { Map as iMap, Set as iSet } from 'immutable';
import {
  IS_LOADING,
  SET_DATA,
  DELETE_DATA,
  ERROR,
  UPDATE_DATA,
  SET_QUERY,
  CLEAR_ERROR,
  ACTION_NAMESPACE,
} from 'fetchye-core';
import { mergeGraphQLResponses } from './mergeGraphQLResponse';

// eslint-disable-next-line default-param-last -- the first default param value takes care of explicitly calling this function with `undefined` the second param can't be defaulted as it must be provided
export function fetchyeReducer(state = iMap({
  errors: iMap(),
  loading: iSet(),
  data: iMap(),
  query: iMap(),
}), action) {
  if (!action.type.startsWith(ACTION_NAMESPACE)) {
    return state;
  }
  switch (action.type) {
    case DELETE_DATA:
      return state.deleteIn(['data', action.hash]);
    case CLEAR_ERROR:
      return state.deleteIn(['errors', action.hash]);
    case ERROR:
      return state.withMutations(
        (nextState) => nextState
          .setIn(['errors', action.hash], action.error)
          .deleteIn(['data', action.hash])
          .deleteIn(['loading', action.hash])
      );
    case IS_LOADING:
      return state.updateIn(['loading'], (loading) => loading.add(action.hash));
    case SET_DATA:
      return state.withMutations(
        (nextState) => nextState
          .setIn(['data', action.hash], action.value)
          .deleteIn(['loading', action.hash])
          .deleteIn(['errors', action.hash])
      );
    case UPDATE_DATA:
      return state.withMutations(
        (nextState) => nextState
          .updateIn(['data', action.hash], (existingData) => mergeGraphQLResponses(existingData, action.value))
          .deleteIn(['loading', action.hash])
          .deleteIn(['errors', action.hash])
      );
    case SET_QUERY:
      return state.setIn(['query', action.hash], action.query);
    default:
      return state;
  }
}

export default fetchyeReducer;
