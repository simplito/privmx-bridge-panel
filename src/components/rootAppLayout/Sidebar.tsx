import { AppShell, Box, NavLink, ScrollArea, Stack } from "@mantine/core";
import { useCallback, useState } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import { useAuthData } from "@/hooks/useAuthData";
import { Link } from "@/i18n/routing";
import { Icon } from "../atoms/Icon";
import { colors } from "./mantineTheme";
import { SidebarContexts } from "./SidebarContexts";
import { SidebarSolutions } from "./SidebarSolutions";

export function Sidebar() {
    const t = useTranslations();
    const { authData } = useAuthData();
    const isSignedIn = authData.privMxBridgeApiAuthData !== null;
    const [isContextsListOpen, setIsContextsListOpen] = useState(false);
    const [isSolutionsListOpen, setIsSolutionsListOpen] = useState(false);

    const handleToggleContextsListClick = useCallback(() => {
        setIsContextsListOpen((prev) => !prev);
    }, []);
    const handleToggleSolutionsListClick = useCallback(() => {
        setIsSolutionsListOpen((prev) => !prev);
    }, []);

    return (
        <AppShell.Navbar withBorder={false} bg={colors["document/backgrounds/body"]}>
            <AppShell.Section grow my="md" component={ScrollArea}>
                <NavLink label={t("mainNav.home")} leftSection={<Icon name="home" size={"md"} />} href={appRoutes.home()} component={Link} />
                {isSignedIn ? (
                    <NavLink
                        label={t("mainNav.solutions")}
                        leftSection={<Icon name="solutions" size={"md"} />}
                        rightSection={
                            <div onClick={handleToggleSolutionsListClick}>
                                <Icon name={isSolutionsListOpen ? "chevronDown" : "chevronRight"} size={"sm"} />
                            </div>
                        }
                        href={appRoutes.solutions.list()}
                        component={Link}
                    />
                ) : null}
                {isSignedIn && isSolutionsListOpen ? <SidebarSolutions /> : null}
                {isSignedIn ? (
                    <NavLink
                        label={t("mainNav.contexts")}
                        leftSection={<Icon name="contexts" size={"md"} />}
                        rightSection={
                            <div onClick={handleToggleContextsListClick}>
                                <Icon name={isContextsListOpen ? "chevronDown" : "chevronRight"} size={"sm"} />
                            </div>
                        }
                        href={appRoutes.contexts.list()}
                        component={Link}
                    />
                ) : null}
                {isSignedIn && isContextsListOpen ? <SidebarContexts /> : null}
                {isSignedIn ? (
                    <NavLink label={t("mainNav.users")} leftSection={<Icon name="users" size={"md"} />} href={appRoutes.users.list()} component={Link} />
                ) : null}
                {isSignedIn ? (
                    <NavLink
                        label={t("mainNav.managementApiKeys")}
                        leftSection={<Icon name="apiKeys" size={"md"} />}
                        href={appRoutes.management.apiKeys.list()}
                        component={Link}
                    />
                ) : null}
                <Box mt="md" style={{ borderBottom: `1px solid ${colors["document/backgrounds/grid"]}` }} />
            </AppShell.Section>
            <AppShell.Section>
                <Stack
                    gap="md"
                    align="stretch"
                    pb="sm"
                    pt="sm"
                    mb="xl"
                    style={{ borderBottom: `1px solid ${colors["document/backgrounds/grid"]}`, borderTop: `1px solid ${colors["document/backgrounds/grid"]}` }}
                >
                    {isSignedIn ? (
                        <NavLink
                            label={t("forms.buttons.signOut")}
                            rightSection={
                                <span style={{ color: colors["document/typography/text"] }}>
                                    <Icon name="signOut" size={"md"} />
                                </span>
                            }
                            href={appRoutes.auth.signOut()}
                            pl="md"
                            component={Link}
                        />
                    ) : (
                        <NavLink
                            label={t("forms.buttons.signIn")}
                            rightSection={
                                <span style={{ color: colors["document/typography/text"] }}>
                                    <Icon name="signIn" size={"md"} />
                                </span>
                            }
                            href={appRoutes.auth.signIn()}
                            pl="md"
                            component={Link}
                        />
                    )}
                </Stack>
            </AppShell.Section>
        </AppShell.Navbar>
    );
}
