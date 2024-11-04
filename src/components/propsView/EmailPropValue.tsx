import { Anchor, Center, Group, Text, Tooltip } from "@mantine/core";
import { useTranslations } from "use-intl";
import { Icon } from "../atoms/Icon";
import type { EmailProp } from "./types";

export interface EmailPropValueProps {
    prop: EmailProp;
}

export function EmailPropValue(props: EmailPropValueProps) {
    const t = useTranslations();

    return (
        <Group gap="xs">
            {props.prop.value ? (
                <>
                    <Text style={{ fontFamily: props.prop.useMonospaceFont === true ? "monospace" : undefined }}>{props.prop.value}</Text>
                    <Tooltip label={t("sendEmail")}>
                        <Anchor href={`mailto:${props.prop.value}`}>
                            <Center>
                                <Icon name="mail" />
                            </Center>
                        </Anchor>
                    </Tooltip>
                </>
            ) : null}
        </Group>
    );
}
