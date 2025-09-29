import { Modals } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Deferred } from "privmx-components/utils/Deferred";
import { useCallback } from "react";
import type { ContextShare } from "@/privMxBridgeApi/types";
import { RemoveContextShareModalContent } from "./RemoveContextShareModalContent";

export async function openRemoveContextShareModal(contextShare: ContextShare, modalTitle: string) {
    const resultDeferred = new Deferred<{ removed: boolean }>();
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
                <RemoveContextShareModalContent
                    contextShare={contextShare}
                    // eslint-disable-next-line react/jsx-no-bind
                    onResult={(result) => {
                        resultDeferred.resolve({ removed: result === "removed" });
                        close();
                    }}
                />
            ),
            onAction: () => {
                resultDeferred.resolve({ removed: false });
            },
        },
    );
    return await resultDeferred.promise;
}

export function useOpenRemoveContextShareModal() {
    const { t } = useI18n("features.contextShares");
    const openRemoveContextShareModalCallback = useCallback(
        async (contextShare: ContextShare) => {
            return await openRemoveContextShareModal(contextShare, t("remove.modalTitle"));
        },
        [t],
    );

    return { openRemoveContextShareModal: openRemoveContextShareModalCallback };
}
