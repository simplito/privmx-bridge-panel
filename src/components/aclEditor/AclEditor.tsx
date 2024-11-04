import { InputLabel, InputWrapper, Table } from "@mantine/core";
import { useCallback, useState } from "react";
import { useTranslations } from "use-intl";
import { Button } from "../button/Button";
import { AclEditorRow } from "./AclEditorRow";

export interface AclEditorProps {
    value?: string | undefined;
    onChange?: ((value: string) => void) | undefined;
    onBlur?: (() => void) | undefined;
    onFocus?: (() => void) | undefined;
    disabled?: boolean | undefined;
    label?: React.ReactNode | undefined;
}

let nextRowId = 0;

export function AclEditor(props: AclEditorProps) {
    const t = useTranslations("components.aclEditor");
    const propsOnChange = props.onChange;
    const [rows, setRows] = useState<RowData[]>(() => getRowsFromString(props.value ?? ""));

    const handleRowChange = useCallback(
        (id: number, entry: string) => {
            setRows((prevRows) => {
                const rowIdx = prevRows.findIndex((r) => r.id === id);
                if (rowIdx === -1) {
                    return prevRows;
                }
                const newRows = [...prevRows];
                newRows[rowIdx] = {
                    id,
                    entry,
                };
                propsOnChange?.(convertRowsToString(newRows));
                return newRows;
            });
        },
        [propsOnChange],
    );

    const handleDeleteRow = useCallback(
        (id: number) => {
            setRows((prevRows) => {
                const newRows = prevRows.filter((r) => r.id !== id);
                propsOnChange?.(convertRowsToString(newRows));
                return newRows;
            });
        },
        [propsOnChange],
    );

    const handleAddRow = useCallback(() => {
        setRows((prevRows) => [
            ...prevRows,
            {
                id: nextRowId++,
                entry: "ALLOW",
            },
        ]);
    }, []);

    return (
        <>
            <InputWrapper>
                <InputLabel>{props.label === undefined ? t("defaultTitle") : props.label}</InputLabel>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t("table.headers.action")}</Table.Th>
                            <Table.Th>{t("table.headers.target")}</Table.Th>
                            <Table.Th>{t("table.headers.param")}</Table.Th>
                            <Table.Th />
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {rows.map((row) => (
                            <AclEditorRow
                                key={row.id}
                                entry={row.entry}
                                id={row.id}
                                onChange={handleRowChange}
                                onDelete={handleDeleteRow}
                                onBlur={props.onBlur}
                                onFocus={props.onFocus}
                                disabled={props.disabled}
                            />
                        ))}
                        {/* <AclEditorRow entry="" id={rows.length.toString()} onChange={handleRowChange} onDelete={handleDeleteRow} /> */}
                    </Table.Tbody>
                </Table>
                <Button type="button" preset="add" onClick={handleAddRow} disabled={props.disabled}>
                    {t("addAclEntry")}
                </Button>
            </InputWrapper>
        </>
    );
}

function getRowsFromString(value: string): RowData[] {
    return [...value.split("\n").filter((row) => row.trim().length > 0), "ALLOW"].map((entry) => ({
        id: nextRowId++,
        entry,
    }));
}

function convertRowsToString(rows: RowData[]): string {
    const res = rows
        .map((r) => r.entry.trim())
        .filter((rawEntry) => {
            const entry = rawEntry;
            if (entry.length === 0) {
                return false;
            }
            const [action, target] = entry.split(" ");
            if (action === undefined || target === undefined || action.trim().length === 0 || target.trim().length === 0) {
                return false;
            }
            return true;
        })
        .join("\n");
    return res;
}

interface RowData {
    id: number;
    entry: string;
}
