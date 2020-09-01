import React from "react";
import { FetchyeProvider } from "fetchye";
import Posts from "./Posts";
import "./styles.css";

export default function App() {
  return (
    <FetchyeProvider>
      <Posts />
    </FetchyeProvider>
  );
}
