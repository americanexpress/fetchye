export const getGraphQLArgs = (query, args = []) => {
  let argsList = [...args];
  Object.keys(query).forEach((key) => {
    if (key === '__args' || key === '__name') {
      argsList.push({ [key]: query[key] });
    }
    if (typeof query[key] === 'object' && !Array.isArray(query[key]) && query[key] !== null) {
      argsList = getGraphQLArgs(query[key], argsList);
    }
  });
  return argsList;
};
