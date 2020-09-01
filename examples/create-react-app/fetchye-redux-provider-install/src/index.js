import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { ValidateFakeApi } from "./ValidateFakeApi";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <ValidateFakeApi
      sandboxUrl={"https://codesandbox.io/s/fake-books-api-bulyq"}
      url={"https://bulyq.sse.codesandbox.io/"}
    >
      <App />
    </ValidateFakeApi>
  </React.StrictMode>,
  rootElement
);
