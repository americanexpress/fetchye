// write tests for getGraphQLArgs

import { getGraphQLArgs } from '../src/getGraphQLArgs';

describe('getGraphQLArgs', () => {
  it('should return args list from query', () => {
    expect(
      getGraphQLArgs({
        query: {
          __args: { id: '1' },
          __name: 'test',
        },
      })
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "__args": Object {
            "id": "1",
          },
        },
        Object {
          "__name": "test",
        },
      ]
    `);
  });
});
