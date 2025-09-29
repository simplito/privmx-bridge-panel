import { Modals } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Deferred } from "privmx-components/utils/Deferred";
import { useCallback } from "react";
import { CreateApiKeyModalContent } from "./CreateApiKeyModalContent";

export async function openCreateApiKeyModal(modalTitle: string) {
    const resultDeferred = new Deferred<{ created: boolean }>();
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
            width: "xl",
            height: "auto",
            withCloseButton: true,
            observeBackdropClicks: true,
            observeEscapeKey: true,
            children: (
                <CreateApiKeyModalContent
                    // eslint-disable-next-line react/jsx-no-bind
                    onResult={(result) => {
                        resultDeferred.resolve({ created: result.result === "created" });
                        close();
                    }}
                />
            ),
            onAction: () => {
                resultDeferred.resolve({ created: false });
            },
        },
    );
    return await resultDeferred.promise;
}

export function useOpenCreateApiKeyModal() {
    const { t } = useI18n("features.apiKeys");
    const openCreateApiKeyModalCallback = useCallback(async () => {
        return await openCreateApiKeyModal(t("create.modalTitle"));
    }, [t]);

    return { openCreateApiKeyModal: openCreateApiKeyModalCallback };
}
