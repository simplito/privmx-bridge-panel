import { type BreadcrumbItem, Center, LoadingOrError } from "privmx-components/components/index";
import { useDataLoader } from "privmx-components/hooks/useDataLoader";
import { useI18n } from "privmx-components/i18n/useI18n";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useMemo, useState } from "react";
import { appRoutes } from "@/app/appRoutes";
import { PageWrapper } from "@/components/atoms/PageWrapper";
import { useManagerApi } from "@/hooks/useManagerApi";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import type { ApiKeyDeletedEvent, ApiKeyUpdatedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { ApiKeyProfileCore } from "./ApiKeyProfile";

export interface ApiKeyProfilePageProps {
    apiKeyId: ServerApiTypes.types.auth.ApiKeyId;
}

interface PageData {
    apiKey: ServerApiTypes.api.manager.ApiKey;
}

export function ApiKeyProfilePage(props: ApiKeyProfilePageProps) {
    const managerApi = useManagerApi();
    const [pageData, setPageData] = useState<PageData | null>(null);
    const pageDataLoader = useCallback(async () => {
        const apiKey = await managerApi.getApiKey({ id: props.apiKeyId });
        return { apiKey: apiKey.apiKey };
    }, [managerApi, props.apiKeyId]);
    const { isLoading: isLoadingPageData, error: pageDataLoadingError, reload: reloadPageData } = useDataLoader(pageDataLoader, setPageData);
    usePrivMxBridgeApiEventListener(
        "apiKeyDeleted",
        useCallback(
            (event: ApiKeyDeletedEvent) => {
                if (event.apiKeyId === props.apiKeyId) {
                    void reloadPageData();
                }
            },
            [props.apiKeyId, reloadPageData],
        ),
    );
    usePrivMxBridgeApiEventListener(
        "apiKeyUpdated",
        useCallback(
            (event: ApiKeyUpdatedEvent) => {
                if (event.apiKeyId === props.apiKeyId) {
                    void reloadPageData();
                }
            },
            [props.apiKeyId, reloadPageData],
        ),
    );

    if (Boolean(pageDataLoadingError) || isLoadingPageData || pageData === null) {
        return (
            <Center mt={100}>
                <LoadingOrError error={pageDataLoadingError} isLoading={isLoadingPageData} loaderSize="lg" />
            </Center>
        );
    }

    return <ApiKeyProfilePageCore apiKey={pageData.apiKey} />;
}

export interface ApiKeyProfilePageCoreProps {
    apiKey: ServerApiTypes.api.manager.ApiKey;
}

export function ApiKeyProfilePageCore(props: ApiKeyProfilePageCoreProps) {
    const { t } = useI18n("features.apiKeys");
    const { t: tRoot } = useI18n();
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [
            { label: tRoot("features.home.breadcrumb"), href: appRoutes.home() },
            { label: t("list.title"), href: appRoutes.access.list() },
            { label: t("profile.title", { name: props.apiKey.name }), href: appRoutes.access.$apiKey(props.apiKey.id).profile() },
        ];
    }, [t, tRoot, props.apiKey]);

    return (
        <PageWrapper title={t("profile.title", { name: props.apiKey.name })} breadcrumbs={breadcrumbs} size="lg">
            <ApiKeyProfileCore apiKey={props.apiKey} />
        </PageWrapper>
    );
}
