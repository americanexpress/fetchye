import { makeServerFetchye } from 'fetchye';
import OneCache from './OneCache';

const oneFetchye = (...fetchyeArgs) => async (dispatch, getState, { fetchClient }) => {
  const fetchye = makeServerFetchye({
    store: { getState, dispatch },
    fetchClient,
    cache: OneCache(),
  });
  return fetchye(...fetchyeArgs);
};

export default oneFetchye;
