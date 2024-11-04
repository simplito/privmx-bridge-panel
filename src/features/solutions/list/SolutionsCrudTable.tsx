import { Box } from "@mantine/core";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useRef } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import { CrudTable, type CrudTableFilter, type CrudTableHeader } from "@/components/crudTable/CrudTable";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useSolutionApi } from "@/hooks/useSolutionApi";
import { useRouter } from "@/i18n/routing";
import { useOpenCreateSolutionModal } from "../create/openCreateSolutionModal";
import { useOpenDeleteSolutionModal } from "../delete/openDeleteSolutionModal";
import { useOpenEditSolutionModal } from "../edit/openEditSolutionModal";
import { SolutionRow, untranslatedTableHeaders } from "./SolutionRow";

const entryIdProvider = (entry: ServerApiTypes.api.solution.Solution) => entry.id;

export interface SolutionsCrudTableProps {
    withTopCreateButton?: boolean | undefined;
    withBottomCreateButton?: boolean | undefined;
}

export function SolutionsCrudTable(props: SolutionsCrudTableProps) {
    const t = useTranslations("features.solutions");
    const router = useRouter();
    const refreshRef = useRef<() => Promise<ServerApiTypes.api.solution.Solution[]>>();
    const refresh = useCallback(() => {
        void refreshRef.current?.();
    }, []);
    usePrivMxBridgeApiEventListener("solutionsChanged", refresh);
    const { openCreateSolutionModal } = useOpenCreateSolutionModal();
    const { openDeleteSolutionModal } = useOpenDeleteSolutionModal();
    const { openEditSolutionModal } = useOpenEditSolutionModal();

    const solutionApi = useSolutionApi();
    const dataProvider = useCallback(
        async (pageId: number, entriesPerPage: number, filters: CrudTableFilter[]) => {
            const globalStringFilter = filters.find((x) => x.type === "globalString");
            const queryString = globalStringFilter?.value;

            const res = await solutionApi.listSolutions();
            let list = res.list;
            if (queryString !== undefined) {
                const queryStringLower = queryString.toLowerCase();
                list = list.filter((entry) => entry.name.toLowerCase().includes(queryStringLower));
            }

            list = list.slice(pageId * entriesPerPage, (pageId + 1) * entriesPerPage);

            return { entries: list, totalEntries: res.list.length };
        },
        [solutionApi],
    );

    const handleViewSolution = useCallback(
        (entry: ServerApiTypes.api.solution.Solution) => {
            router.push(appRoutes.solutions.$solution(entry.id).profile());
        },
        [router],
    );

    const tableHeaders: CrudTableHeader[] = untranslatedTableHeaders.map((tableHeader) => ({
        ...tableHeader,
        label: t(`tableHeaders.${tableHeader.id}`),
    }));

    return (
        <Box>
            <CrudTable
                createButtonIcon="add"
                createButtonText={t("createSolutionButton.label")}
                createEntry={openCreateSolutionModal}
                withBottomCreateButton={props.withBottomCreateButton}
                withTopCreateButton={props.withTopCreateButton}
                dataProvider={dataProvider}
                deleteEntry={openDeleteSolutionModal}
                editEntry={openEditSolutionModal}
                entryIdProvider={entryIdProvider}
                headers={tableHeaders}
                refreshRef={refreshRef}
                rowComponent={SolutionRow}
                viewEntryDetails={handleViewSolution}
                withPagination
                onRowClick={handleViewSolution}
                withGlobalStringFilter
                actionsColumnWidth={100}
            />
        </Box>
    );
}
