import type { AllI18nMessages } from "./i18n/loadAllI18nMessages";

declare global {
    interface I18nMessages extends AllI18nMessages {}
}
