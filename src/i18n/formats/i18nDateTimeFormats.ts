export type I18nDateTimeClockType = "12h" | "24h" | "auto";

export enum I18nDateTimeFormatName {
    // Only date
    Dmy = "dmy",

    // Only time
    Hm = "hm",
    Hms = "hms",

    // Date and time
    DmyHm = "dmyHm",
    DmyHms = "dmyHms",
}

export const i18nDateTimeFormats = {
    [I18nDateTimeFormatName.Dmy]: {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    },
    [I18nDateTimeFormatName.Hm]: {
        hour: "2-digit",
        minute: "2-digit",
    },
    [I18nDateTimeFormatName.Hms]: {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    },
    [I18nDateTimeFormatName.DmyHm]: {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    },
    [I18nDateTimeFormatName.DmyHms]: {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    },
} satisfies Record<I18nDateTimeFormatName, Intl.DateTimeFormatOptions>;
