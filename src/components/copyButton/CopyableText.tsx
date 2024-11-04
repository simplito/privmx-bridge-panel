import { ActionIcon, Anchor, Center, Group, Text, Tooltip } from "@mantine/core";
import { useTranslations } from "use-intl";
import { Icon } from "../atoms/Icon";
import { Button } from "../button/Button";
import { MiniCopyButton } from "./MiniCopyButton";

export interface CopyableTextProps {
    text: string;
    monospace?: boolean | undefined;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | undefined;
    isIdLike?: boolean | undefined;
    isExternalLink?: boolean | undefined;
    withMailtoButton?: boolean | undefined;
    allowWrapElements?: boolean | undefined;
    allowBreakAnywhere?: boolean | undefined;
}

export function CopyableText(props: CopyableTextProps) {
    const t = useTranslations();

    return (
        <Group gap="xs" wrap={props.allowWrapElements === true ? undefined : "nowrap"}>
            {props.text !== "" && (
                <>
                    {props.withMailtoButton === true ? (
                        <Tooltip label={t("sendEmail")}>
                            <Anchor href={`mailto:${props.text}`}>
                                <Center>
                                    <ActionIcon variant="transparent">
                                        <Icon name="mail" />
                                    </ActionIcon>
                                </Center>
                            </Anchor>
                        </Tooltip>
                    ) : null}
                    <MiniCopyButton value={props.text} />
                    <Text
                        size={props.size ?? (props.isIdLike === true ? "sm" : "md")}
                        ff={props.monospace === true || props.isIdLike === true ? "mono" : "text"}
                        style={{
                            wordBreak: props.allowBreakAnywhere === true ? "break-all" : undefined,
                        }}
                    >
                        {props.isExternalLink === true ? <Button type="linkExternal" href={props.text} /> : props.text}
                    </Text>
                </>
            )}
        </Group>
    );
}
