import { Modals } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Deferred } from "privmx-components/utils/Deferred";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback } from "react";
import { EditApiKeyModalContent } from "./EditApiKeyModalContent";

export async function openEditApiKeyModal(apiKey: ServerApiTypes.api.manager.ApiKey, modalTitle: string) {
    const resultDeferred = new Deferred<{ changed: boolean }>();
    const modalId = `${Math.random().toString(36).substring(2)}-${Date.now()}`;
    const close = () => {
        Modals.closeModal(modalId);
    };
    Modals.showModal(
        {
            modalId: modalId,
        },
        {
            title: modalTitle,
            width: "lg",
            height: "auto",
            withCloseButton: true,
            observeBackdropClicks: true,
            observeEscapeKey: true,
            children: (
                <EditApiKeyModalContent
                    apiKey={apiKey}
                    // eslint-disable-next-line react/jsx-no-bind
                    onResult={(result) => {
                        resultDeferred.resolve({ changed: result.result === "changed" });
                        close();
                    }}
                />
            ),
            onAction: () => {
                resultDeferred.resolve({ changed: false });
            },
        },
    );
    return await resultDeferred.promise;
}

export function useOpenEditApiKeyModal() {
    const { t } = useI18n("features.apiKeys");
    const openEditApiKeyModalCallback = useCallback(
        async (apiKey: ServerApiTypes.api.manager.ApiKey) => {
            return await openEditApiKeyModal(apiKey, t("edit.modalTitle"));
        },
        [t],
    );
    return { openEditApiKeyModal: openEditApiKeyModalCallback };
}
