import type { AuthGuardProps as AuthGuardCoreProps } from "privmx-components/components/index";
import { AuthGuard as AuthGuardCore } from "privmx-components/components/index";
import { useAuthData } from "@/hooks/useAuthData";

export type AuthGuardProps = Omit<AuthGuardCoreProps, "isAuthed">;

export function AuthGuard(props: AuthGuardProps) {
    const { authData } = useAuthData();
    const isAuthed = authData.privMxBridgeApiAuthData !== null;

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <AuthGuardCore {...(props as AuthGuardCoreProps)} isAuthed={isAuthed} />;
}
