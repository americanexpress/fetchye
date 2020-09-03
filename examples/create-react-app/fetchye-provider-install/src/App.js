import React from "react";
import { FetchyeProvider } from "fetchye";
import Profile from "./Profile";
import "./styles.css";

export default function App() {
  return (
    <FetchyeProvider>
      <Profile />
    </FetchyeProvider>
  );
}
