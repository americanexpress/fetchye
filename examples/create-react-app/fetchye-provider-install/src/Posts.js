import React from "react";
import { useFetchye } from "fetchye";

export default function Posts() {
  const { isLoading, data } = useFetchye(
    "https://bulyq.sse.codesandbox.io/profile"
  );
  return <>{!isLoading && <p>{data?.body.name}</p>}</>;
}
