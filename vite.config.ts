/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import * as nodePath from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ["legacy-js-api"],
            },
        },
    },
    plugins: [react(), nodePolyfills()],
    resolve: {
        alias: {
            "@": nodePath.resolve(__dirname, "./src/"),
        },
    },
    base: "",
    server: {
        port: 3003,
        open: false,
    },
});
