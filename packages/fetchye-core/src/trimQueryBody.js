import deepEqual from 'deep-equal';

export const trimQueryBody = (newQuery, existingQuery) => {
  const trimmedQuery = {};
  // eslint-disable-next-line dot-notation -- __args and __name are special keys
  if (newQuery['__args'] && existingQuery['__args'] && !deepEqual(newQuery['__args'], existingQuery['__args'])) {
    return trimmedQuery;
  }
  // eslint-disable-next-line dot-notation -- __args and __name are special keys
  if (newQuery['__name'] && existingQuery['__name'] && !deepEqual(newQuery['__name'], existingQuery['__name'])) {
    return trimmedQuery;
  }
  Object.keys(newQuery).forEach((key) => {
    if (newQuery[key] && !existingQuery[key]) {
      trimmedQuery[key] = newQuery[key];
    }
    if (key === '__args' || key === '__name') {
      trimmedQuery[key] = newQuery[key];
    }
    if (typeof newQuery[key] === 'object' && !Array.isArray(newQuery[key]) && newQuery[key] !== null) {
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
