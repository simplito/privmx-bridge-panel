import { useEffect, useRef } from "react";
import { AuthPersistence } from "@/features/auth/AuthPersistence";
import { useAuthData } from "@/hooks/useAuthData";
import type { AccessToken, AccessTokenExpiry, AccessTokenPrivMxBridgeApiAuthData, RefreshToken, RefreshTokenExpiry } from "@/privMxBridgeApi/types";

export function SessionFromUrlEstablisher() {
    const { setAuthData } = useAuthData();
    const wasProcessedRef = useRef(false);

    useEffect(() => {
        if (wasProcessedRef.current) {
            return;
        }
        wasProcessedRef.current = true;
        const urlHash = window.location.hash;
        if (urlHash === "") {
            return;
        }
        const urlSearchParams = new URLSearchParams(urlHash.slice(1));
        const at = urlSearchParams.get("at");
        const rt = urlSearchParams.get("rt");
        const ate = urlSearchParams.get("ate");
        const rte = urlSearchParams.get("rte");
        if (at === null || rt === null || ate === null || rte === null) {
            return;
        }
        const ateNum = parseInt(ate, 10);
        const rteNum = parseInt(rte, 10);
        if (Number.isNaN(ateNum) || Number.isNaN(rteNum)) {
            return;
        }
        const urlSessionData: UrlSessionData = {
            at: at as AccessToken,
            rt: rt as RefreshToken,
            ate: ateNum as AccessTokenExpiry,
            rte: rteNum as RefreshTokenExpiry,
        };

        const accessTokenPrivMxBridgeApiAuthData: AccessTokenPrivMxBridgeApiAuthData = {
            type: "accessToken",
            accessToken: urlSessionData.at,
            refreshToken: urlSessionData.rt,
            accessTokenExpiry: urlSessionData.ate,
            refreshTokenExpiry: urlSessionData.rte,
        };

        setAuthData({
            privMxBridgeApiAuthData: accessTokenPrivMxBridgeApiAuthData,
        });
        AuthPersistence.saveAuthData(accessTokenPrivMxBridgeApiAuthData);
        window.history.replaceState(null, "", window.location.pathname);
    }, [setAuthData]);

    return <></>;
}

interface UrlSessionData {
    at: AccessToken;
    rt: RefreshToken;
    ate: AccessTokenExpiry;
    rte: RefreshTokenExpiry;
}
