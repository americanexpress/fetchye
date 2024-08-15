import merge from 'lodash.merge';
import deepEqual from 'deep-equal';

export const handleGraphQLRequest = ({
  existingQuery, options,
}) => {
  const {
    body: {
      query,
    } = {},
    isGraphQL = false,
  } = options || {};
  const mergedQuery = {};
  let newQuery = false;
  let queryOptions = null;
  if (isGraphQL) {
    if (existingQuery && query) {
      merge(mergedQuery, existingQuery, query);
      if (!deepEqual(existingQuery, mergedQuery)) {
        newQuery = true;
        queryOptions = {
          ...options,
          existingQuery,
          body: {
            ...options.body,
            query: mergedQuery,
          },
        };
      }
    }
  }
  return {
    graphQLOptions: queryOptions,
    newQuery,
  };
};
