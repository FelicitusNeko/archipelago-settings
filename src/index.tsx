import React from "react";
import { createRoot } from "react-dom/client";

import * as serviceWorker from "./serviceWorker";
import "./index.css";
import SettingsTool from "./routes/SettingsTool";

const root = document.querySelector("#root");
if (root != null) createRoot(root).render(
  <React.StrictMode>
    <SettingsTool />
  </React.StrictMode>
);
else document.append("Root not found, unable to render app");

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
