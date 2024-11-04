import { Center } from "@mantine/core";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import type { BreadcrumbItem } from "@/components/atoms/Breadcrumbs";
import { LoadingOrError } from "@/components/atoms/LoadingOrError";
import { PageWrapper } from "@/components/atoms/PageWrapper";
import { useDataLoader } from "@/hooks/useDataLoader";
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
    const t = useTranslations("features.management.apiKeys");
    const tRoot = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [
            { label: tRoot("features.home.title"), href: appRoutes.home() },
            { label: t("list.title"), href: appRoutes.management.apiKeys.list() },
            { label: t("profile.title", { name: props.apiKey.name }), href: appRoutes.management.apiKeys.$apiKey(props.apiKey.id).profile() },
        ];
    }, [t, tRoot, props.apiKey]);

    return (
        <PageWrapper title={t("profile.title", { name: props.apiKey.name })} breadcrumbs={breadcrumbs} size="lg">
            <ApiKeyProfileCore apiKey={props.apiKey} />
        </PageWrapper>
    );
}
