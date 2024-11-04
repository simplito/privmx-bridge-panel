import type * as ServerApiTypes from "privmx-server-api";

export class ApiKeyUtils {
    static scopeStringToArray(scopeString: string): ServerApiTypes.types.auth.Scope[] {
        return scopeString.split("\n").filter((scope) => scope.trim() !== "") as ServerApiTypes.types.auth.Scope[];
    }
    static scopeArrayToString(scopeArray: ServerApiTypes.types.auth.Scope[]): string {
        return scopeArray.join("\n");
    }
}
