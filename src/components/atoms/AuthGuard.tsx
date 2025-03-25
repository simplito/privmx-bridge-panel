import { appRoutes } from "@/app/appRoutes";
import { LoginForm } from "@/features/auth/login/LoginForm";
import { useAuthData } from "@/hooks/useAuthData";
import { Redirect } from "@/i18n/routing";

interface BaseAuthGuardProps extends React.PropsWithChildren {
    /**
     * The type of authentication required.
     * - "requireAuthed" - The user must be authenticated.
     * - "requireUnauthed" - The user must not be authenticated.
     *
     * Defaults to "requireAuthed".
     */
    type?: "requireAuthed" | "requireUnauthed" | undefined;
}

export interface RequireAuthedAuthGuardProps extends BaseAuthGuardProps {
    type?: "requireAuthed" | undefined;

    /**
     * The behavior to use when the user is not authenticated.
     * - "redirectToLoginPage" - Redirect the user to the sign-in page.
     * - "renderLoginForm" - Render the sign-in form.
     * - "renderNothing" - Render nothing.
     *
     * Defaults to "renderNothing".
     */
    behavior?: "renderNothing" | "redirectToHomePage" | "redirectToLoginPage" | "renderLoginForm" | undefined;
}

export interface RequireUnauthedAuthGuardProps extends BaseAuthGuardProps {
    type: "requireUnauthed";

    /**
     * The behavior to use when the user is authenticated.
     * - "redirectToHomePage" - Redirect the user to the home page.
     * - "renderNothing" - Render nothing.
     *
     * Defaults to "renderNothing".
     */
    behavior?: "renderNothing" | "redirectToHomePage" | undefined;
}

export type AuthGuardProps = RequireAuthedAuthGuardProps | RequireUnauthedAuthGuardProps;

export function AuthGuard(props: AuthGuardProps) {
    const { authData } = useAuthData();
    const isAuthed = authData.privMxBridgeApiAuthData !== null;
    if (props.type === "requireAuthed" && !isAuthed) {
        const behavior = props.behavior ?? "renderNothing";
        if (behavior === "renderLoginForm") {
            return <LoginForm />;
        } else if (behavior === "renderNothing") {
            return null;
        }
        if (behavior === "redirectToHomePage") {
            return <Redirect to={appRoutes.home()} />;
        } else {
            return <Redirect to={appRoutes.auth.login()} />;
        }
    }
    if (props.type === "requireUnauthed" && isAuthed) {
        const behavior = props.behavior ?? "renderNothing";
        if (behavior === "redirectToHomePage") {
            return <Redirect to={appRoutes.home()} />;
        } else {
            return null;
        }
    }

    return <>{props.children}</>;
}
