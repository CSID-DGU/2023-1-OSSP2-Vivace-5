import React from "react";
import * as ReactDOMClient from "react-dom/client";

import App from "./App";
import "./styles/index.scss";

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOMClient.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
