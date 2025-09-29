import { Modals } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Deferred } from "privmx-components/utils/Deferred";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback } from "react";
import { CreateContextUserModalContent } from "./CreateContextUserModalContent";

export async function openCreateContextUserModal(context: ServerApiTypes.api.context.Context, modalTitle: string) {
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
            width: "calc(min(90%, 1500px))",
            height: "auto",
            withCloseButton: true,
            observeBackdropClicks: true,
            observeEscapeKey: true,
            children: (
                <CreateContextUserModalContent
                    context={context}
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

export function useOpenCreateContextUserModal() {
    const { t } = useI18n("features.contextUsers");
    const openCreateContextUserModalCallback = useCallback(
        async (context: ServerApiTypes.api.context.Context) => {
            return await openCreateContextUserModal(context, t("create.modalTitle"));
        },
        [t],
    );

    return { openCreateContextUserModal: openCreateContextUserModalCallback };
}
