import type { CrudTableHeader } from "privmx-components/components/index";
import { BooleanValue, CopyableText, CrudTableCell, DateTimeText } from "privmx-components/components/index";
import { I18nDateTimeFormatName } from "privmx-components/i18n/formats/i18nDateTimeFormats";
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
        id: "enabled",
        width: 100,
    },
    {
        id: "created",
        width: 200,
    },
] as const satisfies CrudTableHeader[];

export interface ApiKeyRowProps {
    entry: ServerApiTypes.api.manager.ApiKey;
}

export function ApiKeyRow(props: ApiKeyRowProps) {
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
                <BooleanValue value={entry.enabled} size="sm" />
            </CrudTableCell>
            <CrudTableCell>
                <DateTimeText timestamp={entry.created} formatName={I18nDateTimeFormatName.DmyHm} size="sm" />
            </CrudTableCell>
        </>
    );
}
