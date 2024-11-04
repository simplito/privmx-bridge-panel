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
import { ContextShareProfileCore } from "./ContextShareProfile";

export interface ContextShareProfilePageProps {
    solutionId: ServerApiTypes.types.cloud.SolutionId;
    contextId: ServerApiTypes.types.context.ContextId;
    contextShareId: ServerApiTypes.types.cloud.SolutionId;
}

interface PageData {
    solution: ServerApiTypes.api.solution.Solution;
    context: ServerApiTypes.api.context.Context;
    contextShare: ServerApiTypes.api.solution.Solution;
}

export function ContextShareProfilePage(props: ContextShareProfilePageProps) {
    const contextApi = useContextApi();
    const solutionApi = useSolutionApi();
    const [pageData, setPageData] = useState<PageData | null>(null);
    const pageDataLoader = useCallback(async () => {
        const solution = await solutionApi.getSolution({ id: props.solutionId });
        const context = await contextApi.getContext({ contextId: props.contextId });
        const contextShare = await solutionApi.getSolution({ id: props.contextShareId });
        return { solution: solution.solution, context: context.context, contextShare: contextShare.solution };
    }, [solutionApi, props.solutionId, props.contextId, props.contextShareId, contextApi]);
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
                if (event.solutionId === props.solutionId || event.solutionId === props.contextShareId) {
                    void reloadPageData();
                }
            },
            [props.contextShareId, props.solutionId, reloadPageData],
        ),
    );
    usePrivMxBridgeApiEventListener(
        "solutionUpdated",
        useCallback(
            (event: SolutionUpdatedEvent) => {
                if (event.solutionId === props.solutionId || event.solutionId === props.contextShareId) {
                    void reloadPageData();
                }
            },
            [props.contextShareId, props.solutionId, reloadPageData],
        ),
    );

    if (Boolean(pageDataLoadingError) || isLoadingPageData || pageData === null) {
        return (
            <Center mt={100}>
                <LoadingOrError error={pageDataLoadingError} isLoading={isLoadingPageData} loaderSize="lg" />
            </Center>
        );
    }

    return <ContextShareProfilePageCore solution={pageData.solution} context={pageData.context} contextShare={pageData.contextShare} />;
}

export interface ContextShareProfilePageCoreProps {
    solution: ServerApiTypes.api.solution.Solution;
    context: ServerApiTypes.api.context.Context;
    contextShare: ServerApiTypes.api.solution.Solution;
}

export function ContextShareProfilePageCore(props: ContextShareProfilePageCoreProps) {
    const t = useTranslations("features.contextShares");
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
            { label: t("list.title"), href: appRoutes.solutions.$solution(props.solution.id).contexts.$context(props.context.id).shares.list() },
            {
                label: t("profile.title", { name: props.contextShare.name }),
                href: appRoutes.solutions.$solution(props.solution.id).contexts.$context(props.context.id).shares.$share(props.contextShare.id).profile(),
            },
        ];
    }, [tRoot, props.solution.name, props.solution.id, props.context.name, props.context.id, props.contextShare.name, props.contextShare.id, t]);

    return (
        <PageWrapper title={t("profile.title", { name: props.contextShare.name })} breadcrumbs={breadcrumbs} size="lg">
            <ContextShareProfileCore solution={props.solution} context={props.context} contextShare={props.contextShare} />
        </PageWrapper>
    );
}
