import type { ComboboxData, StyleProp } from "@mantine/core";
import { ActionIcon, Box, Center, Group, Pagination, Select, Stack, Table, Text, TextInput, Tooltip } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "use-intl";
import { useDataLoader } from "@/hooks/useDataLoader";
import { getErrorMessage } from "@/utils/miscFunctions/getErrorMessage";
import { Icon, type IconName } from "../atoms/Icon";
import { LoadingOrError } from "../atoms/LoadingOrError";
import { Button } from "../button/Button";
import { CrudTableHeaderCell } from "./CrudTableHeaderCell";
import { CrudTableRow } from "./CrudTableRow";
import type { CrudTableRowActionData } from "./CrudTableRowAction";

export interface CrudTableStringFilterDefinition {
    type: "string";
}

export interface CrudTableNumberFilterDefinition {
    type: "number";
    decimalPlaces?: number | undefined;
}

export interface CrudTableOneOfFilterDefinition {
    type: "oneOf";
    options: CrudTableOneOfFilterDefinitionOption[] | (() => Promise<CrudTableOneOfFilterDefinitionOption[]>);
}

export interface CrudTableOneOfFilterDefinitionOption {
    label: string;
    value: string;
}

export interface CrudTableBooleanFilterDefinition {
    type: "boolean";
}

export type CrudTableFilterDefinition =
    | CrudTableStringFilterDefinition
    | CrudTableNumberFilterDefinition
    | CrudTableOneOfFilterDefinition
    | CrudTableBooleanFilterDefinition;

interface BaseHeaderFilter {
    headerId: string;
}

export interface CrudTableStringFilter extends Pick<CrudTableStringFilterDefinition, "type">, BaseHeaderFilter {
    value: string;
    subType: "contains" | "exact";
}

export interface CrudTableNumberSingleParamFilter extends Pick<CrudTableNumberFilterDefinition, "type">, BaseHeaderFilter {
    subType: "gt" | "lt" | "gte" | "lte";
    value: number;
}

export interface CrudTableNumberRangeFilter extends Pick<CrudTableNumberFilterDefinition, "type">, BaseHeaderFilter {
    subType: "range";
    valueMin: number;
    valueMax: number;
}

export type CrudTableNumberFilter = CrudTableNumberSingleParamFilter | CrudTableNumberRangeFilter;

export interface CrudTableOneOfFilter extends Pick<CrudTableOneOfFilterDefinition, "type">, BaseHeaderFilter {
    values: string[];
}

export interface CrudTableBooleanFilter extends Pick<CrudTableBooleanFilterDefinition, "type">, BaseHeaderFilter {
    value: "true" | "false";
}

export interface CrudTableGlobalStringFilter {
    type: "globalString";
    value: string;
}

export type CrudTableFilter = CrudTableGlobalStringFilter | CrudTableStringFilter | CrudTableNumberFilter | CrudTableOneOfFilter | CrudTableBooleanFilter;

export type CrudTableSortOrder = "asc" | "desc";

export interface CrudTableSortRule {
    headerId: string;
    order: CrudTableSortOrder;
}

export interface CrudTableHeader {
    id: string;
    label?: string | undefined;
    filter?: CrudTableFilterDefinition | undefined;
    sortable?: boolean | undefined;
    width?: StyleProp<React.CSSProperties["width"]> | undefined;
}

interface BaseCrudTableProps<TEntry> {
    headers: CrudTableHeader[];
    entryIdProvider: (entry: TEntry) => string;
    rowComponent: React.ComponentType<{ entry: TEntry }>;
    createEntry?: (() => Promise<{ created: boolean }>) | undefined;
    editEntry?: ((entry: TEntry) => Promise<{ changed: boolean }>) | undefined;
    viewEntryDetails?: ((entry: TEntry) => void) | undefined;
    deleteEntry?: ((entry: TEntry) => Promise<{ deleted: boolean }>) | undefined;
    isEntryDeletable?: ((entry: TEntry) => boolean) | undefined;
    deleteEntryTooltip?: string;
    extraActions?: Array<CrudTableRowActionData<TEntry>>;
    refreshRef?: React.MutableRefObject<(() => Promise<TEntry[]>) | undefined>;
    noRefreshButton?: boolean;
    onRowClick?: ((entry: TEntry) => void) | undefined;
    onDataStateChange?: ((dataState: CrudTableDataState<TEntry>) => void) | undefined;
    withGlobalStringFilter?: boolean | undefined;
    afterCreateButton?: React.ReactNode | undefined;
    beforeCreateButton?: React.ReactNode | undefined;
    createButtonText?: string | undefined;
    createButtonIcon?: IconName | undefined;
    isCreateButtonDisabled?: boolean | undefined;
    disabledCreateButtonTooltip?: string | undefined;
    withTopCreateButton?: boolean | undefined;
    withBottomCreateButton?: boolean | undefined;
    topCreateButtonStyle?: React.CSSProperties | undefined;
    bottomCreateButtonStyle?: React.CSSProperties | undefined;
    actionsColumnWidth?: StyleProp<React.CSSProperties["width"]> | undefined;
}

type PaginatedDataProvider<TEntry> = (
    pageId: number,
    entriesPerPage: number,
    filters: Array<CrudTableFilter | CrudTableGlobalStringFilter>,
    sortRule: CrudTableSortRule | null,
) => Promise<{ entries: TEntry[]; totalEntries: number }>;
type NonPaginatedDataProvider<TEntry> = (filters: CrudTableFilter[], sortRule: CrudTableSortRule | null) => Promise<TEntry[]>;

interface CrudTableWithPaginationExtraProps<TEntry> {
    withPagination: true;
    dataProvider: PaginatedDataProvider<TEntry>;
    withDuplicatedPaginationControls?: boolean | undefined;
}

interface CrudTableWithoutPaginationExtraProps<TEntry> {
    dataProvider: NonPaginatedDataProvider<TEntry>;
    withPagination?: false | undefined;
}

export type CrudTableProps<TEntry, TWithPagination extends boolean> = TWithPagination extends true
    ? BaseCrudTableProps<TEntry> & CrudTableWithPaginationExtraProps<TEntry>
    : BaseCrudTableProps<TEntry> & CrudTableWithoutPaginationExtraProps<TEntry>;

const defaultEntriesPerPage = 25;
const pageSizeOptionValues = [10, 25, 50, 100];
const pageSizeLocalStorageKey = "crudTableEntriesPerPage";
const shouldShowShowingEntryCountsText = false;
const globalStringFilterMinLength = 2;

function setGlobalFilter(filter: string, setFilters: (setter: (prevFilters: CrudTableFilter[]) => CrudTableFilter[]) => void) {
    // eslint-disable-next-line no-param-reassign
    filter = filter.trim();
    if (filter.length < globalStringFilterMinLength) {
        setFilters((prevFilters) => prevFilters.filter((x) => x.type !== "globalString"));
    } else {
        setFilters((prevFilters) => {
            const newFilters: CrudTableFilter[] = prevFilters.filter((x) => x.type !== "globalString");
            newFilters.push({ type: "globalString", value: filter });
            return newFilters;
        });
    }
}

export interface CrudTableDataState<TEntry> {
    isLoading: boolean;
    error: unknown;
    entries: TEntry[];
}

export function CrudTable<TEntry, TWithPagination extends boolean>(props: CrudTableProps<TEntry, TWithPagination>) {
    const [rows, setRows] = useState<TEntry[]>([]);
    const t = useTranslations();

    const savedEntriesPerPageStr = typeof window === "undefined" ? "" : (window.localStorage.getItem(pageSizeLocalStorageKey) ?? "");
    const savedEntriesPerPage = isNaN(parseInt(savedEntriesPerPageStr, 10)) ? defaultEntriesPerPage : parseInt(savedEntriesPerPageStr, 10);
    const [pageId, setPageId] = useState(0);
    const [entriesPerPage, setEntriesPerPage] = useState(savedEntriesPerPage);
    const [totalEntries, setTotalEntries] = useState(0);
    const [sortRule, setSortRule] = useState<CrudTableSortRule | null>(null);
    const [filters, setFilters] = useState<CrudTableFilter[]>([]);
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const dataProvider = props.dataProvider;
    const loadData = useCallback(async () => {
        if (props.withPagination === true) {
            const paginatedDataProvider = dataProvider as PaginatedDataProvider<TEntry>;
            const res = await paginatedDataProvider(pageId, entriesPerPage, filters, sortRule);
            setTotalEntries(res.totalEntries);
            const newTotalPages = Math.ceil(res.totalEntries / entriesPerPage);
            setPageId(Math.min(pageId, Math.max(0, newTotalPages - 1)));
            return res.entries;
        } else {
            const nonPaginatedDataProvider = dataProvider as NonPaginatedDataProvider<TEntry>;
            return await nonPaginatedDataProvider(filters, sortRule);
        }
    }, [dataProvider, pageId, entriesPerPage, props.withPagination, filters, sortRule]);
    const { error, isLoading, reload } = useDataLoader(loadData, setRows);
    const propsOnDataStateChange = props.onDataStateChange;
    useEffect(() => {
        propsOnDataStateChange?.({ isLoading, error, entries: rows });
    }, [isLoading, error, rows, propsOnDataStateChange]);

    const refresh = useCallback(async () => {
        return await reload();
    }, [reload]);

    if (props.refreshRef) {
        // eslint-disable-next-line no-param-reassign
        props.refreshRef.current = refresh;
    }

    const actions = useMemo(() => {
        const actionsRes: Array<CrudTableRowActionData<TEntry>> = [];
        if (props.viewEntryDetails) {
            actionsRes.push({
                id: "viewDetails",
                tooltip: t("forms.buttons.viewDetails"),
                icon: <Icon name="viewDetails" />,
                onClick: props.viewEntryDetails,
                isSeparate: true,
            });
        }
        if (props.editEntry) {
            actionsRes.push({
                id: "edit",
                tooltip: t("forms.buttons.edit"),
                icon: <Icon name="edit" />,
                onClick: props.editEntry,
            });
        }
        if (props.deleteEntry) {
            actionsRes.push({
                id: "delete",
                tooltip: props.deleteEntryTooltip ?? t("forms.buttons.delete"),
                icon: <Icon name="delete" />,
                onClick: props.deleteEntry,
                isAvailableForEntry: props.isEntryDeletable,
            });
        }
        if (props.extraActions) {
            actionsRes.push(...props.extraActions);
        }
        return actionsRes;
    }, [props.viewEntryDetails, props.deleteEntry, props.extraActions, props.editEntry, props.deleteEntryTooltip, props.isEntryDeletable, t]);

    const handleRefresh = useCallback(() => {
        void refresh();
    }, [refresh]);

    const handlePaginationChange = useCallback((newPageId: number) => {
        setPageId(newPageId - 1);
    }, []);

    const handleEntriesPerPageChange = useCallback((value: string | null) => {
        setEntriesPerPage(value === null ? defaultEntriesPerPage : parseInt(value, 10));
        localStorage.setItem(pageSizeLocalStorageKey, value === null ? defaultEntriesPerPage.toString() : value); // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
    }, []);

    const handleGlobalFilterChange = useDebouncedCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setGlobalFilter(value, setFilters);
    }, 500);

    const globalStringFilterInputRef = useRef<HTMLInputElement>(null);
    const currGlobalStringFilterInputValue = globalStringFilterInputRef.current?.value ?? "";
    const shouldShowGlobalStringFilterTooltip =
        currGlobalStringFilterInputValue.length > 0 && currGlobalStringFilterInputValue.length < globalStringFilterMinLength;

    const isGlobalStringFilterActive = filters.some((x) => x.type === "globalString");

    return (
        <Stack gap="xl">
            {props.withTopCreateButton === true ? (
                <Group gap="md" justify="flex-end" mb="md" style={{ position: "absolute", right: "60px", marginTop: "-4px", zIndex: 9 }}>
                    {props.beforeCreateButton}
                    {props.createEntry ? (
                        <CreateEntryButton
                            createEntry={props.createEntry}
                            text={props.createButtonText}
                            icon={props.createButtonIcon}
                            style={props.topCreateButtonStyle}
                            isLoading={isLoading}
                            hasAnyEntries={rows.length > 0}
                            disabled={props.isCreateButtonDisabled}
                            disabledTooltip={props.disabledCreateButtonTooltip}
                        />
                    ) : (
                        <Box />
                    )}
                    {props.afterCreateButton}
                </Group>
            ) : null}
            <Box style={{ position: "relative" }}>
                {props.withGlobalStringFilter === true ? (
                    <Box pb="md">
                        <Tooltip opened={shouldShowGlobalStringFilterTooltip} label={t("filter.enterAtLeast", { count: globalStringFilterMinLength })}>
                            <TextInput
                                maw={270}
                                placeholder={t("filter.placeholder")}
                                onChange={handleGlobalFilterChange}
                                leftSection={<Icon name="search" />}
                                ref={globalStringFilterInputRef}
                                style={{ opacity: isGlobalStringFilterActive ? 1 : 0.75 }}
                            />
                        </Tooltip>
                    </Box>
                ) : null}
                {props.noRefreshButton !== false && (
                    <Box style={{ position: "absolute", right: 0, top: 0 }}>
                        <Tooltip label={t("refresh")}>
                            <ActionIcon onClick={handleRefresh} variant="transparent" disabled={isLoading}>
                                <Icon name="reload" />
                            </ActionIcon>
                        </Tooltip>
                    </Box>
                )}
                <Stack>
                    {props.withPagination === true && props.withDuplicatedPaginationControls === true ? (
                        <PaginationEx
                            pageId={pageId}
                            totalPages={totalPages}
                            totalEntries={totalEntries}
                            entriesPerPage={entriesPerPage}
                            handlePaginationChange={handlePaginationChange}
                            handleEntriesPerPageChange={handleEntriesPerPageChange}
                        />
                    ) : null}
                    <Box>
                        <Table withTableBorder style={{ opacity: isLoading ? 0.5 : 1, borderLeft: 0, borderRight: 0 }}>
                            <Table.Thead>
                                <Table.Tr style={{ borderBottom: 0 }}>
                                    {props.headers.map((header) => (
                                        <CrudTableHeaderCell
                                            key={header.id}
                                            header={header}
                                            filters={filters}
                                            sortRule={sortRule}
                                            setFilters={setFilters}
                                            setSortRule={setSortRule}
                                        />
                                    ))}
                                    {actions.length > 0 && <Table.Th w={props.actionsColumnWidth ?? 200}>Actions</Table.Th>}
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {rows.map((row) => (
                                    <CrudTableRow
                                        key={props.entryIdProvider(row)}
                                        row={row}
                                        rowComponent={props.rowComponent}
                                        actions={actions}
                                        onClick={props.onRowClick}
                                    />
                                ))}
                                {rows.length === 0 && !isLoading && (error === undefined || error === null) && (
                                    <Table.Tr>
                                        <Table.Td colSpan={props.headers.length + 1}>
                                            <Center>No entries</Center>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                                {rows.length === 0 && isLoading && (error === undefined || error === null) ? (
                                    <Table.Tr>
                                        <Table.Td colSpan={props.headers.length + 1} py={60} />
                                    </Table.Tr>
                                ) : null}
                            </Table.Tbody>
                        </Table>
                        <Center style={{ position: "absolute", top: 100, left: 0, right: 0 }}>
                            <LoadingOrError
                                isLoading={isLoading}
                                errorMessage={error === undefined || error === null ? null : getErrorMessage(error)}
                                retry={reload}
                            />
                        </Center>
                    </Box>
                    {props.withPagination === true ? (
                        <PaginationEx
                            pageId={pageId}
                            totalPages={totalPages}
                            totalEntries={totalEntries}
                            entriesPerPage={entriesPerPage}
                            handlePaginationChange={handlePaginationChange}
                            handleEntriesPerPageChange={handleEntriesPerPageChange}
                        />
                    ) : null}
                </Stack>
            </Box>
            {props.withBottomCreateButton !== false && (
                <Group gap="md">
                    {props.beforeCreateButton}
                    {props.createEntry ? (
                        <CreateEntryButton
                            createEntry={props.createEntry}
                            text={props.createButtonText}
                            icon={props.createButtonIcon}
                            style={props.bottomCreateButtonStyle}
                            isLoading={isLoading}
                            hasAnyEntries={rows.length > 0}
                            disabled={props.isCreateButtonDisabled}
                            disabledTooltip={props.disabledCreateButtonTooltip}
                        />
                    ) : null}
                    {props.afterCreateButton}
                </Group>
            )}
        </Stack>
    );
}

interface PaginationExProps {
    pageId: number;
    totalPages: number;
    totalEntries: number;
    entriesPerPage: number;
    handlePaginationChange: (newPageId: number) => void;
    handleEntriesPerPageChange: (value: string | null) => void;
}

function PaginationEx(props: PaginationExProps) {
    const t = useTranslations();
    const pageSizeOptions: ComboboxData = useMemo(() => {
        return pageSizeOptionValues.map((value) => ({ label: t("pagination.showPerPage", { count: value }), value: value.toString() }));
    }, [t]);

    return (
        <Group justify="space-between">
            {props.totalPages < 2 ? (
                <Box />
            ) : (
                <Pagination
                    total={props.totalPages}
                    value={props.pageId + 1}
                    onChange={props.handlePaginationChange}
                    getControlProps={getControlProps}
                    getItemProps={props.totalPages < 2 ? getHiddenItemProps : undefined}
                />
            )}
            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
            {shouldShowShowingEntryCountsText ? (
                <Text>
                    {t("pagination.showing", {
                        from: props.pageId * props.entriesPerPage + 1,
                        to: Math.min((props.pageId + 1) * props.entriesPerPage, props.totalEntries),
                        total: props.totalEntries,
                    })}
                </Text>
            ) : null}
            <Select value={props.entriesPerPage.toString()} onChange={props.handleEntriesPerPageChange} data={pageSizeOptions} variant="transparent" />
        </Group>
    );
}

function getHiddenItemProps() {
    return {
        style: {
            display: "none",
        },
    };
}

function getControlProps(control: "first" | "previous" | "last" | "next") {
    if (control === "previous") {
        return {
            component: PreviousButton,
        };
    }
    if (control === "next") {
        return {
            component: NextButton,
        };
    }
    return {};
}

interface PreviousButtonProps {
    onClick: () => void;
}

function PreviousButton(props: PreviousButtonProps) {
    const t = useTranslations();

    return (
        <Button type="button" priority="tertiary" size="sm" onClick={props.onClick}>
            <Group gap="xs">
                <Icon name="chevronLeft" />
                <Text>{t("pagination.prev")}</Text>
            </Group>
        </Button>
    );
}

interface NextButtonProps {
    onClick: () => void;
}

function NextButton(props: NextButtonProps) {
    const t = useTranslations();

    return (
        <Button type="button" priority="tertiary" size="sm" onClick={props.onClick}>
            <Group gap="xs">
                <Text>{t("pagination.next")}</Text>
                <Icon name="chevronRight" />
            </Group>
        </Button>
    );
}

interface CreateEntryButtonProps {
    isLoading: boolean;
    hasAnyEntries: boolean;
    createEntry?: (() => Promise<{ created: boolean }>) | undefined;
    text?: string | undefined;
    icon?: IconName | undefined;
    style?: React.CSSProperties | undefined;
    disabled?: boolean | undefined;
    disabledTooltip?: string | undefined;
}

function CreateEntryButton(props: CreateEntryButtonProps) {
    const propsCreateEntry = props.createEntry;
    const handleCreateEntryClick = useCallback(() => {
        void propsCreateEntry?.();
    }, [propsCreateEntry]);

    const isDisabled = props.isLoading || props.disabled;
    const isTooltipDisabled = isDisabled !== true || (props.disabledTooltip ?? "").length === 0;

    return (
        <Tooltip label={props.disabledTooltip ?? ""} disabled={isTooltipDisabled}>
            <div>
                <Button type="button" priority="primary" icon={props.icon} onClick={handleCreateEntryClick} style={props.style} disabled={isDisabled}>
                    {props.text}
                </Button>
            </div>
        </Tooltip>
    );
}
