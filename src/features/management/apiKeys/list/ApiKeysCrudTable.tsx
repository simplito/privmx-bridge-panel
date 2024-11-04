import { Box } from "@mantine/core";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useRef } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import { CrudTable, type CrudTableFilter, type CrudTableHeader } from "@/components/crudTable/CrudTable";
import { useManagerApi } from "@/hooks/useManagerApi";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useRouter } from "@/i18n/routing";
import { useOpenCreateApiKeyModal } from "../create/openCreateApiKeyModal";
import { useOpenDeleteApiKeyModal } from "../delete/openDeleteApiKeyModal";
import { useOpenEditApiKeyModal } from "../edit/openEditApiKeyModal";
import { ApiKeyRow, untranslatedTableHeaders } from "./ApiKeyRow";

const entryIdProvider = (entry: ServerApiTypes.api.manager.ApiKey) => entry.id;

export interface ApiKeysCrudTableProps {
    withTopCreateButton?: boolean | undefined;
    withBottomCreateButton?: boolean | undefined;
}

export function ApiKeysCrudTable(props: ApiKeysCrudTableProps) {
    const t = useTranslations("features.management.apiKeys");
    const router = useRouter();
    const refreshRef = useRef<() => Promise<ServerApiTypes.api.manager.ApiKey[]>>();
    const refresh = useCallback(() => {
        void refreshRef.current?.();
    }, []);
    usePrivMxBridgeApiEventListener("apiKeysChanged", refresh);
    const { openCreateApiKeyModal } = useOpenCreateApiKeyModal();
    const { openDeleteApiKeyModal } = useOpenDeleteApiKeyModal();
    const { openEditApiKeyModal } = useOpenEditApiKeyModal();

    const managerApi = useManagerApi();
    const dataProvider = useCallback(
        async (pageId: number, entriesPerPage: number, filters: CrudTableFilter[]) => {
            const globalStringFilter = filters.find((x) => x.type === "globalString");
            const queryString = globalStringFilter?.value;

            const res = await managerApi.listApiKeys();
            let list = res.list;
            if (queryString !== undefined) {
                const queryStringLower = queryString.toLowerCase();
                list = list.filter((entry) => entry.name.toLowerCase().includes(queryStringLower));
            }

            list = list.slice(pageId * entriesPerPage, (pageId + 1) * entriesPerPage);

            return { entries: list, totalEntries: res.list.length };
        },
        [managerApi],
    );

    const handleViewApiKey = useCallback(
        (entry: ServerApiTypes.api.manager.ApiKey) => {
            router.push(appRoutes.management.apiKeys.$apiKey(entry.id).profile());
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
                createButtonText={t("createApiKeyButton.label")}
                createEntry={openCreateApiKeyModal}
                withBottomCreateButton={props.withBottomCreateButton}
                withTopCreateButton={props.withTopCreateButton}
                dataProvider={dataProvider}
                deleteEntry={openDeleteApiKeyModal}
                editEntry={openEditApiKeyModal}
                entryIdProvider={entryIdProvider}
                headers={tableHeaders}
                refreshRef={refreshRef}
                rowComponent={ApiKeyRow}
                viewEntryDetails={handleViewApiKey}
                withPagination
                onRowClick={handleViewApiKey}
                withGlobalStringFilter
                actionsColumnWidth={100}
            />
        </Box>
    );
}
