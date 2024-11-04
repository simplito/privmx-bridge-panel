import { Stack } from "@mantine/core";
import { PropView } from "./PropView";
import type { Prop } from "./types";

export interface PropsViewProps {
    props: Prop[];
}

export function PropsView(props: PropsViewProps) {
    return (
        <Stack gap={0}>
            {props.props.map((prop, idx) => (
                <PropView key={prop.id} prop={prop} hasNext={idx < props.props.length - 1} hasPrev={idx > 0} />
            ))}
        </Stack>
    );
}
