import { modals } from "@mantine/modals";
import { useCallback } from "react";
import { useTranslations } from "use-intl";
import { Deferred } from "@/utils/Deferred";
import { type ContextUserForDeletion, DeleteContextUserModalContent } from "./DeleteContextUserModalContent";

export async function openDeleteContextUserModal(contextUserForDeletion: ContextUserForDeletion, modalTitle: string) {
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
                contextUserForDeletion={contextUserForDeletion}
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
        async (contextUserForDeletion: ContextUserForDeletion) => {
            return await openDeleteContextUserModal(contextUserForDeletion, t("deleteModal.modalTitle"));
        },
        [t],
    );

    return { openDeleteContextUserModal: openDeleteContextUserModalCallback };
}
