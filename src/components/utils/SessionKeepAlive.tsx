import type * as ServerApiTypes from "privmx-server-api";
import { useEffect, useRef } from "react";
import { AuthPersistence } from "@/features/auth/AuthPersistence";
import { type UseAuthDataReturnValue, useAuthData } from "@/hooks/useAuthData";
import { useManagerApi } from "@/hooks/useManagerApi";
import type { ManagerApi } from "@/privMxBridgeApi/ManagerApi";
import type { AccessToken, AccessTokenExpiry, AccessTokenPrivMxBridgeApiAuthData, RefreshToken, RefreshTokenExpiry } from "@/privMxBridgeApi/types";
import { Logger } from "@/utils/Logger";

const refreshTokenBeforeExpirySeconds = 60;

export function SessionKeepAlive() {
    const { authData, setAuthData } = useAuthData();
    const managerApi = useManagerApi();
    const abortSignalRef = useRef(new AbortController());

    const accessTokenPrivMxBridgeApiAuthData: AccessTokenPrivMxBridgeApiAuthData | null =
        authData.privMxBridgeApiAuthData?.type === "accessToken" ? authData.privMxBridgeApiAuthData : null;

    useEffect(() => {
        if (accessTokenPrivMxBridgeApiAuthData === null) {
            return;
        }
        const msecToExpiration = accessTokenPrivMxBridgeApiAuthData.accessTokenExpiry - Date.now();
        if (msecToExpiration < 0) {
            return;
        }
        const msecToRefresh = Math.max(0, msecToExpiration - refreshTokenBeforeExpirySeconds * 1000);
        const timeout = setTimeout(() => {
            void refreshAccessToken(managerApi, accessTokenPrivMxBridgeApiAuthData, setAuthData, abortSignalRef.current.signal);
        }, msecToRefresh);
        return () => {
            clearTimeout(timeout);
        };
    }, [managerApi, accessTokenPrivMxBridgeApiAuthData, setAuthData]);

    useEffect(() => {
        const handler = (event: StorageEvent) => {
            if (event.key === AuthPersistence.accessTokenPrivMxBridgeApiAuthDataLocalStorageKey) {
                const newAuthData = AuthPersistence.readAuthData();
                abortSignalRef.current.abort();
                abortSignalRef.current = new AbortController();
                if (newAuthData === null) {
                    setAuthData({
                        privMxBridgeApiAuthData: null,
                    });
                } else {
                    setAuthData({
                        privMxBridgeApiAuthData: newAuthData,
                    });
                }
            }
        };
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener("storage", handler);
        };
    }, [setAuthData]);

    return <></>;
}

// eslint-disable-next-line @typescript-eslint/max-params
async function refreshAccessToken(
    managerApi: ManagerApi,
    accessTokenPrivMxBridgeApiAuthData: AccessTokenPrivMxBridgeApiAuthData,
    setAuthData: UseAuthDataReturnValue["setAuthData"],
    abortSignal: AbortSignal,
): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
    if (navigator.locks) {
        try {
            await navigator.locks.request("refreshAccessToken", { signal: abortSignal }, async () => {
                try {
                    await refreshAccessTokenCore(managerApi, accessTokenPrivMxBridgeApiAuthData, setAuthData);
                } catch (e) {
                    Logger.error(e);
                }
            });
        } catch (e) {
            if (!(e instanceof DOMException) || e.name !== "AbortError") {
                Logger.error(e);
            }
        }
    } else {
        await refreshAccessTokenCore(managerApi, accessTokenPrivMxBridgeApiAuthData, setAuthData);
    }
}

async function refreshAccessTokenCore(
    managerApi: ManagerApi,
    accessTokenPrivMxBridgeApiAuthData: AccessTokenPrivMxBridgeApiAuthData,
    setAuthData: UseAuthDataReturnValue["setAuthData"],
): Promise<void> {
    const result = await managerApi.auth({
        grantType: "refresh_token",
        refreshToken: accessTokenPrivMxBridgeApiAuthData.refreshToken as string as ServerApiTypes.types.auth.ApiRefreshToken,
    });
    const newAccessTokenPrivMxBridgeApiAuthData: AccessTokenPrivMxBridgeApiAuthData = {
        type: "accessToken",
        accessToken: result.accessToken as string as AccessToken,
        refreshToken: result.refreshToken as string as RefreshToken,
        accessTokenExpiry: result.accessTokenExpiry as number as AccessTokenExpiry,
        refreshTokenExpiry: result.refreshTokenExpiry as number as RefreshTokenExpiry,
    };
    AuthPersistence.saveAuthData(newAccessTokenPrivMxBridgeApiAuthData);
    setAuthData({
        privMxBridgeApiAuthData: newAccessTokenPrivMxBridgeApiAuthData,
    });
}
