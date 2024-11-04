import type { AuthData } from "@/contexts/AuthDataContext";
import type { PrivMxBridgeUrl } from "@/privMxBridgeApi/types";
import { MissingEnvVarError } from "./errors/MissingEnvVarError";
import { type LogLevel, logLevels } from "./logLevels";

export class Env {
    static get privMxBridgeUrl(): PrivMxBridgeUrl {
        return this.assertVarDefined<PrivMxBridgeUrl>("VITE_PRIVMX_BRIDGE_URL", import.meta.env["VITE_PRIVMX_BRIDGE_URL"] as string | undefined);
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

    static get isDevEnv(): boolean {
        return import.meta.env.MODE === "development";
    }

    static get isProdEnv(): boolean {
        return import.meta.env.MODE === "production";
    }

    static get logLevel(): LogLevel {
        const rawLogLevel = this.assertVarDefined<string>("VITE_LOG_LEVEL", import.meta.env["VITE_LOG_LEVEL"] as string | undefined);
        if (!logLevels.includes(rawLogLevel as LogLevel)) {
            throw new Error(`Invalid log level: ${rawLogLevel}`);
        }
        return rawLogLevel as LogLevel;
    }

    private static assertVarDefined<T extends string = string>(varName: string, varValue: string | undefined): T {
        if (typeof varValue === "undefined") {
            throw new MissingEnvVarError(varName);
        }
        return varValue as T;
    }
}
