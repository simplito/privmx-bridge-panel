import { Modals } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Deferred } from "privmx-components/utils/Deferred";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback } from "react";
import { AddContextShareModalContent } from "./AddContextShareModalContent";

export async function openAddContextShareModal(context: ServerApiTypes.api.context.Context, modalTitle: string) {
    const resultDeferred = new Deferred<{ added: boolean }>();
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
                <AddContextShareModalContent
                    context={context}
                    // eslint-disable-next-line react/jsx-no-bind
                    onResult={(result) => {
                        resultDeferred.resolve({ added: result.result === "added" });
                        close();
                    }}
                />
            ),
            onAction: () => {
                resultDeferred.resolve({ added: false });
            },
        },
    );
    return await resultDeferred.promise;
}

export function useOpenAddContextShareModal() {
    const { t } = useI18n("features.contextShares");
    const openAddContextShareModalCallback = useCallback(
        async (context: ServerApiTypes.api.context.Context) => {
            return await openAddContextShareModal(context, t("add.modalTitle"));
        },
        [t],
    );

    return { openAddContextShareModal: openAddContextShareModalCallback };
}
