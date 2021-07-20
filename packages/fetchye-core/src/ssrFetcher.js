import { defaultFetcher } from './defaultFetcher';

export const ssrFetcher = async (...params) => {
  const { payload } = await defaultFetcher(...params);
  return {
    payload,
    error: null,
  };
};

export default ssrFetcher;
