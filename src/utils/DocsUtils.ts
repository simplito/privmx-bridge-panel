import { Env } from "./Env";

export class DocsUtils {
    static getDocsUrl(hash?: string): string {
        const baseUrl = Env.privMxBridgeUrl.endsWith("/") ? Env.privMxBridgeUrl : `${Env.privMxBridgeUrl}/`;
        return `${baseUrl}docs/${hash === undefined ? "" : `#${hash}`}`;
    }

    static getIntroductionToAclUrl(): string {
        return this.getDocsUrl("introduction-to-acl");
    }

    static getApiScopesUrl(): string {
        return this.getDocsUrl("api-scopes");
    }
}
