import { Box, CrudTable, type CrudTableHeader } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useRef } from "react";
import { appRoutes } from "@/app/appRoutes";
import { useContextApi } from "@/hooks/useContextApi";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useRouter } from "@/i18n/routing";
import { useOpenCreateContextModal } from "../create/openCreateContextModal";
import { useOpenDeleteContextModal } from "../delete/openDeleteContextModal";
import { useOpenEditContextModal } from "../edit/openEditContextModal";
import { ContextRow, untranslatedTableHeaders } from "./ContextRow";

const entryIdProvider = (entry: ServerApiTypes.api.context.Context) => entry.id;

export interface ContextsCrudTableProps {
    solutionId?: ServerApiTypes.types.cloud.SolutionId | undefined;
    withTopCreateButton?: boolean | undefined;
    withBottomCreateButton?: boolean | undefined;
}

export function ContextsCrudTable(props: ContextsCrudTableProps) {
    const { t } = useI18n("features.contexts");
    const router = useRouter();
    const refreshRef = useRef<() => Promise<ServerApiTypes.api.context.Context[]>>(undefined);
    const refresh = useCallback(() => {
        void refreshRef.current?.();
    }, []);
    usePrivMxBridgeApiEventListener("contextsChanged", refresh);
    const { openCreateContextModal } = useOpenCreateContextModal();
    const { openDeleteContextModal } = useOpenDeleteContextModal();
    const { openEditContextModal } = useOpenEditContextModal();
    const handleOpenCreateContextModal = useCallback(async () => {
        return await openCreateContextModal(props.solutionId ?? null);
    }, [openCreateContextModal, props.solutionId]);

    const contextApi = useContextApi();
    const dataProvider = useCallback(
        async (pageId: number, entriesPerPage: number) => {
            const skip = pageId * entriesPerPage;

            if (props.solutionId === undefined) {
                const res = await contextApi.listContexts({
                    limit: entriesPerPage,
                    skip: skip,
                    sortOrder: "desc",
                });

                return { entries: res.list, totalEntries: res.list.length };
            }
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
            void router.push(appRoutes.contexts.$context(entry.id).profile());
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
