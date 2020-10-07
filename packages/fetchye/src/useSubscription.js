import { useRef } from 'react';

const useSubscription = () => {
  const subscribers = useRef(new Set());
  return [
    function notify() {
      subscribers.current.forEach((callback) => {
        callback();
      });
    },
    function subscribe(callback) {
      subscribers.current.add(callback);
      return () => {
        subscribers.current.delete(callback);
      };
    },
  ];
};

export default useSubscription;
