import type { AccessTokenPrivMxBridgeApiAuthData } from "@/privMxBridgeApi/types";

export class AuthPersistence {
    static readonly accessTokenPrivMxBridgeApiAuthDataLocalStorageKey = "accessTokenPrivMxBridgeApiAuthData";

    static readAuthData(): AccessTokenPrivMxBridgeApiAuthData | null {
        const storedValue = localStorage.getItem(AuthPersistence.accessTokenPrivMxBridgeApiAuthDataLocalStorageKey);
        if (storedValue === null) {
            return null;
        }
        return JSON.parse(storedValue) as AccessTokenPrivMxBridgeApiAuthData;
    }

    static saveAuthData(authData: AccessTokenPrivMxBridgeApiAuthData): void {
        localStorage.setItem(AuthPersistence.accessTokenPrivMxBridgeApiAuthDataLocalStorageKey, JSON.stringify(authData));
    }

    static clearAuthData(): void {
        localStorage.removeItem(AuthPersistence.accessTokenPrivMxBridgeApiAuthDataLocalStorageKey);
    }
}
