import { type MantineSize, Text } from "@mantine/core";
import { useTranslations } from "use-intl";

export interface NoneTextProps {
    inline?: boolean | undefined;
    size?: MantineSize | (string & {});
    customMessage?: React.ReactNode | undefined;
}

export function NoneText(props: NoneTextProps) {
    const t = useTranslations("components.noneText");

    return (
        <Text c="dimmed" fs="italic" size={props.size} component={props.inline === true ? "span" : "p"}>
            {typeof props.customMessage === "string" ? props.customMessage : t("none")}
        </Text>
    );
}
