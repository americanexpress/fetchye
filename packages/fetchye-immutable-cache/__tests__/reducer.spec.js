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

import { createStore } from 'redux';
import {
  loadingAction,
  setAction,
  deleteAction,
  errorAction,
  clearErrorsAction,
  setQuery,
  updateDataAction,
} from 'fetchye-core';
import reducer from '../src/reducer';
import { mergeGraphQLResponses } from '../src/mergeGraphQLResponse';

jest.mock('../src/mergeGraphQLResponse', () => ({
  mergeGraphQLResponses: jest.fn(),
}));

const fakeError = new Error('Fake Error');
const fakeData = {
  status: 200,
  ok: true,
  body: {
    fakeData: true,
  },
};
const fakeQuery = 'query { test }';

const actions = {
  loadingAction,
  setAction,
  deleteAction,
  errorAction,
  setQuery,
  updateDataAction,
  clearErrorsAction,
};

const createScenario = (dispatch, actionKeys, hash) => {
  const actionOrder = actionKeys.map((key) => actions[key]);
  actionOrder.forEach((actionCreator) => {
    dispatch(
      actionCreator({
        hash,
        error: fakeError,
        value: fakeData,
        query: fakeQuery,
      })
    );
  });
};

describe('Immutable Reducer', () => {
  let store;
  beforeEach(() => {
    store = createStore(reducer, reducer(undefined, { type: '' }));
  });
  it('should reflect load state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction'], 'abc1234');
    expect(getState()).toMatchInlineSnapshot(`
      Immutable.Map {
        "errors": Immutable.Map {},
        "loading": Immutable.Set [
          "abc1234",
        ],
        "data": Immutable.Map {},
        "query": Immutable.Map {},
      }
    `);
  });
  it('should reflect load to success state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'setAction'], 'abc1234');
    expect(getState()).toMatchInlineSnapshot(`
      Immutable.Map {
        "errors": Immutable.Map {},
        "loading": Immutable.Set [],
        "data": Immutable.Map {
          "abc1234": Object {
            "body": Object {
              "fakeData": true,
            },
            "ok": true,
            "status": 200,
          },
        },
        "query": Immutable.Map {},
      }
    `);
  });
  it('should reflect load to error state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'errorAction'], 'abc1234');
    expect(getState()).toMatchInlineSnapshot(`
      Immutable.Map {
        "errors": Immutable.Map {
          "abc1234": [Error: Fake Error],
        },
        "loading": Immutable.Set [],
        "data": Immutable.Map {},
        "query": Immutable.Map {},
      }
    `);
  });
  it('should reflect load to success to delete state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'setAction', 'deleteAction'], 'abc1234');
    expect(getState()).toMatchInlineSnapshot(`
      Immutable.Map {
        "errors": Immutable.Map {},
        "loading": Immutable.Set [],
        "data": Immutable.Map {},
        "query": Immutable.Map {},
      }
    `);
  });
  it('should reflect load to error to clear errors state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'errorAction', 'clearErrorsAction'], 'abc1234');
    expect(getState()).toMatchInlineSnapshot(`
      Immutable.Map {
        "errors": Immutable.Map {},
        "loading": Immutable.Set [],
        "data": Immutable.Map {},
        "query": Immutable.Map {},
      }
    `);
  });
  it('should reflect load to success to error state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'setAction', 'errorAction'], 'abc1234');
    expect(getState()).toMatchInlineSnapshot(`
      Immutable.Map {
        "errors": Immutable.Map {
          "abc1234": [Error: Fake Error],
        },
        "loading": Immutable.Set [],
        "data": Immutable.Map {},
        "query": Immutable.Map {},
      }
    `);
  });
  it('should reflect load to error to success state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'errorAction', 'setAction'], 'abc1234');
    expect(getState()).toMatchInlineSnapshot(`
      Immutable.Map {
        "errors": Immutable.Map {},
        "loading": Immutable.Set [],
        "data": Immutable.Map {
          "abc1234": Object {
            "body": Object {
              "fakeData": true,
            },
            "ok": true,
            "status": 200,
          },
        },
        "query": Immutable.Map {},
      }
    `);
  });
  it('should reflect multiple hashes stored', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'setAction'], 'abc1234');
    createScenario(dispatch, ['loadingAction', 'errorAction'], 'def5678');
    expect(getState()).toMatchInlineSnapshot(`
      Immutable.Map {
        "errors": Immutable.Map {
          "def5678": [Error: Fake Error],
        },
        "loading": Immutable.Set [],
        "data": Immutable.Map {
          "abc1234": Object {
            "body": Object {
              "fakeData": true,
            },
            "ok": true,
            "status": 200,
          },
        },
        "query": Immutable.Map {},
      }
    `);
  });
  it('should reflect query state', () => {
    const { dispatch, getState } = store;
    createScenario(dispatch, ['setQuery'], 'abc1234');
    expect(getState()).toMatchInlineSnapshot(`
      Immutable.Map {
        "errors": Immutable.Map {},
        "loading": Immutable.Set [],
        "data": Immutable.Map {},
        "query": Immutable.Map {
          "abc1234": "query { test }",
        },
      }
    `);
  });
  it('should reflect update data state', () => {
    mergeGraphQLResponses.mockReturnValueOnce({ body: { updated: true } });
    const { dispatch, getState } = store;
    createScenario(dispatch, ['loadingAction', 'setAction'], 'abc1234');
    createScenario(dispatch, ['updateDataAction'], 'abc1234');
    expect(getState()).toMatchInlineSnapshot(`
      Immutable.Map {
        "errors": Immutable.Map {},
        "loading": Immutable.Set [],
        "data": Immutable.Map {
          "abc1234": Object {
            "body": Object {
              "updated": true,
            },
          },
        },
        "query": Immutable.Map {},
      }
    `);
  });
  it('should return default state if unknown @fetchye action type', () => {
    const { dispatch, getState } = store;
    dispatch({ type: '@fetchye' });
    expect(getState()).toMatchInlineSnapshot(`
      Immutable.Map {
        "errors": Immutable.Map {},
        "loading": Immutable.Set [],
        "data": Immutable.Map {},
        "query": Immutable.Map {},
      }
    `);
  });
});
