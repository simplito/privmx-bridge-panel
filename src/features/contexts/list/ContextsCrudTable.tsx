import { Box } from "@mantine/core";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useRef } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import { CrudTable, type CrudTableHeader } from "@/components/crudTable/CrudTable";
import { useContextApi } from "@/hooks/useContextApi";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useRouter } from "@/i18n/routing";
import { useOpenCreateContextModal } from "../create/openCreateContextModal";
import { useOpenDeleteContextModal } from "../delete/openDeleteContextModal";
import { useOpenEditContextModal } from "../edit/openEditContextModal";
import { ContextRow, untranslatedTableHeaders } from "./ContextRow";

const entryIdProvider = (entry: ServerApiTypes.api.context.Context) => entry.id;

export interface ContextsCrudTableProps {
    solutionId: ServerApiTypes.types.cloud.SolutionId;
    withTopCreateButton?: boolean | undefined;
    withBottomCreateButton?: boolean | undefined;
}

export function ContextsCrudTable(props: ContextsCrudTableProps) {
    const t = useTranslations("features.contexts");
    const router = useRouter();
    const refreshRef = useRef<() => Promise<ServerApiTypes.api.context.Context[]>>();
    const refresh = useCallback(() => {
        void refreshRef.current?.();
    }, []);
    usePrivMxBridgeApiEventListener("contextsChanged", refresh);
    const { openCreateContextModal } = useOpenCreateContextModal();
    const { openDeleteContextModal } = useOpenDeleteContextModal();
    const { openEditContextModal } = useOpenEditContextModal();
    const handleOpenCreateContextModal = useCallback(async () => {
        return await openCreateContextModal(props.solutionId);
    }, [openCreateContextModal, props.solutionId]);

    const contextApi = useContextApi();
    const dataProvider = useCallback(
        async (pageId: number, entriesPerPage: number) => {
            const skip = pageId * entriesPerPage;

            const res = await contextApi.listContextsOfSolution({
                solutionId: props.solutionId,
                limit: entriesPerPage,
                skip: skip,
                sortOrder: "desc",
            });

            return { entries: res.list, totalEntries: res.list.length };
        },
        [contextApi, props.solutionId],
    );

    const handleViewContext = useCallback(
        (entry: ServerApiTypes.api.context.Context) => {
            router.push(appRoutes.solutions.$solution(props.solutionId).contexts.$context(entry.id).profile());
        },
        [router, props.solutionId],
    );

    const tableHeaders: CrudTableHeader[] = untranslatedTableHeaders.map((tableHeader) => ({
        ...tableHeader,
        label: t(`tableHeaders.${tableHeader.id}`),
    }));

    return (
        <Box>
            <CrudTable
                createButtonIcon="add"
                createButtonText={t("createContextButton.label")}
                createEntry={handleOpenCreateContextModal}
                withBottomCreateButton={props.withBottomCreateButton}
                withTopCreateButton={props.withTopCreateButton}
                dataProvider={dataProvider}
                deleteEntry={openDeleteContextModal}
                editEntry={openEditContextModal}
                entryIdProvider={entryIdProvider}
                headers={tableHeaders}
                refreshRef={refreshRef}
                rowComponent={ContextRow}
                viewEntryDetails={handleViewContext}
                withPagination
                onRowClick={handleViewContext}
                withGlobalStringFilter={false}
                actionsColumnWidth={100}
            />
        </Box>
    );
}
