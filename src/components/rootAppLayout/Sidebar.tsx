import { AppSidebar, AppSidebarBottom, AppSidebarLink, AppSidebarMain } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { useCallback, useState } from "react";
import { appRoutes } from "@/app/appRoutes";
import { useAuthData } from "@/hooks/useAuthData";
import { Icon } from "../atoms/Icon";
import { SidebarContexts } from "./SidebarContexts";
import { SidebarSolutions } from "./SidebarSolutions";

export function Sidebar() {
    const { t } = useI18n();
    const { authData } = useAuthData();
    const isSignedIn = authData.privMxBridgeApiAuthData !== null;
    const [isContextsListOpen, setIsContextsListOpen] = useState(false);
    const [isSolutionsListOpen, setIsSolutionsListOpen] = useState(false);

    const handleToggleContextsListClick = useCallback((event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setIsContextsListOpen((prev) => !prev);
    }, []);
    const handleToggleSolutionsListClick = useCallback((event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setIsSolutionsListOpen((prev) => !prev);
    }, []);

    return (
        <AppSidebar>
            <AppSidebarMain>
                <AppSidebarLink leftSection={<Icon name="home" size="lg" />} href={appRoutes.home()}>
                    {t("mainNav.home")}
                </AppSidebarLink>
                {isSignedIn ? (
                    <AppSidebarLink
                        leftSection={<Icon name="solutions" size="lg" />}
                        rightSection={
                            <div onClick={handleToggleSolutionsListClick}>
                                <Icon name={isSolutionsListOpen ? "chevronDown" : "chevronRight"} size={"sm"} />
                            </div>
                        }
                        href={appRoutes.solutions.list()}
                    >
                        {t("mainNav.solutions")}
                    </AppSidebarLink>
                ) : null}
                {isSignedIn && isSolutionsListOpen ? <SidebarSolutions /> : null}
                {isSignedIn ? (
                    <AppSidebarLink
                        leftSection={<Icon name="contexts" size="lg" />}
                        rightSection={
                            <div onClick={handleToggleContextsListClick}>
                                <Icon name={isContextsListOpen ? "chevronDown" : "chevronRight"} size={"sm"} />
                            </div>
                        }
                        href={appRoutes.contexts.list()}
                    >
                        {t("mainNav.contexts")}
                    </AppSidebarLink>
                ) : null}
                {isSignedIn && isContextsListOpen ? <SidebarContexts /> : null}
                {/* {isSignedIn ? (
                    <AppSidebarLink leftSection={<Icon name="users" size="lg" />} href={appRoutes.users.list()}>{t("mainNav.users")}</AppSidebarLink>
                ) : null} */}
                {isSignedIn ? (
                    <AppSidebarLink leftSection={<Icon name="apiKeys" size="lg" />} href={appRoutes.access.list()}>
                        {t("mainNav.apiKeys")}
                    </AppSidebarLink>
                ) : null}
            </AppSidebarMain>
            <AppSidebarBottom>
                {isSignedIn ? (
                    <AppSidebarLink rightSection={<Icon name="logout" size="lg" />} rightSectionColor="inherit" href={appRoutes.auth.logout()}>
                        {t("forms.buttons.logout")}
                    </AppSidebarLink>
                ) : (
                    <AppSidebarLink rightSection={<Icon name="login" size="lg" />} rightSectionColor="inherit" href={appRoutes.auth.login()}>
                        {t("forms.buttons.login")}
                    </AppSidebarLink>
                )}
            </AppSidebarBottom>
        </AppSidebar>
    );
}
