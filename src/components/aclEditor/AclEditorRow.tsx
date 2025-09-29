import { Button, Select, TextInput } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { type ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { aclData } from "./aclData";

const noneParamId = "__none__";

export interface AclEditorRowProps {
    id: number;
    entry: string;
    onChange: (id: number, entry: string) => void;
    onDelete: (id: number) => void;
    onFocus?: ((event: React.FocusEvent<HTMLElement>) => void) | undefined;
    onBlur?: ((event: React.FocusEvent<HTMLElement>) => void) | undefined;
    disabled?: boolean | undefined;
}

const aclTargetOptions = aclData.map((group) => ({
    groupLabel: group.id,
    options: [
        { value: `${group.id}#${group.id}`, label: group.id },
        ...group.functions.map((item) => ({
            value: `${group.id}#${item.id}`,
            label: item.id,
        })),
    ],
}));
const groupIds = aclData.map((group) => group.id);
const actionOptions = [
    { value: "ALLOW", label: "ALLOW" },
    { value: "DENY", label: "DENY" },
];

export function AclEditorRow(props: AclEditorRowProps) {
    const propsOnChange = props.onChange;
    const propsOnDelete = props.onDelete;
    const { t } = useI18n("components.aclEditor");
    const [entry, setEntry] = useState(props.entry);
    useEffect(() => {
        setEntry(props.entry);
    }, [props.entry]);

    let [action, target, paramStr] = entry.split(" ");
    if (action === undefined || action === "") {
        action = "ALLOW";
    }
    target ??= "";
    paramStr ??= "";
    let [paramName, paramValue] = paramStr.split("=");
    paramName ??= "";
    paramValue ??= "";
    const [targetFieldGroupId, setTargetFieldGroupId] = useState(groupIds.includes(target) ? target : "ALL");

    const availableParams = useMemo(() => {
        return [
            { value: noneParamId, label: t("table.rows.param.none") },
            ...(aclData
                .find((group) => group.id === targetFieldGroupId)
                ?.functions.find((item) => item.id === target)
                ?.parameters.map((param) => ({ value: param, label: param })) ?? []),
        ];
    }, [targetFieldGroupId, target, t]);

    const handleActionChange = useCallback(
        (value: string | null) => {
            const newEntry = `${value ?? ""} ${target} ${paramStr}`;
            setEntry(newEntry);
            propsOnChange(props.id, newEntry);
        },
        [target, paramStr, propsOnChange, props.id],
    );

    const handleTargetChange = useCallback(
        (value: string | null) => {
            const [groupId, id] = value?.split("#") ?? [];
            const newEntry = `${action} ${id ?? ""} `;
            setEntry(newEntry);
            propsOnChange(props.id, newEntry);
            setTargetFieldGroupId(groupId ?? "ALL");
        },
        [action, propsOnChange, props.id],
    );

    const handleParamNameChange = useCallback(
        (value: string | null) => {
            let newEntry = "";
            if (value === noneParamId) {
                newEntry = `${action} ${target} `;
            } else {
                newEntry = `${action} ${target} ${value ?? ""}=`;
            }
            setEntry(newEntry);
            propsOnChange(props.id, newEntry);
        },
        [action, target, propsOnChange, props.id],
    );

    const handleParamValueChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            const newEntry = `${action} ${target} ${paramName}=${value}`;
            setEntry(newEntry);
            propsOnChange(props.id, newEntry);
        },
        [action, target, paramName, propsOnChange, props.id],
    );

    const handleDeleteClick = useCallback(() => {
        propsOnDelete(props.id);
    }, [props.id, propsOnDelete]);

    return (
        <tr>
            <td valign="top">
                <Select
                    options={actionOptions}
                    value={action}
                    onChange={handleActionChange}
                    onFocus={props.onFocus}
                    onBlur={props.onBlur}
                    disabled={props.disabled}
                />
            </td>
            <td valign="top">
                <Select
                    options={aclTargetOptions}
                    value={`${targetFieldGroupId}#${target}`}
                    onChange={handleTargetChange}
                    onFocus={props.onFocus}
                    onBlur={props.onBlur}
                    disabled={props.disabled}
                />
            </td>
            <td valign="top">
                <Select
                    options={availableParams}
                    value={paramName === "" ? noneParamId : paramName}
                    onChange={handleParamNameChange}
                    onFocus={props.onFocus}
                    onBlur={props.onBlur}
                    disabled={props.disabled}
                />
                <TextInput
                    disabled={paramName === "" || props.disabled}
                    value={paramValue}
                    onChange={handleParamValueChange}
                    placeholder={t("table.rows.param.valuePlaceholder")}
                    onFocus={props.onFocus}
                    onBlur={props.onBlur}
                />
            </td>
            <td valign="top">
                <Button type="button" preset="delete" onlyIcon size="sm" onClick={handleDeleteClick} disabled={props.disabled} />
            </td>
        </tr>
    );
}
