const availableLocales = ["en"] as const;

export const i18nConfig = {
    availableLocales: availableLocales,
    defaultLocale: "en" as I18nLocale,
} as const;

export type I18nLocale = (typeof availableLocales)[number];
