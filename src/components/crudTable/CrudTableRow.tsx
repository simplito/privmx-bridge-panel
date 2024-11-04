import { ActionIcon, Menu, MenuDropdown, MenuTarget, Table } from "@mantine/core";
import { useCallback } from "react";
import { DomUtils } from "@/utils/DomUtils";
import { Icon } from "../atoms/Icon";
import { CrudTableRowAction } from "./CrudTableRowAction";
import type { CrudTableRowActionData } from "./CrudTableRowAction";

export interface CrudTableRowProps<TEntry> {
    row: TEntry;
    rowComponent: React.ComponentType<{ entry: TEntry }>;
    actions: Array<CrudTableRowActionData<TEntry>>;
    onClick?: ((entry: TEntry) => void) | undefined;
}

export function CrudTableRow<TEntry>(props: CrudTableRowProps<TEntry>) {
    const RowComponent = props.rowComponent;
    const propsOnClick = props.onClick;
    const isClickable = propsOnClick !== undefined;
    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLTableRowElement>) => {
            if (
                event.target instanceof Node &&
                (DomUtils.doesNodeHaveOwnDefaultClickBehavior(event.target) || DomUtils.hasAncestorWithOwnDefaultClickBehavior(event.target, "td"))
            ) {
                return;
            }
            propsOnClick?.(props.row);
        },
        [propsOnClick, props.row],
    );
    const hasNonSeparateActions = props.actions.some(
        (action) => action.isSeparate !== true && (action.isAvailableForEntry ? action.isAvailableForEntry(props.row) : true),
    );

    return (
        <Table.Tr onClick={handleClick} className={isClickable ? "pmx-Table-row-clickable" : ""}>
            <RowComponent entry={props.row} />
            {props.actions.length > 0 && (
                <Table.Td>
                    {props.actions.map((action) =>
                        action.isSeparate === true ? <CrudTableRowAction key={action.id} row={props.row} action={action} /> : null,
                    )}
                    {hasNonSeparateActions ? (
                        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                        <div style={{ display: "inline-block" }} onMouseDown={handleStopPropagation}>
                            <Menu>
                                <MenuTarget>
                                    <ActionIcon variant="transparent">
                                        <Icon name="dotMenu" />
                                    </ActionIcon>
                                </MenuTarget>
                                <MenuDropdown>
                                    {props.actions.map((action) =>
                                        action.isSeparate === true ? null : <CrudTableRowAction key={action.id} row={props.row} action={action} isMenuItem />,
                                    )}
                                </MenuDropdown>
                            </Menu>
                        </div>
                    ) : null}
                </Table.Td>
            )}
        </Table.Tr>
    );
}

const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
};
