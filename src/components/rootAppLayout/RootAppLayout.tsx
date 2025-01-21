import { AppShell, Box, Burger, Group, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { useDisclosure } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { useEffect } from "react";
import { IntlProvider, useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import { AuthDataContextProvider } from "@/contexts/AuthDataContext";
import { AuthPersistence } from "@/features/auth/AuthPersistence";
import { i18nFormats } from "@/i18n/formats/i18nFormats";
import { i18nConfig } from "@/i18n/i18nConfig";
import { loadAllI18nMessages } from "@/i18n/loadAllI18nMessages";
import { AppLogo } from "../appLogo/AppLogo";
import { SessionFromUrlEstablisher } from "../utils/SessionFromUrlEstablisher";
import { SessionKeepAlive } from "../utils/SessionKeepAlive";
import { colors, mantineTheme, themeCssVariablesResolver } from "./mantineTheme";
import { headerHeight, sidebarWidth } from "./rootAppLayoutConsts";
import { Sidebar } from "./Sidebar";
import "./global.scss";

export interface RootAppLayoutProps extends React.PropsWithChildren {}

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function RootAppLayout(props: RootAppLayoutProps) {
    // Use the default locale for now - this will be updated when a 2nd locale is added
    const locale = i18nConfig.defaultLocale;
    const messages = loadAllI18nMessages(locale);

    const [isBurgerNavOpen, { toggle: setIsBurgerNavOpen }] = useDisclosure();

    const storedAuthData = AuthPersistence.readAuthData();
    const defaultAuthData = storedAuthData && storedAuthData.accessTokenExpiry > Date.now() + 5000 ? { privMxBridgeApiAuthData: storedAuthData } : undefined;

    return (
        <IntlProvider messages={messages} locale={locale} formats={i18nFormats} timeZone={timeZone}>
            <TitleSetter />
            <MantineProvider theme={mantineTheme} forceColorScheme="dark" defaultColorScheme="dark" cssVariablesResolver={themeCssVariablesResolver}>
                <Notifications />
                <AuthDataContextProvider defaultAuthData={defaultAuthData}>
                    <SessionFromUrlEstablisher />
                    <SessionKeepAlive />
                    <ModalsProvider>
                        <AppShell
                            header={{ height: headerHeight }}
                            navbar={{ width: sidebarWidth, breakpoint: "sm", collapsed: { mobile: !isBurgerNavOpen } }}
                            padding="md"
                        >
                            <AppShell.Header withBorder={false} bg={colors["document/backgrounds/body"]}>
                                <Group h="100%" px="md" justify="space-between">
                                    <Burger opened={isBurgerNavOpen} onClick={setIsBurgerNavOpen} hiddenFrom="sm" size="sm" />
                                    <AppLogo href={appRoutes.home()} />
                                </Group>
                            </AppShell.Header>
                            <Sidebar />
                            <AppShell.Main display="flex" style={{ flexDirection: "column" }}>
                                <Box py={20}>{props.children}</Box>
                            </AppShell.Main>
                        </AppShell>
                    </ModalsProvider>
                </AuthDataContextProvider>
            </MantineProvider>
        </IntlProvider>
    );
}

function TitleSetter() {
    const t = useTranslations();
    useEffect(() => {
        document.title = t("appTitle");
    }, [t]);

    return null;
}
