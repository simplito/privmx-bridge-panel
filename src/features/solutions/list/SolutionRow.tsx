import type * as ServerApiTypes from "privmx-server-api";
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
        id: "created",
        width: 200,
    },
] as const satisfies CrudTableHeader[];

export interface SolutionRowProps {
    entry: ServerApiTypes.api.solution.Solution;
}

export function SolutionRow(props: SolutionRowProps) {
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
                <DateTimeText timestamp={entry.created} formatName={I18nDateTimeFormatName.DmyHm} size="sm" />
            </CrudTableCell>
        </>
    );
}
