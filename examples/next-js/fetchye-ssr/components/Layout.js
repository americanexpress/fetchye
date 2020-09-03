import React from "react";
import { ValidateFakeApi } from "./ValidateFakeApi";

export const Layout = ({ children }) => (
  <ValidateFakeApi
    sandboxUrl={"https://codesandbox.io/s/fake-books-api-bulyq"}
    url={"https://bulyq.sse.codesandbox.io/"}
  >
    {children}
  </ValidateFakeApi>
);
