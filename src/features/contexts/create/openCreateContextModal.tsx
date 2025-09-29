import { Modals } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Deferred } from "privmx-components/utils/Deferred";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback } from "react";
import { CreateContextModalContent } from "./CreateContextModalContent";

export async function openCreateContextModal(solutionId: ServerApiTypes.types.cloud.SolutionId | null, modalTitle: string) {
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
                <CreateContextModalContent
                    solutionId={solutionId}
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

export function useOpenCreateContextModal() {
    const { t } = useI18n("features.contexts");
    const openCreateContextModalCallback = useCallback(
        async (solutionId: ServerApiTypes.types.cloud.SolutionId | null) => {
            return await openCreateContextModal(solutionId, t("create.modalTitle"));
        },
        [t],
    );

    return { openCreateContextModal: openCreateContextModalCallback };
}
