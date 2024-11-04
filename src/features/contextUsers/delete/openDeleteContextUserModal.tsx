import { modals } from "@mantine/modals";
import { useCallback } from "react";
import { useTranslations } from "use-intl";
import type { ContextUserEx } from "@/privMxBridgeApi/types";
import { Deferred } from "@/utils/Deferred";
import { DeleteContextUserModalContent } from "./DeleteContextUserModalContent";

export async function openDeleteContextUserModal(contextUserEx: ContextUserEx, modalTitle: string) {
    const resultDeferred = new Deferred<{ deleted: boolean }>();
    const modalId = `${Math.random().toString(36).substring(2)}-${Date.now()}`;
    const close = () => {
        modals.close(modalId);
    };
    modals.open({
        modalId: modalId,
        size: "lg",
        title: modalTitle,
        children: (
            <DeleteContextUserModalContent
                contextUserEx={contextUserEx}
                // eslint-disable-next-line react/jsx-no-bind
                onResult={(result) => {
                    resultDeferred.resolve({ deleted: result === "deleted" });
                    close();
                }}
            />
        ),
        onClose: () => {
            resultDeferred.resolve({ deleted: false });
        },
    });
    return await resultDeferred.promise;
}

export function useOpenDeleteContextUserModal() {
    const t = useTranslations("features.contextUsers");
    const openDeleteContextUserModalCallback = useCallback(
        async (contextUserEx: ContextUserEx) => {
            return await openDeleteContextUserModal(contextUserEx, t("deleteModal.modalTitle"));
        },
        [t],
    );

    return { openDeleteContextUserModal: openDeleteContextUserModalCallback };
}
