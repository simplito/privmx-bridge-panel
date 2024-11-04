import { AppShell, NavLink, ScrollArea, Stack } from "@mantine/core";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import { useAuthData } from "@/hooks/useAuthData";
import { Link } from "@/i18n/routing";
import { Icon } from "../atoms/Icon";
import { Button } from "../button/Button";
import { colors } from "./mantineTheme";

export function Sidebar() {
    const t = useTranslations();
    const { authData } = useAuthData();
    const isSignedIn = authData.privMxBridgeApiAuthData !== null;

    return (
        <AppShell.Navbar withBorder={false} bg={colors["document/backgrounds/body"]}>
            <AppShell.Section grow my="md" component={ScrollArea}>
                <NavLink label={t("mainNav.home")} leftSection={<Icon name="home" size={"md"} />} href={appRoutes.home()} component={Link} />
                {isSignedIn ? (
                    <NavLink
                        label={t("mainNav.solutions")}
                        leftSection={<Icon name="solutions" size={"md"} />}
                        href={appRoutes.solutions.list()}
                        component={Link}
                    />
                ) : null}
                {isSignedIn ? (
                    <NavLink
                        label={t("mainNav.managementApiKeys")}
                        leftSection={<Icon name="apiKeys" size={"md"} />}
                        href={appRoutes.management.apiKeys.list()}
                        component={Link}
                    />
                ) : null}
            </AppShell.Section>
            <AppShell.Section>
                <Stack gap="md" align="stretch" p="md" pb="xl">
                    {isSignedIn ? (
                        <Button type="link" preset="signOut" href={appRoutes.auth.signOut()} />
                    ) : (
                        <Button type="link" preset="signIn" href={appRoutes.auth.signIn()} />
                    )}
                </Stack>
            </AppShell.Section>
        </AppShell.Navbar>
    );
}
