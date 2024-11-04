import { Box } from "@mantine/core";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useRef } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import { CrudTable, type CrudTableFilter, type CrudTableHeader } from "@/components/crudTable/CrudTable";
import { useContextApi } from "@/hooks/useContextApi";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useRouter } from "@/i18n/routing";
import type { ContextDeletedEvent, ContextUpdatedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { useOpenCreateContextUserModal } from "../create/openCreateContextUserModal";
import { useOpenDeleteContextUserModal } from "../delete/openDeleteContextUserModal";
import { useOpenEditContextUserModal } from "../edit/openEditContextUserModal";
import { ContextUserRow, untranslatedTableHeaders } from "./ContextUserRow";

const entryIdProvider = (entry: ServerApiTypes.api.context.ContextUser) => entry.userId;

export interface ContextUsersCrudTableProps {
    solution: ServerApiTypes.api.solution.Solution;
    context: ServerApiTypes.api.context.Context;
    withTopCreateButton?: boolean | undefined;
    withBottomCreateButton?: boolean | undefined;
}

export function ContextUsersCrudTable(props: ContextUsersCrudTableProps) {
    const t = useTranslations("features.contextUsers");
    const router = useRouter();
    const refreshRef = useRef<() => Promise<ServerApiTypes.api.context.ContextUser[]>>();
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

    const { openCreateContextUserModal } = useOpenCreateContextUserModal();
    const handleCreateContextUserModal = useCallback(async () => {
        return await openCreateContextUserModal(props.context);
    }, [openCreateContextUserModal, props.context]);

    const { openDeleteContextUserModal } = useOpenDeleteContextUserModal();
    const handleOpenDeleteContextUserModal = useCallback(
        async (entry: ServerApiTypes.api.context.ContextUser) => {
            return await openDeleteContextUserModal({ context: props.context, solution: props.solution, user: entry });
        },
        [openDeleteContextUserModal, props.context, props.solution],
    );

    const { openEditContextUserModal } = useOpenEditContextUserModal();

    const contextApi = useContextApi();
    const dataProvider = useCallback(
        async (pageId: number, entriesPerPage: number, _filters: CrudTableFilter[]) => {
            const skip = pageId * entriesPerPage;

            const res = await contextApi.listUsersFromContext({
                contextId: props.context.id,
                limit: entriesPerPage,
                skip: skip,
                sortOrder: "desc",
            });

            return { entries: res.users, totalEntries: res.count };
        },
        [contextApi, props.context.id],
    );

    const handleViewSolution = useCallback(
        (entry: ServerApiTypes.api.context.ContextUser) => {
            router.push(appRoutes.solutions.$solution(props.solution.id).contexts.$context(props.context.id).users.$user(entry.userId).profile());
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
                createButtonText={t("createContextUserButton.label")}
                createEntry={handleCreateContextUserModal}
                withBottomCreateButton={props.withBottomCreateButton}
                withTopCreateButton={props.withTopCreateButton}
                dataProvider={dataProvider}
                deleteEntry={handleOpenDeleteContextUserModal}
                editEntry={openEditContextUserModal}
                entryIdProvider={entryIdProvider}
                headers={tableHeaders}
                refreshRef={refreshRef}
                rowComponent={ContextUserRow}
                viewEntryDetails={handleViewSolution}
                withPagination
                onRowClick={handleViewSolution}
                withGlobalStringFilter={false}
                actionsColumnWidth={100}
            />
        </Box>
    );
}
