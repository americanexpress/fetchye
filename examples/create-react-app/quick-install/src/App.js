import React from "react";
import { useFetchye } from "fetchye";
import "./styles.css";

export default function App() {
  const { isLoading, data } = useFetchye("https://bulyq.sse.codesandbox.io/profile");
  return <>{!isLoading && <p>{data.body.name}</p>}</>;
}
