import { Text } from "@mantine/core";
import { useFormatter } from "use-intl";
import type { I18nDateTimeFormatName } from "@/i18n/formats/i18nDateTimeFormats";

export interface DateTimeTextProps {
    timestamp: number;
    formatName: I18nDateTimeFormatName;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | undefined;
    style?: React.CSSProperties | undefined;
}

export function DateTimeText(props: DateTimeTextProps) {
    const { dateTime: dateTimeFormatter } = useFormatter();
    const dateTimeStr = dateTimeFormatter(props.timestamp, props.formatName);

    return (
        <Text span size={props.size} style={props.style}>
            {dateTimeStr}
        </Text>
    );
}
