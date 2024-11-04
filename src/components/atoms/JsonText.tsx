import { type MantineLineHeight, type MantineSize, type MantineSpacing, Text as MantineText, ScrollArea, Stack, type StyleProp } from "@mantine/core";
import { CopyButton } from "../copyButton/CopyButton";

export interface JsonTextProps {
    data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    size?: MantineSize | (string & {}) | undefined;
    component?: "p" | "div" | undefined;
    lh?: StyleProp<MantineLineHeight | number | (string & {})>;
    fw?: StyleProp<React.CSSProperties["fontWeight"]> | undefined;
    fs?: StyleProp<React.CSSProperties["fontStyle"]>;
    mx?: StyleProp<MantineSpacing> | undefined;
    my?: StyleProp<MantineSpacing> | undefined;
    px?: StyleProp<MantineSpacing> | undefined;
    py?: StyleProp<MantineSpacing> | undefined;
    style?: React.CSSProperties | undefined;
    withCopyButton?: boolean | undefined;
}

export function JsonText(props: JsonTextProps) {
    const jsonStr = JSON.stringify(props.data, undefined, "    ");
    return (
        <Stack gap="md" style={props.style}>
            {props.withCopyButton === true && jsonStr.length > 0 ? <CopyButton value={jsonStr} /> : null}
            <ScrollArea>
                <MantineText
                    size={props.size}
                    component={props.component}
                    lh={props.lh}
                    fw={props.fw}
                    fs={props.fs}
                    mx={props.mx}
                    my={props.my}
                    px={props.px}
                    py={props.py}
                    style={{ whiteSpace: "pre" }}
                >
                    {jsonStr}
                </MantineText>
            </ScrollArea>
        </Stack>
    );
}
