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
import { SolutionProfileCore } from "./SolutionProfile";

export interface SolutionProfilePageProps {
    solutionId: ServerApiTypes.types.cloud.SolutionId;
}

interface PageData {
    solution: ServerApiTypes.api.solution.Solution;
}

export function SolutionProfilePage(props: SolutionProfilePageProps) {
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

    return <SolutionProfilePageCore solution={pageData.solution} />;
}

export interface SolutionProfilePageCoreProps {
    solution: ServerApiTypes.api.solution.Solution;
}

export function SolutionProfilePageCore(props: SolutionProfilePageCoreProps) {
    const t = useTranslations("features.solutions");
    const tRoot = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [
            { label: tRoot("features.home.title"), href: appRoutes.home() },
            { label: t("list.title"), href: appRoutes.solutions.list() },
            { label: t("profile.title", { name: props.solution.name }), href: appRoutes.solutions.$solution(props.solution.id).profile() },
        ];
    }, [t, tRoot, props.solution]);

    return (
        <PageWrapper title={t("profile.title", { name: props.solution.name })} breadcrumbs={breadcrumbs} size="lg">
            <SolutionProfileCore solution={props.solution} />
        </PageWrapper>
    );
}
