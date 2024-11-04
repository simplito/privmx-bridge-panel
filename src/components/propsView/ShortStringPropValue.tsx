import { Text } from "@mantine/core";
import type { ShortStringProp } from "./types";

export interface ShortStringPropValueProps {
    prop: ShortStringProp;
}

export function ShortStringPropValue(props: ShortStringPropValueProps) {
    return <Text style={{ fontFamily: props.prop.useMonospaceFont === true ? "monospace" : undefined }}>{props.prop.value}</Text>;
}
