import "@fontsource-variable/noto-sans";
import React from "react";
// eslint-disable-next-line @typescript-eslint/naming-convention
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { customCss } from "./components/rootAppLayout/mantineTheme";
import "./global.scss";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);

const style = document.createElement("style");
style.innerHTML = customCss;
document.head.appendChild(style);
