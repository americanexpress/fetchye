import React from "react";
import { useFetchye } from "fetchye";

export default function Posts() {
  const { isLoading, data } = useFetchye(
    "https://1i5z0.sse.codesandbox.io/posts/1"
  );
  return <>{!isLoading && <p>{data?.body.title}</p>}</>;
}
