const graphQLTerms = ['__args', '__name', '__aliasFor', '__variables', '__directives', '__all_on', '__on', '__typeName', 'mutation'];

export const trimQueryBody = (newQuery, existingQuery) => {
  const trimmedQuery = {};
  Object.keys(newQuery).forEach((key) => {
    if (newQuery[key] && !existingQuery[key]) {
      trimmedQuery[key] = newQuery[key];
    } else if (graphQLTerms.indexOf(key) > -1) {
      trimmedQuery[key] = newQuery[key];
    } else if (typeof newQuery[key] === 'object' && !Array.isArray(newQuery[key]) && newQuery[key] !== null) {
      const cutQueryObject = trimQueryBody(newQuery[key], existingQuery[key]);
      const {
        __args, __name, ...rest
      } = cutQueryObject;
      if (Object.keys(rest).length > 0) {
        trimmedQuery[key] = cutQueryObject;
      }
    }
  });
  return trimmedQuery;
};
