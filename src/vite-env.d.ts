/// <reference types="vite/client" />

declare module "*.svg" {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    import React = require("react");
    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    const src: string;
    // eslint-disable-next-line import/no-default-export
    export default src;
}
