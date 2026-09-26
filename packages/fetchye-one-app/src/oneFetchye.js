import { makeServerFetchye } from 'fetchye';
import OneCache from './OneCache';
import { promiseStoreFromDispatch } from './promiseStoreAdapter';

const oneFetchye = (...fetchyeArgs) => async (dispatch, getState, { fetchClient }) => {
  const fetchye = makeServerFetchye({
    store: { getState, dispatch },
    fetchClient,
    cache: OneCache(),
    // deduping is server only, the promise store has no expiry and the client store is long lived
    promiseStore: global.window ? undefined : promiseStoreFromDispatch(dispatch),
  });
  return fetchye(...fetchyeArgs);
};

export default oneFetchye;
