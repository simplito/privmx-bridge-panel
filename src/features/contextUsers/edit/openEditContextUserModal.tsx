import { Modals } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Deferred } from "privmx-components/utils/Deferred";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback } from "react";
import { EditContextUserModalContent } from "./EditContextUserModalContent";

export async function openEditContextUserModal(contextUser: ServerApiTypes.api.context.ContextUser, modalTitle: string) {
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
            width: "calc(min(90%, 1500px))",
            height: "auto",
            withCloseButton: true,
            observeBackdropClicks: true,
            observeEscapeKey: true,
            children: (
                <EditContextUserModalContent
                    contextUser={contextUser}
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

export function useOpenEditContextUserModal() {
    const { t } = useI18n("features.contextUsers");
    const openEditContextUserModalCallback = useCallback(
        async (contextUser: ServerApiTypes.api.context.ContextUser) => {
            return await openEditContextUserModal(contextUser, t("edit.modalTitle"));
        },
        [t],
    );
    return { openEditContextUserModal: openEditContextUserModalCallback };
}
