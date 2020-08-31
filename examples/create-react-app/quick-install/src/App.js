import React from "react";
import { useFetchye } from "fetchye";
import "./styles.css";

// Visit https://codesandbox.io/s/json-server-1i5z0 sandbox to start the fake api if not working
export default function App() {
  const { isLoading, data } = useFetchye("https://1i5z0.sse.codesandbox.io/posts/1");
  return <>{!isLoading && <p>{data.body.title}</p>}</>;
}
