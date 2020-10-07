import { useRef } from 'react';

const useRefReducer = (reducer, initialState, notify) => {
  const state = useRef(initialState);

  const dispatch = (action) => {
    state.current = reducer(state.current, action);
    notify();
  };
  return [state, dispatch];
};

export default useRefReducer;
