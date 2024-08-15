import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { trimOptions } from '../src/trimOptions';
import { trimQueryBody } from '../src/trimQueryBody';

jest.mock('json-to-graphql-query', () => ({
  jsonToGraphQLQuery: jest.fn(),
}));
jest.mock('../src/trimQueryBody', () => ({
  trimQueryBody: jest.fn(),
}));

describe('trimOptions', () => {
  it('should return options if isGraphQL is false', () => {
    const options = { isGraphQL: false };
    expect(trimOptions(options)).toEqual(options);
  });
  it('should return options if isGraphQL is true and existingQuery is not provided', () => {
    const options = { isGraphQL: true, body: { query: 'query' } };
    jsonToGraphQLQuery.mockImplementation((value) => value);
    const expectedBody = JSON.stringify({
      query: 'query',
    });
    expect(trimOptions(options)).toEqual({ ...options, body: expectedBody });
  });
  it('should return options with trimmed query if isGraphQL is true and existingQuery is provided', () => {
    const options = { isGraphQL: true, existingQuery: 'existingQuery', body: { query: 'query' } };
    const trimmedQuery = 'trimmedQuery';
    trimQueryBody.mockReturnValue(trimmedQuery);
    jsonToGraphQLQuery.mockImplementation((value) => value);
    const expectedBody = JSON.stringify({
      query: 'trimmedQuery',
    });
    expect(trimOptions(options)).toEqual({ ...options, body: expectedBody });
  });
  it('should handle if options is not provided', () => {
    expect(trimOptions()).toEqual(undefined);
  });
});
