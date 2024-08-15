import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { trimQueryBody } from './trimQueryBody';

export const trimOptions = (options) => {
  const { existingQuery, isGraphQL } = options || {};
  const {
    body: requestBody,
    ...restOfOptions
  } = options || {};
  const {
    query,
    ...restOfBody
  } = requestBody || {};

  if (isGraphQL && query && existingQuery) {
    return {
      ...restOfOptions,
      body: JSON.stringify({
        query: jsonToGraphQLQuery(trimQueryBody(query, existingQuery), { pretty: true }),
        ...restOfBody,
      }),
    };
  }
  if (isGraphQL && query) {
    return {
      ...restOfOptions,
      body: JSON.stringify({
        query: jsonToGraphQLQuery(query, { pretty: true }),
        ...restOfBody,
      }),
    };
  }
  return options;
};
