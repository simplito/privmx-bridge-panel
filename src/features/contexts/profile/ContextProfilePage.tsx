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
import { ContextProfileCore } from "./ContextProfile";

export interface ContextProfilePageProps {
    contextId: ServerApiTypes.types.context.ContextId;
}

interface PageData {
    context: ServerApiTypes.api.context.Context;
}

export function ContextProfilePage(props: ContextProfilePageProps) {
    const contextApi = useContextApi();
    const [pageData, setPageData] = useState<PageData | null>(null);
    const pageDataLoader = useCallback(async () => {
        const context = await contextApi.getContext({ contextId: props.contextId });
        return { context: context.context };
    }, [contextApi, props.contextId]);
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

    return <ContextProfilePageCore context={pageData.context} />;
}

export interface ContextProfilePageCoreProps {
    context: ServerApiTypes.api.context.Context;
}

export function ContextProfilePageCore(props: ContextProfilePageCoreProps) {
    const { t } = useI18n("features.contexts");
    const { t: tRoot } = useI18n();
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [
            { label: tRoot("features.home.breadcrumb"), href: appRoutes.home() },
            { label: t("list.title"), href: appRoutes.contexts.list() },
            {
                label: t("profile.title", { name: props.context.name }),
                href: appRoutes.contexts.$context(props.context.id).profile(),
            },
        ];
    }, [tRoot, props.context.name, props.context.id, t]);

    return (
        <PageWrapper title={t("profile.title", { name: props.context.name })} breadcrumbs={breadcrumbs} size="lg">
            <ContextProfileCore context={props.context} />
        </PageWrapper>
    );
}
