import { Env as EnvCore } from "privmx-components/utils/Env";
import type { AuthData } from "./contexts/AuthDataContext";
import type { PrivMxBridgeUrl } from "./privMxBridgeApi/types";

export class Env extends EnvCore {
    static get privMxBridgeUrl(): PrivMxBridgeUrl {
        return this.getEnvVarValue("VITE_PRIVMX_BRIDGE_URL", { required: true });
    }

    static get devAutoSignInAuthData(): AuthData | null {
        if (!this.isDevEnv) {
            return null;
        }
        const rawAuthData = import.meta.env["VITE_DEV_AUTO_SIGN_IN_AUTH_DATA"] as string | undefined;
        if (typeof rawAuthData === "undefined") {
            return null;
        }
        try {
            return JSON.parse(rawAuthData) as AuthData;
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw new Error(`Invalid dev auto sign-in auth data: ${error}`);
        }
    }
}
