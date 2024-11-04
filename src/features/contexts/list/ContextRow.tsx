import { Text } from "@mantine/core";
import type * as ServerApiTypes from "privmx-server-api";
import { useTranslations } from "use-intl";
import { DateTimeText } from "@/components/atoms/DateTimeText";
import { CopyableText } from "@/components/copyButton/CopyableText";
import type { CrudTableHeader } from "@/components/crudTable/CrudTable";
import { CrudTableCell } from "@/components/crudTable/CrudTableCell";
import { I18nDateTimeFormatName } from "@/i18n/formats/i18nDateTimeFormats";

export const untranslatedTableHeaders = [
    {
        id: "id",
        width: 200,
    },
    {
        id: "name",
        width: 500,
    },
    {
        id: "scope",
        width: 100,
    },
    {
        id: "sharesCount",
        width: 100,
    },
    {
        id: "created",
        width: 200,
    },
    {
        id: "modified",
        width: 200,
    },
] as const satisfies CrudTableHeader[];

export interface ContextRowProps {
    entry: ServerApiTypes.api.context.Context;
}

export function ContextRow(props: ContextRowProps) {
    const t = useTranslations();
    const entry = props.entry;

    return (
        <>
            <CrudTableCell>
                <CopyableText text={entry.id} isIdLike />
            </CrudTableCell>
            <CrudTableCell>
                <CopyableText text={entry.name} />
            </CrudTableCell>
            <CrudTableCell>
                <Text size="sm">{t(`api.context.scopeShort.${entry.scope}`)}</Text>
            </CrudTableCell>
            <CrudTableCell>
                <Text ff="mono" size="sm">
                    {entry.shares.length}
                </Text>
            </CrudTableCell>
            <CrudTableCell>
                <DateTimeText timestamp={entry.created} formatName={I18nDateTimeFormatName.DmyHm} size="sm" />
            </CrudTableCell>
            <CrudTableCell>
                <DateTimeText timestamp={entry.modified} formatName={I18nDateTimeFormatName.DmyHm} size="sm" />
            </CrudTableCell>
        </>
    );
}
