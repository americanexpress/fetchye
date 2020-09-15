export const defaultEqualityChecker = (a, b) => a.data === b.data
&& a.error === b.error
&& a.loading === b.loading;
