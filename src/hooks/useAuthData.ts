import { useContext } from "react";
import { type AuthData, AuthDataContext } from "@/contexts/AuthDataContext";

export interface UseAuthDataReturnValue {
    authData: AuthData;
    setAuthData: (authData: AuthData | ((prev: AuthData) => AuthData)) => void;
}

export function useAuthData(): UseAuthDataReturnValue {
    const { authData, setAuthData } = useContext(AuthDataContext);
    return { authData, setAuthData };
}
