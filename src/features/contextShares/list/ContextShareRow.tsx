import type { CrudTableHeader } from "privmx-components/components/index";
import { CopyableText, CrudTableCell, DateTimeText, Text } from "privmx-components/components/index";
import { I18nDateTimeFormatName } from "privmx-components/i18n/formats/i18nDateTimeFormats";
import { useI18n } from "privmx-components/i18n/useI18n";
import type * as ServerApiTypes from "privmx-server-api";

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
    const { t } = useI18n("features.contextShares");

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
