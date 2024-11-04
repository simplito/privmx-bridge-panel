import { ActionIcon, Group, Text, Tooltip } from "@mantine/core";
import { useCallback, useState } from "react";
import { useTranslations } from "use-intl";
import { MiniCopyButton } from "../copyButton/MiniCopyButton";
import { Icon } from "./Icon";

export interface SecretViewerProps {
    secret: string;
    allowWrapElements?: boolean | undefined;
    allowBreakAnywhere?: boolean | undefined;
}

export function SecretViewer(props: SecretViewerProps) {
    const t = useTranslations();
    const [isSecretVisible, setIsSecretVisible] = useState(false);
    const handleSecretVisibilityClick = useCallback(() => {
        setIsSecretVisible((prev) => !prev);
    }, []);

    return (
        <Group gap="xs" wrap={props.allowWrapElements === true ? undefined : "nowrap"}>
            <Tooltip label={isSecretVisible ? t("hide") : t("show")}>
                <ActionIcon variant="transparent" onClick={handleSecretVisibilityClick}>
                    {isSecretVisible ? <Icon name="hideSecret" /> : <Icon name="viewSecret" />}
                </ActionIcon>
            </Tooltip>
            <MiniCopyButton value={props.secret} />
            <Text style={{ fontFamily: "monospace", wordBreak: props.allowBreakAnywhere === true ? "break-all" : undefined }} size="sm">
                {isSecretVisible ? props.secret : props.secret.replace(/./gu, "*")}
            </Text>
        </Group>
    );
}
