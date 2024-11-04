import { BooleanValue } from "../atoms/BooleanValue";
import type { BooleanProp } from "./types";

export interface BooleanPropValueProps {
    prop: BooleanProp;
}

export function BooleanPropValue(props: BooleanPropValueProps) {
    return <BooleanValue value={props.prop.value} yesColor={props.prop.yesColor} noColor={props.prop.noColor} />;
}
