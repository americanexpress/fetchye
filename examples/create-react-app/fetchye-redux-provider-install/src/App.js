import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { FetchyeReduxProvider } from "fetchye/lib/FetchyeReduxProvider";
import SimpleCache from "fetchye/lib/cache/SimpleCache";
import Posts from "./Posts";
import "./styles.css";

const fetchyeCache = SimpleCache({
  // Need to tell Fetchye where the cache reducer will be located
  cacheSelector: (state) => state
});
const store = createStore(fetchyeCache.reducer);
// Visit https://codesandbox.io/s/json-server-1i5z0 sandbox to start the fake api if not working
export default function App() {
  return (
    <Provider store={store}>
      <FetchyeReduxProvider cache={fetchyeCache}>
        <Posts />
      </FetchyeReduxProvider>
    </Provider>
  );
}
