const graphQLTerms = ['__args', '__name', '__aliasFor', '__variables', '__directives', '__all_on', '__on', '__typeName', 'mutation'];

export const getGraphQLArgs = (query, args = []) => {
  let argsList = [...args];
  Object.keys(query).forEach((key) => {
    if (graphQLTerms.indexOf(key) > -1) {
      argsList.push({ [key]: query[key] });
    }
    if (typeof query[key] === 'object' && !Array.isArray(query[key]) && query[key] !== null) {
      argsList = getGraphQLArgs(query[key], argsList);
    }
  });
  return argsList;
};
