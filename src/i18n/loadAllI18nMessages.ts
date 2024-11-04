/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/naming-convention */
import type { I18nLocale } from "./i18nConfig";
import * as root_translations from "./translations/en.json";
import * as components_aclEditor_translations from "../components/aclEditor/translations/en.json";
import * as components_apiFormInputs_translations from "../components/apiFormInputs/translations/en.json";
import * as components_apiScopesEditor_translations from "../components/apiScopesEditor/translations/en.json";
import * as components_copyButton_translations from "../components/copyButton/translations/en.json";
import * as components_noneText_translations from "../components/noneText/translations/en.json";
import * as features_auth_signIn_translations from "../features/auth/signIn/translations/en.json";
import * as features_auth_signOut_translations from "../features/auth/signOut/translations/en.json";
import * as features_contexts_translations from "../features/contexts/translations/en.json";
import * as features_contextShares_translations from "../features/contextShares/translations/en.json";
import * as features_contextUsers_translations from "../features/contextUsers/translations/en.json";
import * as features_home_translations from "../features/home/translations/en.json";
import * as features_management_apiKeys_translations from "../features/management/apiKeys/translations/en.json";
import * as features_solutions_translations from "../features/solutions/translations/en.json";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function loadAllI18nMessages(_locale: I18nLocale) {
    // Loading translations by locale will be implemented in the future.

    const allMessages = {
        ...root_translations,
        components: {
            aclEditor: components_aclEditor_translations,
            apiFormInputs: components_apiFormInputs_translations,
            apiScopesEditor: components_apiScopesEditor_translations,
            copyButton: components_copyButton_translations,
            noneText: components_noneText_translations,
        },
        features: {
            auth: {
                signIn: features_auth_signIn_translations,
                signOut: features_auth_signOut_translations,
            },
            contexts: features_contexts_translations,
            contextShares: features_contextShares_translations,
            contextUsers: features_contextUsers_translations,
            home: features_home_translations,
            management: {
                apiKeys: features_management_apiKeys_translations,
            },
            solutions: features_solutions_translations,
        },
        modals: {},
    };

    return allMessages;
}

export type AllI18nMessages = ReturnType<typeof loadAllI18nMessages>;
