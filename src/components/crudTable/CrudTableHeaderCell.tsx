import { ActionIcon, Group, MultiSelect, NumberInput, Popover, SegmentedControl, Select, Stack, Switch, Table, Text, TextInput, Tooltip } from "@mantine/core";
import { useCallback, useRef, useState } from "react";
import { useTranslations } from "use-intl";
import { useDataLoader } from "@/hooks/useDataLoader";
import { Icon } from "../atoms/Icon";
import { LoadingOrError } from "../atoms/LoadingOrError";
import { Button } from "../button/Button";
import type {
    CrudTableBooleanFilter,
    CrudTableFilter,
    CrudTableHeader,
    CrudTableNumberFilter,
    CrudTableOneOfFilter,
    CrudTableOneOfFilterDefinitionOption,
    CrudTableSortRule,
    CrudTableStringFilter,
} from "./CrudTable";

export interface CrudTableHeaderCellProps {
    header: CrudTableHeader;
    filters: CrudTableFilter[];
    sortRule: CrudTableSortRule | null;
    setFilters: React.Dispatch<React.SetStateAction<CrudTableFilter[]>>;
    setSortRule: React.Dispatch<React.SetStateAction<CrudTableSortRule | null>>;
}

type BooleanFilterValue = "null" | "true" | "false";

export function CrudTableHeaderCell(props: CrudTableHeaderCellProps) {
    const t = useTranslations();
    const [isFilterPopoverOpened, setIsFilterPopoverOpened] = useState(false);
    const [filtersDraft, setFiltersDraft] = useState<CrudTableFilter[]>([]);
    const setFilters = props.setFilters;

    const booleanFilterValue = (
        filtersDraft.find((x) => x.type !== "globalString" && x.headerId === props.header.id && x.type === "boolean") as CrudTableBooleanFilter | undefined
    )?.value;
    const numberFilter = filtersDraft.find((x) => x.type !== "globalString" && x.headerId === props.header.id && x.type === "number") as
        | CrudTableNumberFilter
        | undefined;
    const oneOfFilter = filtersDraft.find((x) => x.type !== "globalString" && x.headerId === props.header.id && x.type === "oneOf") as
        | CrudTableOneOfFilter
        | undefined;
    const stringFilter = filtersDraft.find((x) => x.type !== "globalString" && x.headerId === props.header.id && x.type === "string") as
        | CrudTableStringFilter
        | undefined;
    const numberValueRef = useRef<HTMLInputElement | null>(null);
    const numberValueMinRef = useRef<HTMLInputElement | null>(null);
    const numberValueMaxRef = useRef<HTMLInputElement | null>(null);
    const isExactStringRef = useRef<HTMLInputElement | null>(null);

    const handlePopoverTargetClick = useCallback(() => {
        setFiltersDraft(props.filters);
        setIsFilterPopoverOpened(true);
    }, [props.filters]);

    const saveFilters = useCallback(() => {
        const newFilters = filtersDraft.filter((filter) => {
            if (filter.type === "string" && filter.value.trim() === "") {
                return false;
            }
            return true;
        });
        setFilters((prevFilters) => {
            if (JSON.stringify(prevFilters) === JSON.stringify(newFilters)) {
                return prevFilters;
            }
            return newFilters;
        });
    }, [setFilters, filtersDraft]);

    const handlePopoverChange = useCallback(
        (opened: boolean) => {
            setIsFilterPopoverOpened((prev) => {
                if (prev && !opened) {
                    // Outside click
                    setTimeout(() => {
                        saveFilters();
                    }, 0);
                }
                return opened;
            });
        },
        [saveFilters],
    );

    const handleFilterPopoverCancelClick = useCallback(() => {
        setIsFilterPopoverOpened(false);
        setFiltersDraft(props.filters);
    }, [props.filters]);

    const handleFilterPopoverSaveClick = useCallback(() => {
        setIsFilterPopoverOpened(false);
        saveFilters();
    }, [saveFilters]);

    const setSortRule = props.setSortRule;
    const handleSortClick = useCallback(() => {
        if (props.sortRule?.headerId === props.header.id) {
            setSortRule({
                headerId: props.header.id,
                order: props.sortRule.order === "asc" ? "desc" : "asc",
            });
        } else {
            setSortRule({ headerId: props.header.id, order: "asc" });
        }
    }, [props.header.id, props.sortRule?.headerId, props.sortRule?.order, setSortRule]);

    const handleBooleanFilterChange = useCallback(
        (valueStr: string) => {
            const value = valueStr as BooleanFilterValue;
            const filter = filtersDraft.find((x) => x.type !== "globalString" && x.headerId === props.header.id && x.type === "boolean") as
                | CrudTableBooleanFilter
                | undefined;
            if (filter) {
                setFiltersDraft((prev) => {
                    if (value === "null") {
                        return prev.filter((x) => x !== filter);
                    }
                    return prev.map((x) => {
                        if (x === filter) {
                            return { ...filter, value };
                        }
                        return x;
                    });
                });
            } else if (value !== "null") {
                setFiltersDraft((prev) => {
                    return [...prev, { headerId: props.header.id, type: "boolean", value }];
                });
            }
        },
        [filtersDraft, props.header.id],
    );

    const handleNumberFilterSubTypeChange = useCallback(
        (subTypeOptionValue: string | null) => {
            const subType = subTypeOptionValue === null ? "null" : (subTypeOptionValue as CrudTableNumberFilter["subType"]);
            const filter = filtersDraft.find((x) => x.type !== "globalString" && x.headerId === props.header.id && x.type === "number") as
                | CrudTableNumberFilter
                | undefined;
            const value = parseInt(numberValueRef.current?.value ?? "0", 10);
            const valueMin = parseInt(numberValueMinRef.current?.value ?? "0", 10);
            const valueMax = parseInt(numberValueMaxRef.current?.value ?? "0", 10);
            const newFilter: CrudTableNumberFilter | null =
                subType === "null"
                    ? null
                    : subType === "range"
                      ? { type: "number", headerId: props.header.id, subType, valueMin, valueMax }
                      : { type: "number", headerId: props.header.id, subType, value };
            if (filter) {
                setFiltersDraft((prev) => {
                    if (subType === "null") {
                        return prev.filter((x) => x !== filter);
                    }
                    return prev.map((x) => {
                        if (x === filter && newFilter !== null) {
                            return newFilter;
                        }
                        return x;
                    });
                });
            } else if (subType !== "null" && newFilter !== null) {
                setFiltersDraft((prev) => {
                    return [...prev, newFilter];
                });
            }
        },
        [filtersDraft, props.header.id],
    );

    const handleNumberValueChange = useCallback(
        (valueRaw: string | number) => {
            const value = typeof valueRaw === "string" ? parseInt(valueRaw, 10) : valueRaw;
            const filter = filtersDraft.find((x) => x.type !== "globalString" && x.headerId === props.header.id && x.type === "number") as
                | CrudTableNumberFilter
                | undefined;
            if (filter && filter.subType !== "range") {
                setFiltersDraft((prev) => {
                    return prev.map((x) => {
                        if (x === filter) {
                            return { ...filter, value };
                        }
                        return x;
                    });
                });
            }
        },
        [filtersDraft, props.header.id],
    );

    const handleNumberValueMinChange = useCallback(
        (valueRaw: string | number) => {
            const value = typeof valueRaw === "string" ? parseInt(valueRaw, 10) : valueRaw;
            const filter = filtersDraft.find((x) => x.type !== "globalString" && x.headerId === props.header.id && x.type === "number") as
                | CrudTableNumberFilter
                | undefined;
            if (filter && filter.subType === "range") {
                setFiltersDraft((prev) => {
                    return prev.map((x) => {
                        if (x === filter) {
                            return { ...filter, valueMin: value };
                        }
                        return x;
                    });
                });
            }
        },
        [filtersDraft, props.header.id],
    );

    const handleNumberValueMaxChange = useCallback(
        (valueRaw: string | number) => {
            const value = typeof valueRaw === "string" ? parseInt(valueRaw, 10) : valueRaw;
            const filter = filtersDraft.find((x) => x.type !== "globalString" && x.headerId === props.header.id && x.type === "number") as
                | CrudTableNumberFilter
                | undefined;
            if (filter && filter.subType === "range") {
                setFiltersDraft((prev) => {
                    return prev.map((x) => {
                        if (x === filter) {
                            return { ...filter, valueMax: value };
                        }
                        return x;
                    });
                });
            }
        },
        [filtersDraft, props.header.id],
    );

    const handleOneOfFilterChange = useCallback(
        (values: string[]) => {
            const filter = filtersDraft.find((x) => x.type !== "globalString" && x.headerId === props.header.id && x.type === "oneOf") as
                | CrudTableOneOfFilter
                | undefined;
            if (filter) {
                setFiltersDraft((prev) => {
                    if (values.length === 0) {
                        return prev.filter((x) => x !== filter);
                    }
                    return prev.map((x) => {
                        if (x === filter) {
                            return { ...filter, values };
                        }
                        return x;
                    });
                });
            } else if (values.length > 0) {
                setFiltersDraft((prev) => {
                    return [...prev, { headerId: props.header.id, type: "oneOf", values }];
                });
            }
        },
        [filtersDraft, props.header.id],
    );

    const handleStringFilterChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            const filter = filtersDraft.find((x) => x.type !== "globalString" && x.headerId === props.header.id && x.type === "string") as
                | CrudTableStringFilter
                | undefined;
            if (filter) {
                setFiltersDraft((prev) => {
                    return prev.map((x) => {
                        if (x === filter) {
                            return { ...filter, value };
                        }
                        return x;
                    });
                });
            } else if (value !== "") {
                setFiltersDraft((prev) => {
                    return [
                        ...prev,
                        { headerId: props.header.id, type: "string", value, subType: isExactStringRef.current?.checked === true ? "exact" : "contains" },
                    ];
                });
            }
        },
        [filtersDraft, props.header.id],
    );

    const handleStringFilterExactChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const isChecked = event.target.checked;
            const filter = filtersDraft.find((x) => x.type !== "globalString" && x.headerId === props.header.id && x.type === "string") as
                | CrudTableStringFilter
                | undefined;
            if (filter) {
                setFiltersDraft((prev) => {
                    return prev.map((x) => {
                        if (x === filter) {
                            return { ...filter, subType: isChecked ? "exact" : "contains" };
                        }
                        return x;
                    });
                });
            }
        },
        [filtersDraft, props.header.id],
    );

    return (
        <Table.Th pb="md" w={props.header.width}>
            <Group wrap="nowrap" gap={0}>
                <Text component="span">{props.header.label}</Text>
                {props.header.sortable === true ? (
                    <Tooltip label={t("sort.direction.tooltip")}>
                        <ActionIcon
                            variant="transparent"
                            style={{
                                opacity: props.sortRule?.headerId === props.header.id ? 1 : 0.2,
                            }}
                            onClick={handleSortClick}
                        >
                            {props.sortRule?.order === "asc" || props.sortRule?.order === undefined || props.sortRule.headerId !== props.header.id ? (
                                <Icon name="chevronUp" />
                            ) : (
                                <Icon name="chevronDown" />
                            )}
                        </ActionIcon>
                    </Tooltip>
                ) : null}
                {props.header.filter ? (
                    <Tooltip label="Filter">
                        <div>
                            <Popover
                                width={360}
                                trapFocus
                                position="bottom"
                                withArrow
                                shadow="md"
                                opened={isFilterPopoverOpened}
                                onChange={handlePopoverChange}
                            >
                                <Popover.Target>
                                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                                    <div onClick={handlePopoverTargetClick}>
                                        <ActionIcon
                                            variant="transparent"
                                            style={{
                                                opacity: props.filters.some((x) => x.type !== "globalString" && x.headerId === props.header.id) ? 1 : 0.2,
                                            }}
                                        >
                                            <Icon name="filter" />
                                        </ActionIcon>
                                    </div>
                                </Popover.Target>
                                <Popover.Dropdown>
                                    <Stack p="md" gap="md">
                                        <Text fw="bold">{t("filter.label")}:</Text>
                                        {props.header.filter.type === "boolean" && (
                                            <SegmentedControl
                                                value={booleanFilterValue ?? "null"}
                                                onChange={handleBooleanFilterChange}
                                                data={[
                                                    { value: "null", label: t("filter.booleanState.null") },
                                                    { value: "true", label: t("filter.booleanState.true") },
                                                    { value: "false", label: t("filter.booleanState.false") },
                                                ]}
                                            />
                                        )}
                                        {props.header.filter.type === "number" && (
                                            <Stack gap="md">
                                                <Select
                                                    value={numberFilter?.subType ?? "null"}
                                                    onChange={handleNumberFilterSubTypeChange}
                                                    comboboxProps={{ withinPortal: false }}
                                                    data={[
                                                        { value: "null", label: t("filter.numberState.null") },
                                                        { value: "gt", label: t("filter.numberState.gt") },
                                                        { value: "gte", label: t("filter.numberState.gte") },
                                                        { value: "lt", label: t("filter.numberState.lt") },
                                                        { value: "lte", label: t("filter.numberState.lte") },
                                                        { value: "range", label: t("filter.numberState.range") },
                                                    ]}
                                                />
                                                {(numberFilter?.subType === "gt" ||
                                                    numberFilter?.subType === "gte" ||
                                                    numberFilter?.subType === "lt" ||
                                                    numberFilter?.subType === "lte") && (
                                                    <NumberInput
                                                        value={numberFilter.value}
                                                        onChange={handleNumberValueChange}
                                                        decimalScale={props.header.filter.decimalPlaces ?? 0}
                                                        ref={numberValueRef}
                                                    />
                                                )}
                                                {numberFilter?.subType === "range" && (
                                                    <Group wrap="nowrap">
                                                        <NumberInput
                                                            value={numberFilter.valueMin}
                                                            onChange={handleNumberValueMinChange}
                                                            decimalScale={props.header.filter.decimalPlaces ?? 0}
                                                            ref={numberValueMinRef}
                                                        />
                                                        <Text>-</Text>
                                                        <NumberInput
                                                            value={numberFilter.valueMax}
                                                            onChange={handleNumberValueMaxChange}
                                                            decimalScale={props.header.filter.decimalPlaces ?? 0}
                                                            ref={numberValueMaxRef}
                                                        />
                                                    </Group>
                                                )}
                                            </Stack>
                                        )}
                                        {props.header.filter.type === "oneOf" && (
                                            <OneOfFilter
                                                values={oneOfFilter?.values ?? []}
                                                onChange={handleOneOfFilterChange}
                                                data={props.header.filter.options}
                                            />
                                        )}
                                        {props.header.filter.type === "string" && (
                                            <Stack gap="md">
                                                <TextInput value={stringFilter?.value ?? ""} onChange={handleStringFilterChange} />
                                                <Switch
                                                    label={t("filter.stringState.exactMatch")}
                                                    checked={stringFilter?.subType === "exact"}
                                                    onChange={handleStringFilterExactChange}
                                                    ref={isExactStringRef}
                                                />
                                            </Stack>
                                        )}
                                        <Group justify="space-between" align="center" mt="md">
                                            <Button type="button" preset="cancel" onClick={handleFilterPopoverCancelClick} />
                                            <Button type="button" preset="ok" onClick={handleFilterPopoverSaveClick} />
                                        </Group>
                                    </Stack>
                                </Popover.Dropdown>
                            </Popover>
                        </div>
                    </Tooltip>
                ) : null}
            </Group>
        </Table.Th>
    );
}

interface OneOfFilterProps {
    values: string[];
    onChange: (values: string[]) => void;
    data: CrudTableOneOfFilterDefinitionOption[] | (() => Promise<CrudTableOneOfFilterDefinitionOption[]>);
}

function OneOfFilter(props: OneOfFilterProps) {
    const [data, setData] = useState<CrudTableOneOfFilterDefinitionOption[] | null>(null);
    const propsData = props.data;
    const { error, isLoading } = useDataLoader(
        useCallback(async () => await Promise.resolve(typeof propsData === "function" ? propsData() : propsData), [propsData]),
        setData,
    );

    if (Boolean(error) || isLoading || data === null) {
        return <LoadingOrError error={error} isLoading={isLoading} loaderSize="sm" />;
    }

    return <MultiSelect value={props.values} onChange={props.onChange} data={data} comboboxProps={{ withinPortal: false }} />;
}
