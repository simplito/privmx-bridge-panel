import { Modals } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Deferred } from "privmx-components/utils/Deferred";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback } from "react";
import { DeleteContextModalContent } from "./DeleteContextModalContent";

export async function openDeleteContextModal(context: ServerApiTypes.api.context.Context, modalTitle: string) {
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
                <DeleteContextModalContent
                    context={context}
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

export function useOpenDeleteContextModal() {
    const { t } = useI18n("features.contexts");
    const openDeleteContextModalCallback = useCallback(
        async (context: ServerApiTypes.api.context.Context) => {
            return await openDeleteContextModal(context, t("deleteModal.modalTitle"));
        },
        [t],
    );

    return { openDeleteContextModal: openDeleteContextModalCallback };
}
