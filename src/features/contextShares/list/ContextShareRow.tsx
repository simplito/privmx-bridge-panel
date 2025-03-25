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
        id: "type",
        width: 100,
    },
    {
        id: "created",
        width: 200,
    },
] as const satisfies CrudTableHeader[];

export interface ContextSolution {
    solution: ServerApiTypes.api.solution.Solution;
    type: "primary" | "share";
}

export interface ContextShareRowProps {
    entry: ContextSolution;
}

export function ContextShareRow(props: ContextShareRowProps) {
    const entry = props.entry;
    const t = useTranslations("features.contextShares");

    return (
        <>
            <CrudTableCell>
                <CopyableText text={entry.solution.id} isIdLike />
            </CrudTableCell>
            <CrudTableCell>
                <CopyableText text={entry.solution.name} />
            </CrudTableCell>
            <CrudTableCell>
                <Text size="sm">{t(`profile.types.${entry.type}`)}</Text>
            </CrudTableCell>
            <CrudTableCell>
                <DateTimeText timestamp={entry.solution.created} formatName={I18nDateTimeFormatName.DmyHm} size="sm" />
            </CrudTableCell>
        </>
    );
}
