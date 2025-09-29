import { type BreadcrumbItem, Center, LoadingOrError } from "privmx-components/components/index";
import { useDataLoader } from "privmx-components/hooks/useDataLoader";
import { useI18n } from "privmx-components/i18n/useI18n";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useMemo, useState } from "react";
import { appRoutes } from "@/app/appRoutes";
import { PageWrapper } from "@/components/atoms/PageWrapper";
import { useContextApi } from "@/hooks/useContextApi";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import type { ContextDeletedEvent, ContextUpdatedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { ContextUserProfileCore } from "./ContextUserProfile";

export interface ContextUserProfilePageProps {
    contextId: ServerApiTypes.types.context.ContextId;
    contextUserId: ServerApiTypes.types.cloud.UserId;
}

interface PageData {
    context: ServerApiTypes.api.context.Context;
    contextUser: ServerApiTypes.api.context.ContextUser;
}

export function ContextUserProfilePage(props: ContextUserProfilePageProps) {
    const contextApi = useContextApi();
    const [pageData, setPageData] = useState<PageData | null>(null);
    const pageDataLoader = useCallback(async () => {
        const contextUser = await contextApi.getUserFromContext({ contextId: props.contextId, userId: props.contextUserId });
        const context = await contextApi.getContext({ contextId: props.contextId });
        return { contextUser: contextUser.user, context: context.context };
    }, [contextApi, props.contextId, props.contextUserId]);
    const { isLoading: isLoadingPageData, error: pageDataLoadingError, reload: reloadPageData } = useDataLoader(pageDataLoader, setPageData);
    usePrivMxBridgeApiEventListener(
        "contextDeleted",
        useCallback(
            (event: ContextDeletedEvent) => {
                if (event.contextId === props.contextId) {
                    void reloadPageData();
                }
            },
            [props.contextId, reloadPageData],
        ),
    );
    usePrivMxBridgeApiEventListener(
        "contextUpdated",
        useCallback(
            (event: ContextUpdatedEvent) => {
                if (event.contextId === props.contextId) {
                    void reloadPageData();
                }
            },
            [props.contextId, reloadPageData],
        ),
    );

    if (Boolean(pageDataLoadingError) || isLoadingPageData || pageData === null) {
        return (
            <Center mt={100}>
                <LoadingOrError error={pageDataLoadingError} isLoading={isLoadingPageData} loaderSize="lg" />
            </Center>
        );
    }

    return <ContextUserProfilePageCore context={pageData.context} contextUser={pageData.contextUser} />;
}

export interface ContextUserProfilePageCoreProps {
    context: ServerApiTypes.api.context.Context;
    contextUser: ServerApiTypes.api.context.ContextUser;
}

export function ContextUserProfilePageCore(props: ContextUserProfilePageCoreProps) {
    const { t } = useI18n("features.contextUsers");
    const { t: tRoot } = useI18n();
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [
            { label: tRoot("features.home.breadcrumb"), href: appRoutes.home() },
            { label: tRoot("features.contexts.list.title"), href: appRoutes.contexts.list() },
            {
                label: tRoot("features.contexts.profile.title", { name: props.context.name }),
                href: appRoutes.contexts.$context(props.context.id).profile(),
            },
            { label: t("list.title"), href: appRoutes.contexts.$context(props.context.id).users.list() },
            {
                label: t("profile.title", { name: props.context.name }),
                href: appRoutes.contexts.$context(props.context.id).users.$user(props.contextUser.userId).profile(),
            },
        ];
    }, [tRoot, props.context.name, props.context.id, props.contextUser.userId, t]);

    return (
        <PageWrapper title={t("profile.title", { name: props.context.name })} breadcrumbs={breadcrumbs} size="lg">
            <ContextUserProfileCore context={props.context} contextUser={props.contextUser} />
        </PageWrapper>
    );
}
