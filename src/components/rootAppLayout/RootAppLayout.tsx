import { AppHeader, AppLayout, AppMain } from "privmx-components/components/index";
import { AppWrapper, TitleSetter } from "privmx-components/components/index";
import type { AppConfig } from "privmx-components/contexts/AppConfigContext";
import { i18nConfig } from "privmx-components/i18n/i18nConfig";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Link, type LinkProps, Navigate } from "react-router-dom";
import { appRoutes } from "@/app/appRoutes";
import { AuthDataContextProvider } from "@/contexts/AuthDataContext";
import { AuthPersistence } from "@/features/auth/AuthPersistence";
import { loadAllI18nMessages } from "@/i18n/loadAllI18nMessages";
import { AppLogo } from "../appLogo/AppLogo";
import { SessionFromUrlEstablisher } from "../utils/SessionFromUrlEstablisher";
import { SessionKeepAlive } from "../utils/SessionKeepAlive";
import { Sidebar } from "./Sidebar";
import "./global.scss";

export interface RootAppLayoutProps extends React.PropsWithChildren {}

const appConfig: AppConfig = {
    homePagePath: appRoutes.home(),
    loginFormPath: appRoutes.auth.login(),
    linkComponent: LinkProxy,
    loginFormComponent: LoginForm,
    redirectComponent: RedirectComponent,
};

interface LinkProxyProps extends Omit<LinkProps, "to"> {
    href?: string | undefined;
}
function LinkProxy(props: LinkProxyProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const { href, ...rest } = props;

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Link to={href ?? ""} {...rest} />;
}

function LoginForm() {
    return <LoginForm />;
}

function RedirectComponent(props: { to?: string | undefined }) {
    return <Navigate to={props.to ?? appConfig.homePagePath ?? appRoutes.home()} replace />;
}

// Use the default locale for now - this will be updated when a 2nd locale is added
const initialLocale = i18nConfig.defaultLocale;
const allI18nMessages = loadAllI18nMessages(initialLocale);

export function RootAppLayout(props: RootAppLayoutProps) {
    const storedAuthData = AuthPersistence.readAuthData();
    const defaultAuthData = storedAuthData && storedAuthData.accessTokenExpiry > Date.now() + 5000 ? { privMxBridgeApiAuthData: storedAuthData } : undefined;

    return (
        <AppWrapper initialAppConfig={appConfig} initialMessages={allI18nMessages} initialLocale={initialLocale}>
            <AuthDataContextProvider defaultAuthData={defaultAuthData}>
                <RootAppLayoutCore>{props.children}</RootAppLayoutCore>
            </AuthDataContextProvider>
        </AppWrapper>
    );
}

interface RootAppLayoutCoreProps extends React.PropsWithChildren {}

function RootAppLayoutCore(props: RootAppLayoutCoreProps) {
    const { t } = useI18n();

    return (
        <>
            <TitleSetter title={t("appTitle")} />
            <SessionFromUrlEstablisher />
            <SessionKeepAlive />
            <AppLayout>
                <AppHeader>
                    <div style={{ padding: "0 var(--privmx-spacing-md)", height: "100%", display: "flex", alignItems: "center" }}>
                        <AppLogo href={appRoutes.home()} />
                    </div>
                </AppHeader>
                <Sidebar />
                <AppMain>{props.children}</AppMain>
            </AppLayout>
        </>
    );
}
