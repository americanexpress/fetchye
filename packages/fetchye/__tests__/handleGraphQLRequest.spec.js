// write tests for handleGraphQLRequest

import { handleGraphQLRequest } from '../src/handleGraphQLRequest';

describe('handleGraphQLRequest', () => {
  it('should add existing query and merged query', () => {
    const existingQuery = {
      query: {
        __args: { id: '1' },
        __name: 'test',
      },
    };
    const options = {
      body: {
        query: {
          __args: { id: '2' },
          __name: 'test',
        },
      },
      isGraphQL: true,
    };
    expect(
      handleGraphQLRequest({
        existingQuery,
        options,
      })
    ).toMatchInlineSnapshot(`
      Object {
        "graphQLOptions": Object {
          "body": Object {
            "query": Object {
              "__args": Object {
                "id": "2",
              },
              "__name": "test",
              "query": Object {
                "__args": Object {
                  "id": "1",
                },
                "__name": "test",
              },
            },
          },
          "existingQuery": Object {
            "query": Object {
              "__args": Object {
                "id": "1",
              },
              "__name": "test",
            },
          },
          "isGraphQL": true,
        },
        "newQuery": true,
      }
    `);
  });
  it('should not add existing query and merged query when query is matched', () => {
    const existingQuery = {
      __args: { id: '1' },
      __name: 'test',
    };
    const options = {
      body: {
        query: {
          __args: { id: '1' },
          __name: 'test',
        },
      },
      isGraphQL: true,
    };
    expect(
      handleGraphQLRequest({
        existingQuery,
        options,
      })
    ).toMatchInlineSnapshot(`
      Object {
        "graphQLOptions": null,
        "newQuery": false,
      }
    `);
  });
  it('should not add existing query and merged query when isGraphQL is false', () => {
    const existingQuery = {
      query: {
        __args: { id: '1' },
        __name: 'test',
      },
    };
    const options = {
      body: {
        query: {
          __args: { id: '2' },
          __name: 'test',
        },
      },
      isGraphQL: false,
    };
    expect(
      handleGraphQLRequest({
        existingQuery,
        options,
      })
    ).toMatchInlineSnapshot(`
      Object {
        "graphQLOptions": null,
        "newQuery": false,
      }
    `);
  });
  it('should not add existing query and merged query when existingQuery is undefined', () => {
    const existingQuery = undefined;
    const options = {
      body: {
        query: {
          __args: { id: '2' },
          __name: 'test',
        },
      },
      isGraphQL: true,
    };
    expect(
      handleGraphQLRequest({
        existingQuery,
        options,
      })
    ).toMatchInlineSnapshot(`
      Object {
        "graphQLOptions": null,
        "newQuery": false,
      }
    `);
  });
  it('should not add existing query and merged query when query is undefined', () => {
    const existingQuery = {
      query: {
        __args: { id: '1' },
        __name: 'test',
      },
    };
    const options = {
      body: {
        query: undefined,
      },
      isGraphQL: true,
    };
    expect(
      handleGraphQLRequest({
        existingQuery,
        options,
      })
    ).toMatchInlineSnapshot(`
      Object {
        "graphQLOptions": null,
        "newQuery": false,
      }
    `);
  });
  it('should not add existing query and merged query when existingQuery and query is undefined', () => {
    const existingQuery = undefined;
    const options = undefined;
    expect(
      handleGraphQLRequest({
        existingQuery,
        options,
      })
    ).toMatchInlineSnapshot(`
      Object {
        "graphQLOptions": null,
        "newQuery": false,
      }
    `);
  });
});
