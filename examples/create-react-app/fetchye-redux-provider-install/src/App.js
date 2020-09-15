import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { FetchyeReduxProvider } from "fetchye/lib/FetchyeReduxProvider";
import SimpleCache from "fetchye/lib/cache/SimpleCache";
import Profile from "./Profile";
import "./styles.css";

const fetchyeCache = SimpleCache({
  // Need to tell Fetchye where the cache reducer will be located
  cacheSelector: (state) => state
});
const store = createStore(fetchyeCache.reducer);
export default function App() {
  return (
    <Provider store={store}>
      <FetchyeReduxProvider cache={fetchyeCache}>
        <Profile />
      </FetchyeReduxProvider>
    </Provider>
  );
}
