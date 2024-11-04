import { Spoiler } from "@mantine/core";
import { useTranslations } from "use-intl";
import type { LongStringProp } from "./types";

export interface LongStringPropValueProps {
    prop: LongStringProp;
}

export function LongStringPropValue(props: LongStringPropValueProps) {
    const t = useTranslations();

    return (
        <Spoiler
            style={{ fontFamily: props.prop.useMonospaceFont === true ? "monospace" : undefined, whiteSpace: props.prop.whiteSpace }}
            hideLabel={t("hide")}
            showLabel={t("showMore")}
            maxHeight={120}
            miw={150}
        >
            {props.prop.value}
        </Spoiler>
    );
}
