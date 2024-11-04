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
import type { ContextDeletedEvent, ContextUpdatedEvent, SolutionDeletedEvent, SolutionUpdatedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { ContextProfileCore } from "./ContextProfile";

export interface ContextProfilePageProps {
    solutionId: ServerApiTypes.types.cloud.SolutionId;
    contextId: ServerApiTypes.types.context.ContextId;
}

interface PageData {
    context: ServerApiTypes.api.context.Context;
    solution: ServerApiTypes.api.solution.Solution;
}

export function ContextProfilePage(props: ContextProfilePageProps) {
    const contextApi = useContextApi();
    const solutionApi = useSolutionApi();
    const [pageData, setPageData] = useState<PageData | null>(null);
    const pageDataLoader = useCallback(async () => {
        const context = await contextApi.getContext({ contextId: props.contextId });
        const solution = await solutionApi.getSolution({ id: props.solutionId });
        return { context: context.context, solution: solution.solution };
    }, [contextApi, solutionApi, props.contextId, props.solutionId]);
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
    usePrivMxBridgeApiEventListener(
        "solutionDeleted",
        useCallback(
            (event: SolutionDeletedEvent) => {
                if (event.solutionId === props.solutionId) {
                    void reloadPageData();
                }
            },
            [props.solutionId, reloadPageData],
        ),
    );
    usePrivMxBridgeApiEventListener(
        "solutionUpdated",
        useCallback(
            (event: SolutionUpdatedEvent) => {
                if (event.solutionId === props.solutionId) {
                    void reloadPageData();
                }
            },
            [props.solutionId, reloadPageData],
        ),
    );

    if (Boolean(pageDataLoadingError) || isLoadingPageData || pageData === null) {
        return (
            <Center mt={100}>
                <LoadingOrError error={pageDataLoadingError} isLoading={isLoadingPageData} loaderSize="lg" />
            </Center>
        );
    }

    return <ContextProfilePageCore context={pageData.context} solution={pageData.solution} />;
}

export interface ContextProfilePageCoreProps {
    context: ServerApiTypes.api.context.Context;
    solution: ServerApiTypes.api.solution.Solution;
}

export function ContextProfilePageCore(props: ContextProfilePageCoreProps) {
    const t = useTranslations("features.contexts");
    const tRoot = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [
            { label: tRoot("features.home.title"), href: appRoutes.home() },
            { label: tRoot("features.solutions.list.title"), href: appRoutes.solutions.list() },
            {
                label: tRoot("features.solutions.profile.title", { name: props.solution.name }),
                href: appRoutes.solutions.$solution(props.solution.id).profile(),
            },
            { label: t("list.title"), href: appRoutes.solutions.$solution(props.solution.id).contexts.list() },
            {
                label: t("profile.title", { name: props.context.name }),
                href: appRoutes.solutions.$solution(props.solution.id).contexts.$context(props.context.id).profile(),
            },
        ];
    }, [tRoot, props.solution.id, props.solution.name, props.context.name, props.context.id, t]);

    return (
        <PageWrapper title={t("profile.title", { name: props.context.name })} breadcrumbs={breadcrumbs} size="lg">
            <ContextProfileCore context={props.context} solution={props.solution} />
        </PageWrapper>
    );
}
