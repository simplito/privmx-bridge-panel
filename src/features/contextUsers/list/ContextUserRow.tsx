import type { CrudTableHeader } from "privmx-components/components/index";
import { CopyableText, CrudTableCell, DateTimeText } from "privmx-components/components/index";
import { I18nDateTimeFormatName } from "privmx-components/i18n/formats/i18nDateTimeFormats";
import type * as ServerApiTypes from "privmx-server-api";

export const untranslatedTableHeaders = [
    {
        id: "id",
        width: 200,
    },
    {
        id: "pubKey",
        width: 500,
    },
    {
        id: "created",
        width: 200,
    },
] as const satisfies CrudTableHeader[];

export interface ContextUserRowProps {
    entry: ServerApiTypes.api.context.ContextUser;
}

export function ContextUserRow(props: ContextUserRowProps) {
    const entry = props.entry;

    return (
        <>
            <CrudTableCell>
                <CopyableText text={entry.userId} isIdLike />
            </CrudTableCell>
            <CrudTableCell>
                <CopyableText text={entry.pubKey} isIdLike />
            </CrudTableCell>
            <CrudTableCell>
                <DateTimeText timestamp={entry.created} formatName={I18nDateTimeFormatName.DmyHm} size="sm" />
            </CrudTableCell>
        </>
    );
}
