/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import * as fs from "fs";
import * as nodePath from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";

export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ["legacy-js-api"],
            },
        },
    },
    plugins: [
        svgr({
            svgrOptions: { exportType: "named", ref: true, svgo: false, titleProp: true },
            include: "**/*.svg",
        }),
        react(),
        nodePolyfills(),
    ],
    assetsInclude: ["node_modules/privmx-components/**/*.woff2"],
    resolve: {
        alias: {
            "@": nodePath.resolve(__dirname, "./src/"),
        },
    },
    base: "/panel",
    server: {
        port: 3003,
        open: false,
        watch: {
            usePolling: true,
        },
        fs: {
            allow: [".", ...getExtraFsAllowList()],
        },
    },
});

function getPrivMxComponentsDependencyVersion(): string {
    const packageJsonPath = "./package.json";
    if (!fs.existsSync(packageJsonPath)) {
        throw new Error("package.json not found");
    }
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const dependencies = packageJson.dependencies ?? {};
    const privMxComponentsVersion = dependencies["privmx-components"] ?? "";
    if (privMxComponentsVersion === "") {
        throw new Error("privmx-components dependency not found in package.json");
    }

    return privMxComponentsVersion as string;
}

function getExtraFsAllowList(): string[] {
    const extraFsAllowList = [];

    const privMxComponentsVersion = getPrivMxComponentsDependencyVersion();
    if (privMxComponentsVersion.startsWith("file:")) {
        const privMxComponentsPath = privMxComponentsVersion.substring("file:".length);
        const privMxComponentsDistPath = nodePath.join(privMxComponentsPath, "dist");
        if (fs.existsSync(privMxComponentsDistPath)) {
            extraFsAllowList.push(privMxComponentsDistPath);
        }
    }

    return extraFsAllowList;
}
