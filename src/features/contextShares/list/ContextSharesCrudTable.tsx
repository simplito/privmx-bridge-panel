import { Box } from "@mantine/core";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useRef } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import { CrudTable, type CrudTableFilter, type CrudTableHeader } from "@/components/crudTable/CrudTable";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useSolutionApi } from "@/hooks/useSolutionApi";
import { useRouter } from "@/i18n/routing";
import type { ContextDeletedEvent, ContextUpdatedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { useOpenAddContextShareModal } from "../add/openAddContextShareModal";
import { useOpenRemoveContextShareModal } from "../remove/openRemoveContextShareModal";
import { ContextShareRow, untranslatedTableHeaders } from "./ContextShareRow";

const entryIdProvider = (entry: ServerApiTypes.api.solution.Solution) => entry.id;

export interface ContextSharesCrudTableProps {
    solution: ServerApiTypes.api.solution.Solution;
    context: ServerApiTypes.api.context.Context;
    withTopCreateButton?: boolean | undefined;
    withBottomCreateButton?: boolean | undefined;
}

export function ContextSharesCrudTable(props: ContextSharesCrudTableProps) {
    const t = useTranslations("features.contextShares");
    const router = useRouter();
    const refreshRef = useRef<() => Promise<ServerApiTypes.api.solution.Solution[]>>();
    const refresh = useCallback(() => {
        void refreshRef.current?.();
    }, []);
    usePrivMxBridgeApiEventListener(
        "contextDeleted",
        useCallback(
            (event: ContextDeletedEvent) => {
                if (event.contextId === props.context.id) {
                    refresh();
                }
            },
            [props.context.id, refresh],
        ),
    );
    usePrivMxBridgeApiEventListener(
        "contextUpdated",
        useCallback(
            (event: ContextUpdatedEvent) => {
                if (event.contextId === props.context.id) {
                    refresh();
                }
            },
            [props.context.id, refresh],
        ),
    );
    usePrivMxBridgeApiEventListener("solutionsChanged", refresh);

    const { openAddContextShareModal } = useOpenAddContextShareModal();
    const handleAddContextShareModal = useCallback(async () => {
        const res = await openAddContextShareModal(props.context);
        return { created: res.added };
    }, [openAddContextShareModal, props.context]);

    const { openRemoveContextShareModal } = useOpenRemoveContextShareModal();
    const handleOpenRemoveContextShareModal = useCallback(
        async (entry: ServerApiTypes.api.solution.Solution) => {
            const res = await openRemoveContextShareModal({ context: props.context, solution: entry });
            return { deleted: res.removed };
        },
        [openRemoveContextShareModal, props.context],
    );

    const solutionApi = useSolutionApi();
    const dataProvider = useCallback(
        async (pageId: number, entriesPerPage: number, _filters: CrudTableFilter[]) => {
            const solutionIds = props.context.shares.slice(pageId * entriesPerPage, (pageId + 1) * entriesPerPage);

            const res = await Promise.all(solutionIds.map(async (solutionId) => (await solutionApi.getSolution({ id: solutionId })).solution));

            return { entries: res, totalEntries: props.context.shares.length };
        },
        [props.context.shares, solutionApi],
    );

    const handleViewSolution = useCallback(
        (entry: ServerApiTypes.api.solution.Solution) => {
            router.push(appRoutes.solutions.$solution(props.solution.id).contexts.$context(props.context.id).shares.$share(entry.id).profile());
        },
        [props.context.id, props.solution.id, router],
    );

    const tableHeaders: CrudTableHeader[] = untranslatedTableHeaders.map((tableHeader) => ({
        ...tableHeader,
        label: t(`tableHeaders.${tableHeader.id}`),
    }));

    return (
        <Box>
            <CrudTable
                createButtonIcon="add"
                createButtonText={t("addContextShareButton.label")}
                createEntry={handleAddContextShareModal}
                deleteEntryTooltip={t("remove.actionName")}
                withBottomCreateButton={props.withBottomCreateButton}
                withTopCreateButton={props.withTopCreateButton}
                dataProvider={dataProvider}
                deleteEntry={handleOpenRemoveContextShareModal}
                entryIdProvider={entryIdProvider}
                headers={tableHeaders}
                refreshRef={refreshRef}
                rowComponent={ContextShareRow}
                viewEntryDetails={handleViewSolution}
                withPagination
                onRowClick={handleViewSolution}
                withGlobalStringFilter={false}
                actionsColumnWidth={100}
            />
        </Box>
    );
}
