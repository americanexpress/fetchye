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

import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { trimQueryBody } from '../src/trimQueryBody';
import { defaultFetcher } from '../src/defaultFetcher';

jest.mock('json-to-graphql-query', () => ({
  jsonToGraphQLQuery: jest.fn(),
}));
jest.mock('../src/trimQueryBody', () => ({
  trimQueryBody: jest.fn(),
}));

global.console.error = jest.fn();

describe('defaultFetcher', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should handle graphql query', async () => {
    const fetchClient = jest.fn(async () => ({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ jsonBodyMock: 'jsonBodyMock' }),
      headers: new global.Headers({
        'Content-Type': 'application/json',
      }),
    }));
    // write a mock for jsonToGraphQLQuery
    jsonToGraphQLQuery.mockImplementationOnce(() => 'jsonToGraphQLQueryMock');
    trimQueryBody.mockImplementationOnce(() => 'trimQueryBodyMock');
    const data = await defaultFetcher(fetchClient, 'http://example.com', {
      isGraphQL: true,
      body: {
        query: 'queryMock',
      },
    });
    expect(data).toMatchInlineSnapshot(`
      Object {
        "error": undefined,
        "payload": Object {
          "body": Object {
            "jsonBodyMock": "jsonBodyMock",
          },
          "headers": Object {
            "content-type": "application/json",
          },
          "ok": true,
          "status": 200,
        },
      }
    `);
    expect(jsonToGraphQLQuery).toHaveBeenCalledWith('queryMock', { pretty: true });
  });
  it('should handle graphql query with missing body', async () => {
    const fetchClient = jest.fn(async () => ({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ jsonBodyMock: 'jsonBodyMock' }),
      headers: new global.Headers({
        'Content-Type': 'application/json',
      }),
    }));
    // write a mock for jsonToGraphQLQuery
    jsonToGraphQLQuery.mockImplementationOnce(() => 'jsonToGraphQLQueryMock');
    trimQueryBody.mockImplementationOnce(() => 'trimQueryBodyMock');
    const data = await defaultFetcher(fetchClient, 'http://example.com', {
      isGraphQL: true,
      body: null,
    });
    expect(data).toMatchInlineSnapshot(`
      Object {
        "error": undefined,
        "payload": Object {
          "body": Object {
            "jsonBodyMock": "jsonBodyMock",
          },
          "headers": Object {
            "content-type": "application/json",
          },
          "ok": true,
          "status": 200,
        },
      }
    `);
    expect(jsonToGraphQLQuery).toHaveBeenCalledWith(undefined, { pretty: true });
  });
  it('should handle graphql query with existing query', async () => {
    const fetchClient = jest.fn(async () => ({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ jsonBodyMock: 'jsonBodyMock' }),
      headers: new global.Headers({
        'Content-Type': 'application/json',
      }),
    }));
    // write a mock for jsonToGraphQLQuery
    jsonToGraphQLQuery.mockImplementationOnce(() => 'jsonToGraphQLQueryMock');
    trimQueryBody.mockImplementationOnce(() => 'trimQueryBodyMock');
    const data = await defaultFetcher(fetchClient, 'http://example.com', {
      isGraphQL: true,
      existingQuery: 'existingQueryMock',
      body: {
        query: 'queryMock',
      },
    });
    expect(data).toMatchInlineSnapshot(`
      Object {
        "error": undefined,
        "payload": Object {
          "body": Object {
            "jsonBodyMock": "jsonBodyMock",
          },
          "headers": Object {
            "content-type": "application/json",
          },
          "ok": true,
          "status": 200,
        },
      }
    `);
    expect(jsonToGraphQLQuery).toHaveBeenCalledWith('trimQueryBodyMock', { pretty: true });
    expect(trimQueryBody).toHaveBeenCalledWith('queryMock', 'existingQueryMock');
  });

  it('should handle graphql query with existing query and no body', async () => {
    const fetchClient = jest.fn(async () => ({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ jsonBodyMock: 'jsonBodyMock' }),
      headers: new global.Headers({
        'Content-Type': 'application/json',
      }),
    }));
    // write a mock for jsonToGraphQLQuery
    jsonToGraphQLQuery.mockImplementationOnce(() => 'jsonToGraphQLQueryMock');
    trimQueryBody.mockImplementationOnce(() => 'trimQueryBodyMock');
    const data = await defaultFetcher(fetchClient, 'http://example.com', {
      isGraphQL: true,
      existingQuery: 'existingQueryMock',
      body: null,
    });
    expect(data).toMatchInlineSnapshot(`
      Object {
        "error": undefined,
        "payload": Object {
          "body": Object {
            "jsonBodyMock": "jsonBodyMock",
          },
          "headers": Object {
            "content-type": "application/json",
          },
          "ok": true,
          "status": 200,
        },
      }
    `);
    expect(jsonToGraphQLQuery).toHaveBeenCalledWith('trimQueryBodyMock', { pretty: true });
    expect(trimQueryBody).toHaveBeenCalledWith(undefined, 'existingQueryMock');
  });

  it('should return payload and undefined error when status 200', async () => {
    const fetchClient = jest.fn(async () => ({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ jsonBodyMock: 'jsonBodyMock' }),
      headers: new global.Headers({
        'Content-Type': 'application/json',
      }),
    }));
    const data = await defaultFetcher(fetchClient, 'http://example.com');
    expect(data).toMatchInlineSnapshot(`
      Object {
        "error": undefined,
        "payload": Object {
          "body": Object {
            "jsonBodyMock": "jsonBodyMock",
          },
          "headers": Object {
            "content-type": "application/json",
          },
          "ok": true,
          "status": 200,
        },
      }
    `);
  });
  it('should return payload with the raw text body and undefined error when the body cannot be parsed', async () => {
    const fetchClient = jest.fn(async () => ({
      ok: true,
      status: 200,
      text: async () => 'unparsableTextBodyMock',
      headers: new global.Headers({}),
    }));
    const data = await defaultFetcher(fetchClient, 'http://example.com');
    expect(data).toMatchInlineSnapshot(`
      Object {
        "error": undefined,
        "payload": Object {
          "body": "unparsableTextBodyMock",
          "headers": Object {},
          "ok": true,
          "status": 200,
        },
      }
    `);
  });
  it('should return empty object if header entries does not exist', async () => {
    const fetchClient = jest.fn(async () => ({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ jsonBodyMock: 'jsonBodyMock' }),
      headers: undefined,
    }));
    const data = await defaultFetcher(fetchClient, 'http://example.com');
    expect(data).toMatchInlineSnapshot(`
      Object {
        "error": undefined,
        "payload": Object {
          "body": Object {
            "jsonBodyMock": "jsonBodyMock",
          },
          "headers": Object {},
          "ok": true,
          "status": 200,
        },
      }
    `);
  });
  it('should stringify a post body', async () => {
    const fetchClient = jest.fn(async () => {
      throw new Error('error');
    });
    const data = await defaultFetcher(fetchClient, 'http://example.com');
    expect(global.console.error).toHaveBeenCalled();
    expect(data).toMatchInlineSnapshot(`
      Object {
        "error": [Error: error],
        "payload": undefined,
      }
    `);
  });
  it('should return payload and undefined error when status 204 (No content)', async () => {
    const fetchClient = jest.fn(async () => ({
      ok: true,
      status: 204,
      text: async () => '',
      headers: new global.Headers({}),
    }));
    const data = await defaultFetcher(fetchClient, 'http://example.com');
    expect(data).toMatchInlineSnapshot(`
      Object {
        "error": undefined,
        "payload": Object {
          "body": "",
          "headers": Object {},
          "ok": true,
          "status": 204,
        },
      }
    `);
  });
});
