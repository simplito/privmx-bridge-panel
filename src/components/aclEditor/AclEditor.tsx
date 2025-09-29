import { Button, Center, type FormFieldContextData, FormFieldContextProvider, FormFieldError, FormFieldLabel } from "privmx-components/components/index";
import { useUniqueId } from "privmx-components/hooks/useUniqueId";
import { useI18n } from "privmx-components/i18n/useI18n";
import { useCallback, useMemo, useState } from "react";
import { AclEditorRow } from "./AclEditorRow";
import styles from "./AclEditor.module.scss";

export interface AclEditorProps {
    value?: string | undefined;
    onChange?: ((value: string) => void) | undefined;
    onFocus?: ((event: React.FocusEvent<HTMLElement>) => void) | undefined;
    onBlur?: ((event: React.FocusEvent<HTMLElement>) => void) | undefined;
    disabled?: boolean | undefined;
    label?: React.ReactNode | undefined;
    error?: React.ReactNode | undefined;
}

let nextRowId = 0;

export function AclEditor(props: AclEditorProps) {
    const { t } = useI18n("components.aclEditor");
    const { t: tFormErrors } = useI18n("forms.validation");
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

    const error = props.error === undefined ? undefined : convertRowsToString(rows) === "" ? tFormErrors("required") : props.error;
    const id = useUniqueId();

    const formFieldContextData: FormFieldContextData = useMemo(
        () => ({
            errorElementId: `form-field-${id}-error`,
            hasError: props.error !== undefined,
            isRequired: false,
            labelElementId: props.label === undefined ? undefined : `form-field-${id}-label`,
        }),
        [id, props.error, props.label],
    );

    return (
        <>
            <FormFieldContextProvider formFieldContextData={formFieldContextData}>
                <FormFieldLabel>{props.label === undefined ? t("defaultTitle") : props.label}</FormFieldLabel>
                {error !== undefined && <FormFieldError>{error}</FormFieldError>}
                <table className={styles["table"]}>
                    <thead>
                        <tr>
                            <th style={{ width: "30%" }}>{t("table.headers.action")}</th>
                            <th style={{ width: "30%" }}>{t("table.headers.target")}</th>
                            <th style={{ width: "30%" }}>{t("table.headers.param")}</th>
                            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                            <th />
                        </tr>
                    </thead>
                    <tbody>
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
                    </tbody>
                </table>
                <Center>
                    <Button type="button" preset="add" onClick={handleAddRow} disabled={props.disabled}>
                        {t("addAclEntry")}
                    </Button>
                </Center>
            </FormFieldContextProvider>
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
