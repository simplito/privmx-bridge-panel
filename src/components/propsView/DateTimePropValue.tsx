import { I18nDateTimeFormatName } from "@/i18n/formats/i18nDateTimeFormats";
import { DateTimeText } from "../atoms/DateTimeText";
import type { DateTimeProp } from "./types";

export interface DateTimePropValueProps {
    prop: DateTimeProp;
}

export function DateTimePropValue(props: DateTimePropValueProps) {
    return (
        <DateTimeText
            style={{ fontFamily: props.prop.useMonospaceFont === true ? "monospace" : undefined }}
            timestamp={props.prop.value}
            formatName={props.prop.formatName ?? I18nDateTimeFormatName.DmyHm}
        />
    );
}
