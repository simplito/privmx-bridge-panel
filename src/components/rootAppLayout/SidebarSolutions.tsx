import { AppSidebarLink, LoadingOrError } from "privmx-components/components/index";
import { useDataLoader } from "privmx-components/hooks/useDataLoader";
import { useI18n } from "privmx-components/i18n/useI18n";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useState } from "react";
import { appRoutes } from "@/app/appRoutes";
import { useOpenCreateSolutionModal } from "@/features/solutions/create/openCreateSolutionModal";
import { useAuthData } from "@/hooks/useAuthData";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useSolutionApi } from "@/hooks/useSolutionApi";
import type { SolutionApi } from "@/privMxBridgeApi/SolutionApi";
import { Icon } from "../atoms/Icon";

async function loadSolutions(solutionApi: SolutionApi): Promise<ServerApiTypes.api.solution.Solution[]> {
    const res = await solutionApi.listSolutions();
    return res.list.sort((a, b) => b.created - a.created);
}

const defaultSolutionsCount = 3;

export function SidebarSolutions() {
    const { t } = useI18n();
    const { openCreateSolutionModal } = useOpenCreateSolutionModal();
    const { authData } = useAuthData();
    const isSignedIn = authData.privMxBridgeApiAuthData !== null;
    const solutionApi = useSolutionApi();
    const [shouldShowAllSolutions, setShouldShowAllSolutions] = useState(false);
    const [solutions, setSolutions] = useState<ServerApiTypes.api.solution.Solution[]>([]);
    const solutionsLoader = useCallback(async () => {
        if (!isSignedIn) {
            return [];
        }
        return await loadSolutions(solutionApi);
    }, [solutionApi, isSignedIn]);
    const { isLoading: isLoadingSolutions, error: solutionsLoadingError, reload: reloadSolutions } = useDataLoader(solutionsLoader, setSolutions);
    usePrivMxBridgeApiEventListener("solutionsChanged", reloadSolutions);
    const shouldShowMoreSolutionsButton = solutions.length > defaultSolutionsCount && !shouldShowAllSolutions;
    const handleToggleSolutionsListClick = useCallback(() => {
        setShouldShowAllSolutions((prev) => !prev);
    }, []);
    const handleCreateSolutionClick = useCallback(() => {
        void openCreateSolutionModal();
    }, [openCreateSolutionModal]);

    if (!isSignedIn) {
        return null;
    }
    if (isLoadingSolutions || solutionsLoadingError !== null) {
        return <LoadingOrError error={solutionsLoadingError} isLoading={isLoadingSolutions} loaderSize="sm" />;
    }

    return (
        <>
            {solutions.map((solution, idx) => {
                if (!shouldShowAllSolutions && idx >= defaultSolutionsCount) {
                    return null;
                }
                return (
                    <AppSidebarLink
                        key={solution.id}
                        leftSection={<Icon name="solution" size={"md"} />}
                        href={appRoutes.solutions.$solution(solution.id).profile()}
                        style={{ paddingLeft: "30px" }}
                    >
                        {solution.name}
                    </AppSidebarLink>
                );
            })}
            {shouldShowMoreSolutionsButton ? (
                <AppSidebarLink leftSection={<Icon name="more" size={"md"} />} onClick={handleToggleSolutionsListClick} style={{ paddingLeft: "30px" }}>
                    {t("mainNav.navActions.expand")}
                </AppSidebarLink>
            ) : null}
            <AppSidebarLink leftSection={<Icon name="add" size={"md"} />} onClick={handleCreateSolutionClick} style={{ paddingLeft: "30px" }}>
                {t("mainNav.navActions.createNewSolution")}
            </AppSidebarLink>
        </>
    );
}
