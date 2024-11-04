import { Center } from "@mantine/core";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import type { BreadcrumbItem } from "@/components/atoms/Breadcrumbs";
import { LoadingOrError } from "@/components/atoms/LoadingOrError";
import { PageWrapper } from "@/components/atoms/PageWrapper";
import { useContextApi } from "@/hooks/useContextApi";
import { useDataLoader } from "@/hooks/useDataLoader";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useSolutionApi } from "@/hooks/useSolutionApi";
import type { ContextDeletedEvent, ContextUpdatedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { ContextUsersCrudTable } from "./ContextUsersCrudTable";

export interface ContextUsersListPageProps {
    solutionId: ServerApiTypes.types.cloud.SolutionId;
    contextId: ServerApiTypes.types.context.ContextId;
}

interface PageData {
    solution: ServerApiTypes.api.solution.Solution;
    context: ServerApiTypes.api.context.Context;
}

export function ContextUsersListPage(props: ContextUsersListPageProps) {
    const contextApi = useContextApi();
    const solutionApi = useSolutionApi();
    const [pageData, setPageData] = useState<PageData | null>(null);
    const pageDataLoader = useCallback(async () => {
        const solution = await solutionApi.getSolution({ id: props.solutionId });
        const context = await contextApi.getContext({ contextId: props.contextId });
        return { solution: solution.solution, context: context.context };
    }, [solutionApi, props.solutionId, props.contextId, contextApi]);
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
    usePrivMxBridgeApiEventListener("solutionsChanged", reloadPageData);

    if (Boolean(pageDataLoadingError) || isLoadingPageData || pageData === null) {
        return (
            <Center mt={100}>
                <LoadingOrError error={pageDataLoadingError} isLoading={isLoadingPageData} loaderSize="lg" />
            </Center>
        );
    }

    return <ContextUsersListPageCore solution={pageData.solution} context={pageData.context} />;
}

export interface ContextUsersListPageCoreProps {
    solution: ServerApiTypes.api.solution.Solution;
    context: ServerApiTypes.api.context.Context;
}

export function ContextUsersListPageCore(props: ContextUsersListPageCoreProps) {
    const t = useTranslations("features.contextUsers");
    const tRoot = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [
            { label: tRoot("features.home.title"), href: appRoutes.home() },
            { label: tRoot("features.solutions.list.title"), href: appRoutes.solutions.list() },
            {
                label: tRoot("features.solutions.profile.title", { name: props.solution.name }),
                href: appRoutes.solutions.$solution(props.solution.id).profile(),
            },
            { label: tRoot("features.contexts.list.title"), href: appRoutes.solutions.$solution(props.solution.id).contexts.list() },
            {
                label: tRoot("features.contexts.profile.title", { name: props.context.name }),
                href: appRoutes.solutions.$solution(props.solution.id).contexts.$context(props.context.id).profile(),
            },
            { label: t("list.title"), href: appRoutes.solutions.$solution(props.solution.id).contexts.$context(props.context.id).users.list() },
        ];
    }, [props.context.id, props.context.name, props.solution.id, props.solution.name, t, tRoot]);

    return (
        <PageWrapper title={t("list.title")} breadcrumbs={breadcrumbs}>
            <ContextUsersCrudTable context={props.context} solution={props.solution} />
        </PageWrapper>
    );
}
