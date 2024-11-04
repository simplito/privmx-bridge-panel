import type { AllI18nMessages } from "./i18n/loadAllI18nMessages";

declare global {
    interface IntlMessages extends AllI18nMessages {}
}
