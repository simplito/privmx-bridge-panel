import { createContext, useMemo, useState } from "react";
import type { PrivMxBridgeApiAuthData } from "@/privMxBridgeApi/types";
import { Env } from "@/utils/Env";

export interface AuthData {
    privMxBridgeApiAuthData: PrivMxBridgeApiAuthData | null;
}

export const defaultAuthData: AuthData = Env.devAutoSignInAuthData ?? {
    privMxBridgeApiAuthData: null,
};

export interface AuthDataContextValue {
    authData: AuthData;
    setAuthData: (authData: AuthData | ((prev: AuthData) => AuthData)) => void;
}

export const AuthDataContext = createContext<AuthDataContextValue>({
    authData: defaultAuthData,
    setAuthData: () => {},
});

interface AuthDataContextProviderProps extends React.PropsWithChildren {
    defaultAuthData?: AuthData;
}

export function AuthDataContextProvider(props: AuthDataContextProviderProps) {
    const [authData, setAuthData] = useState<AuthData>(props.defaultAuthData ?? defaultAuthData);

    const value = useMemo(() => ({ authData, setAuthData }), [authData, setAuthData]);

    return <AuthDataContext.Provider value={value}>{props.children}</AuthDataContext.Provider>;
}
