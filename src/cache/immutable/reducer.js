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

// Immutable is an optional dependency
// eslint-disable-next-line import/no-extraneous-dependencies
import { Map as iMap, Set as iSet } from 'immutable';
import {
  IS_LOADING,
  SET_DATA,
  DELETE_DATA,
  ERROR,
  CLEAR_ERROR,
} from '../constants';

export function fetchyeReducer(state = iMap({
  errors: iMap(),
  loading: iSet(),
  data: iMap(),
}), action) {
  const [namespace] = action.type.split('/');
  if (namespace !== '@fetchye') {
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
          .deleteIn(['loading', action.hash])
      );
    case IS_LOADING:
      return state.updateIn(['loading'], (loading) => loading.add(action.hash));
    case SET_DATA:
      return state.withMutations(
        (nextState) => nextState
          .deleteIn(['loading', action.hash])
          .setIn(['data', action.hash], action.value)
      );
    default:
      return state;
  }
}

export default fetchyeReducer;
