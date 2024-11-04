import { Group, Text } from "@mantine/core";
import { useTranslations } from "use-intl";
import type { CustomColor } from "../rootAppLayout/mantineTheme";
import { Icon } from "./Icon";

export interface BooleanValueProps {
    // eslint-disable-next-line react/boolean-prop-naming
    value: boolean;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | undefined;
    yesColor?: CustomColor | undefined;
    noColor?: CustomColor | undefined;
}

export function BooleanValue(props: BooleanValueProps) {
    const t = useTranslations();
    const yesColor = props.yesColor ?? "success";
    const noColor = props.noColor ?? "error";

    return (
        <Group gap="xs">
            {props.value ? (
                <Text c={yesColor} mt={5} size={props.size}>
                    <Icon name="yes" />
                </Text>
            ) : (
                <Text c={noColor} mt={5} size={props.size}>
                    <Icon name="no" />
                </Text>
            )}
            <Text c={props.value ? yesColor : noColor} fw="bolder" size={props.size}>
                {props.value ? t("yes") : t("no")}
            </Text>
        </Group>
    );
}
