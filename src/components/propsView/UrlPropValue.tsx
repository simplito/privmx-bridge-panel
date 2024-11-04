import { Text } from "@mantine/core";
import { Button } from "../button/Button";
import type { UrlProp } from "./types";

export interface UrlPropValueProps {
    prop: UrlProp;
}

export function UrlPropValue(props: UrlPropValueProps) {
    return (
        <Text style={{ fontFamily: props.prop.useMonospaceFont === true ? "monospace" : undefined }}>
            {props.prop.value ? <Button type="linkExternal" href={props.prop.value} /> : null}
        </Text>
    );
}
