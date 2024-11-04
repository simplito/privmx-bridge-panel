import { Table } from "@mantine/core";

export type CrudTableCellProps = React.PropsWithChildren;

export function CrudTableCell(props: CrudTableCellProps) {
    return <Table.Td>{props.children}</Table.Td>;
}
