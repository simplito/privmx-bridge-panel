import { Center } from "@mantine/core";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import type { BreadcrumbItem } from "@/components/atoms/Breadcrumbs";
import { LoadingOrError } from "@/components/atoms/LoadingOrError";
import { PageWrapper } from "@/components/atoms/PageWrapper";
import { useDataLoader } from "@/hooks/useDataLoader";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useSolutionApi } from "@/hooks/useSolutionApi";
import type { SolutionDeletedEvent, SolutionUpdatedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { ContextsCrudTable } from "./ContextsCrudTable";

export interface ContextsListPageProps {
    solutionId: ServerApiTypes.types.cloud.SolutionId;
}

interface PageData {
    solution: ServerApiTypes.api.solution.Solution;
}

export function ContextsListPage(props: ContextsListPageProps) {
    const solutionApi = useSolutionApi();
    const [pageData, setPageData] = useState<PageData | null>(null);
    const pageDataLoader = useCallback(async () => {
        const solution = await solutionApi.getSolution({ id: props.solutionId });
        return { solution: solution.solution };
    }, [solutionApi, props.solutionId]);
    const { isLoading: isLoadingPageData, error: pageDataLoadingError, reload: reloadPageData } = useDataLoader(pageDataLoader, setPageData);
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

    return <ContextsListPageCore solution={pageData.solution} />;
}

export interface ContextsListPageCoreProps {
    solution: ServerApiTypes.api.solution.Solution;
}

export function ContextsListPageCore(props: ContextsListPageCoreProps) {
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
        ];
    }, [props.solution.id, props.solution.name, t, tRoot]);

    return (
        <PageWrapper title={t("list.title")} breadcrumbs={breadcrumbs}>
            <ContextsCrudTable solutionId={props.solution.id} />
        </PageWrapper>
    );
}
