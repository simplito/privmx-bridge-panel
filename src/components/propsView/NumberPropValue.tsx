import { Text } from "@mantine/core";
import { useFormatter } from "use-intl";
import type { NumberProp } from "./types";

export interface NumberPropValueProps {
    prop: NumberProp;
}

export function NumberPropValue(props: NumberPropValueProps) {
    const { number: numberFormatter } = useFormatter();
    const numberStr = numberFormatter(props.prop.value, props.prop.formatName);

    return (
        <Text ff={props.prop.useMonospaceFont === true ? "monospace" : "text"}>
            {props.prop.prefix ?? ""}
            {numberStr}
            {props.prop.suffix ?? ""}
        </Text>
    );
}
