import React from "react";
import { useFetchye } from "fetchye";

export default function Profile() {
  const { isLoading, data } = useFetchye(
    "https://bulyq.sse.codesandbox.io/profile"
  );
  return (
    <p>
      {isLoading && (
        <span aria-label="loading" role="img">
          ⏳
        </span>
      )}
      {!isLoading && data?.body.name}
    </p>
  );
}
