import { Modals } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Deferred } from "privmx-components/utils/Deferred";
import { useCallback } from "react";
import { type ContextUserForDeletion, DeleteContextUserModalContent } from "./DeleteContextUserModalContent";

export async function openDeleteContextUserModal(contextUserForDeletion: ContextUserForDeletion, modalTitle: string) {
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
                <DeleteContextUserModalContent
                    contextUserForDeletion={contextUserForDeletion}
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

export function useOpenDeleteContextUserModal() {
    const { t } = useI18n("features.contextUsers");
    const openDeleteContextUserModalCallback = useCallback(
        async (contextUserForDeletion: ContextUserForDeletion) => {
            return await openDeleteContextUserModal(contextUserForDeletion, t("deleteModal.modalTitle"));
        },
        [t],
    );

    return { openDeleteContextUserModal: openDeleteContextUserModalCallback };
}
