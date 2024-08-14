import { mergeGraphQLResponses } from '../src/mergeGraphQLResponse';

describe('mergeGraphQLResponses', () => {
  it('should merge two responses', () => {
    const existingResponse = {
      body: {
        a: 1,
      },
    };
    const newResponse = {
      body: {
        b: 2,
      },
    };
    const result = mergeGraphQLResponses(existingResponse, newResponse);
    expect(result).toEqual({
      body: {
        a: 1,
        b: 2,
      },
    });
  });
  it('should return newResponse if existingResponse is null', () => {
    const newResponse = {
      body: {
        b: 2,
      },
    };
    const result = mergeGraphQLResponses(null, newResponse);
    expect(result).toEqual(newResponse);
  });
});
