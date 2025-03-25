import { NavLink } from "@mantine/core";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useState } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import { useOpenCreateContextModal } from "@/features/contexts/create/openCreateContextModal";
import { useAuthData } from "@/hooks/useAuthData";
import { useContextApi } from "@/hooks/useContextApi";
import { useDataLoader } from "@/hooks/useDataLoader";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { Link } from "@/i18n/routing";
import { ApiUtils } from "@/privMxBridgeApi/ApiUtils";
import type { ContextApi } from "@/privMxBridgeApi/ContextApi";
import { Icon } from "../atoms/Icon";
import { LoadingOrError } from "../atoms/LoadingOrError";

async function loadContexts(contextApi: ContextApi): Promise<ServerApiTypes.api.context.Context[]> {
    const pageSize = 100;
    const contexts = await ApiUtils.loadAllPages(pageSize, async (pageId) => {
        const res = await contextApi.listContexts({
            limit: pageSize,
            skip: pageId * pageSize,
            sortOrder: "desc",
        });
        return { totalCount: res.count, pageItems: res.list };
    });
    return contexts.sort((a, b) => b.created - a.created);
}

const defaultContextsCount = 3;

export function SidebarContexts() {
    const t = useTranslations();
    const { openCreateContextModal } = useOpenCreateContextModal();
    const { authData } = useAuthData();
    const isSignedIn = authData.privMxBridgeApiAuthData !== null;
    const contextApi = useContextApi();
    const [shouldShowAllContexts, setShouldShowAllContexts] = useState(false);
    const [contexts, setContexts] = useState<ServerApiTypes.api.context.Context[]>([]);
    const contextsLoader = useCallback(async () => {
        if (!isSignedIn) {
            return [];
        }
        return await loadContexts(contextApi);
    }, [contextApi, isSignedIn]);
    const { isLoading: isLoadingContexts, error: contextsLoadingError, reload: reloadContexts } = useDataLoader(contextsLoader, setContexts);
    usePrivMxBridgeApiEventListener("contextsChanged", reloadContexts);
    const shouldShowMoreContextsButton = contexts.length > defaultContextsCount && !shouldShowAllContexts;
    const handleToggleContextsListClick = useCallback(() => {
        setShouldShowAllContexts((prev) => !prev);
    }, []);
    const handleCreateContextClick = useCallback(() => {
        void openCreateContextModal(null);
    }, [openCreateContextModal]);

    if (!isSignedIn) {
        return null;
    }
    if (isLoadingContexts || contextsLoadingError !== null) {
        return <LoadingOrError error={contextsLoadingError} isLoading={isLoadingContexts} loaderSize="sm" />;
    }

    return (
        <>
            {contexts.map((context, idx) => {
                if (!shouldShowAllContexts && idx >= defaultContextsCount) {
                    return null;
                }
                return (
                    <NavLink
                        key={context.id}
                        label={context.name}
                        leftSection={<Icon name="context" size={"md"} />}
                        href={appRoutes.solutions.$solution(context.solution).contexts.$context(context.id).profile()}
                        component={Link}
                        style={{ paddingLeft: "30px" }}
                    />
                );
            })}
            {shouldShowMoreContextsButton ? (
                <NavLink
                    label={t("mainNav.navActions.expand")}
                    leftSection={<Icon name="more" size={"md"} />}
                    onClick={handleToggleContextsListClick}
                    style={{ paddingLeft: "30px" }}
                />
            ) : null}
            <NavLink
                label={t("mainNav.navActions.createNewContext")}
                leftSection={<Icon name="add" size={"md"} />}
                onClick={handleCreateContextClick}
                style={{ paddingLeft: "30px" }}
            />
        </>
    );
}
