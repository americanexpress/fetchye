import { makeServerFetchye } from 'fetchye';
import OneCache from './OneCache';

export const makeOneServerFetchye = ({
  store,
  fetchClient,
  cache,
}) => makeServerFetchye({
  store,
  fetchClient,
  cache: cache || OneCache(),
});
