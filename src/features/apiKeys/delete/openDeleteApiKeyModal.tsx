import { Modals } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Deferred } from "privmx-components/utils/Deferred";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback } from "react";
import { DeleteApiKeyModalContent } from "./DeleteApiKeyModalContent";

export async function openDeleteApiKeyModal(apiKey: ServerApiTypes.api.manager.ApiKey, modalTitle: string) {
    const resultDeferred = new Deferred<{ deleted: boolean }>();
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
                <DeleteApiKeyModalContent
                    apiKey={apiKey}
                    // eslint-disable-next-line react/jsx-no-bind
                    onResult={(result) => {
                        resultDeferred.resolve({ deleted: result === "deleted" });
                        close();
                    }}
                />
            ),
            onAction: () => {
                resultDeferred.resolve({ deleted: false });
            },
        },
    );
    return await resultDeferred.promise;
}

export function useOpenDeleteApiKeyModal() {
    const { t } = useI18n("features.apiKeys");
    const openDeleteApiKeyModalCallback = useCallback(
        async (apiKey: ServerApiTypes.api.manager.ApiKey) => {
            return await openDeleteApiKeyModal(apiKey, t("deleteModal.modalTitle"));
        },
        [t],
    );

    return { openDeleteApiKeyModal: openDeleteApiKeyModalCallback };
}
