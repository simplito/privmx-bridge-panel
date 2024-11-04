import { Box, Group, Paper, Stack, Text } from "@mantine/core";
import { useFormatter } from "use-intl";
import { I18nDateTimeFormatName } from "@/i18n/formats/i18nDateTimeFormats";
import { MiniCopyButton } from "../copyButton/MiniCopyButton";
import { colors } from "../rootAppLayout/mantineTheme";
import { BooleanPropValue } from "./BooleanPropValue";
import { DateTimePropValue } from "./DateTimePropValue";
import { EmailPropValue } from "./EmailPropValue";
import { EmptyValueMessage } from "./EmptyValueMessage";
import { LongStringPropValue } from "./LongStringPropValue";
import { NumberPropValue } from "./NumberPropValue";
import { ShortStringPropValue } from "./ShortStringPropValue";
import type { Prop } from "./types";
import { UrlPropValue } from "./UrlPropValue";

const copyButtonLocation: "header" | "content" = "content";

export interface PropView {
    prop: Prop;
    hasPrev?: boolean | undefined;
    hasNext?: boolean | undefined;
}

export function PropView(props: PropView) {
    const { dateTime: dateTimeFormatter } = useFormatter();

    if (props.prop.hidden === true) {
        return null;
    }
    return (
        <Paper
            bg={colors["document/backgrounds/grid"]}
            px="lg"
            py="sm"
            style={{
                ...(props.hasPrev === true ? { borderTopLeftRadius: 0, borderTopRightRadius: 0 } : {}),
                ...(props.hasNext === true ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : {}),
            }}
        >
            <Stack>
                <Group wrap="nowrap">
                    <Group w={200} wrap="nowrap" style={{ alignSelf: "flex-start" }}>
                        <Text fw="bold" size="sm">
                            {props.prop.label}
                        </Text>
                        {copyButtonLocation === "header" && (
                            <>
                                {props.prop.type === "dateTime" && props.prop.value > 0 ? (
                                    <MiniCopyButton value={dateTimeFormatter(props.prop.value, props.prop.formatName ?? I18nDateTimeFormatName.DmyHm)} />
                                ) : props.prop.withCopyButton === true && props.prop.value.toString().length > 0 ? (
                                    <MiniCopyButton value={props.prop.value.toString()} />
                                ) : props.prop.type === "custom" && props.prop.copyableValue !== undefined ? (
                                    <MiniCopyButton value={props.prop.copyableValue} />
                                ) : null}
                            </>
                        )}
                    </Group>
                    <Group gap="xs" wrap="nowrap" align={props.prop.type === "longString" && props.prop.value.includes("\n") ? "flex-start" : "center"}>
                        {copyButtonLocation === "content" && (
                            <>
                                {props.prop.type === "dateTime" && props.prop.value > 0 ? (
                                    <MiniCopyButton value={dateTimeFormatter(props.prop.value, props.prop.formatName ?? I18nDateTimeFormatName.DmyHm)} />
                                ) : props.prop.withCopyButton === true && props.prop.value.toString().length > 0 ? (
                                    <MiniCopyButton value={props.prop.value.toString()} />
                                ) : props.prop.type === "custom" && props.prop.copyableValue !== undefined ? (
                                    <MiniCopyButton value={props.prop.copyableValue} />
                                ) : null}
                            </>
                        )}
                        {props.prop.preLabelNode}
                        {props.prop.type === "shortString" &&
                            (props.prop.value === "" && props.prop.emptyValueMessage !== undefined ? (
                                <EmptyValueMessage message={props.prop.emptyValueMessage} />
                            ) : (
                                <ShortStringPropValue prop={props.prop} />
                            ))}
                        {props.prop.type === "longString" &&
                            (props.prop.value === "" && props.prop.emptyValueMessage !== undefined ? (
                                <EmptyValueMessage message={props.prop.emptyValueMessage} />
                            ) : (
                                <LongStringPropValue prop={props.prop} />
                            ))}
                        {props.prop.type === "email" &&
                            (props.prop.value === "" && props.prop.emptyValueMessage !== undefined ? (
                                <EmptyValueMessage message={props.prop.emptyValueMessage} />
                            ) : (
                                <EmailPropValue prop={props.prop} />
                            ))}
                        {props.prop.type === "url" &&
                            (props.prop.value === "" && props.prop.emptyValueMessage !== undefined ? (
                                <EmptyValueMessage message={props.prop.emptyValueMessage} />
                            ) : (
                                <UrlPropValue prop={props.prop} />
                            ))}
                        {props.prop.type === "boolean" && <BooleanPropValue prop={props.prop} />}
                        {props.prop.type === "number" && <NumberPropValue prop={props.prop} />}
                        {props.prop.type === "dateTime" &&
                            (props.prop.value === 0 && props.prop.emptyValueMessage !== undefined ? (
                                <EmptyValueMessage message={props.prop.emptyValueMessage} />
                            ) : (
                                <DateTimePropValue prop={props.prop} />
                            ))}
                        {props.prop.type === "custom" &&
                            (props.prop.value === null && props.prop.emptyValueMessage !== undefined ? (
                                <EmptyValueMessage message={props.prop.emptyValueMessage} />
                            ) : (
                                props.prop.value
                            ))}
                        {props.prop.postLabelNode}
                    </Group>
                </Group>
            </Stack>
            {props.hasNext === true && <Box h={1} bg={colors["document/backgrounds/grid"]} mt="md" />}
        </Paper>
    );
}
