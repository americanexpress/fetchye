import merge from 'lodash.merge';

export const mergeGraphQLResponses = (existingResponse, newResponse) => {
  if (!existingResponse) return newResponse;

  return {
    ...existingResponse,
    ...newResponse,
    body: merge(existingResponse.body, newResponse.body),
  };
};
