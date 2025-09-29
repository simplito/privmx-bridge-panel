import { Modals } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Deferred } from "privmx-components/utils/Deferred";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback } from "react";
import { DeleteSolutionModalContent } from "./DeleteSolutionModalContent";

export async function openDeleteSolutionModal(solution: ServerApiTypes.api.solution.Solution, modalTitle: string) {
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
                <DeleteSolutionModalContent
                    solution={solution}
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

export function useOpenDeleteSolutionModal() {
    const { t } = useI18n("features.solutions");
    const openDeleteSolutionModalCallback = useCallback(
        async (solution: ServerApiTypes.api.solution.Solution) => {
            return await openDeleteSolutionModal(solution, t("deleteModal.modalTitle"));
        },
        [t],
    );

    return { openDeleteSolutionModal: openDeleteSolutionModalCallback };
}
