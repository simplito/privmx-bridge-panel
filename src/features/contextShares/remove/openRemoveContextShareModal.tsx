import { modals } from "@mantine/modals";
import { useCallback } from "react";
import { useTranslations } from "use-intl";
import type { ContextShare } from "@/privMxBridgeApi/types";
import { Deferred } from "@/utils/Deferred";
import { RemoveContextShareModalContent } from "./RemoveContextShareModalContent";

export async function openRemoveContextShareModal(contextShare: ContextShare, modalTitle: string) {
    const resultDeferred = new Deferred<{ removed: boolean }>();
    const modalId = `${Math.random().toString(36).substring(2)}-${Date.now()}`;
    const close = () => {
        modals.close(modalId);
    };
    modals.open({
        modalId: modalId,
        size: "lg",
        title: modalTitle,
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
        onClose: () => {
            resultDeferred.resolve({ removed: false });
        },
    });
    return await resultDeferred.promise;
}

export function useOpenRemoveContextShareModal() {
    const t = useTranslations("features.contextShares");
    const openRemoveContextShareModalCallback = useCallback(
        async (contextShare: ContextShare) => {
            return await openRemoveContextShareModal(contextShare, t("remove.modalTitle"));
        },
        [t],
    );

    return { openRemoveContextShareModal: openRemoveContextShareModalCallback };
}
