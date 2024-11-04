import { ActionIcon, MenuItem, Tooltip } from "@mantine/core";
import { useCallback } from "react";

export interface CrudTableRowActionData<TEntry> {
    id: string;
    tooltip: string;
    icon: React.ReactNode;
    onClick: (entry: TEntry) => unknown;
    isAvailableForEntry?: (entry: TEntry) => boolean;
    isSeparate?: boolean;
}

export interface CrudTableRowActionProps<TEntry> {
    row: TEntry;
    action: CrudTableRowActionData<TEntry>;
    isMenuItem?: boolean;
}

export function CrudTableRowAction<TEntry>(props: CrudTableRowActionProps<TEntry>) {
    const propsActionOnClick = props.action.onClick;
    const handleClick = useCallback(() => {
        propsActionOnClick(props.row);
    }, [propsActionOnClick, props.row]);

    if (props.action.isAvailableForEntry && !props.action.isAvailableForEntry(props.row)) {
        return <></>;
    }

    if (props.isMenuItem === true) {
        return (
            <MenuItem key={props.action.id} leftSection={props.action.icon} onClick={handleClick}>
                {props.action.tooltip}
            </MenuItem>
        );
    }

    return (
        <Tooltip label={props.action.tooltip}>
            <ActionIcon variant="transparent" onClick={handleClick}>
                {props.action.icon}
            </ActionIcon>
        </Tooltip>
    );
}
