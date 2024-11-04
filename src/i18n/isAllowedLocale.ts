import { type I18nLocale, i18nConfig } from "./i18nConfig";

export function isAllowedLocale(locale: string): locale is I18nLocale {
    return i18nConfig.availableLocales.includes(locale as I18nLocale);
}
