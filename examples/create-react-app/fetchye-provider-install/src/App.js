import React from "react";
import { FetchyeProvider } from "fetchye";
import Posts from "./Posts";
import "./styles.css";

// Visit https://codesandbox.io/s/json-server-1i5z0 sandbox to start the fake api if not working
export default function App() {
  return (
    <FetchyeProvider>
      <Posts />
    </FetchyeProvider>
  );
}
