import { modals } from "@mantine/modals";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback } from "react";
import { useTranslations } from "use-intl";
import { Deferred } from "@/utils/Deferred";
import { DeleteSolutionModalContent } from "./DeleteSolutionModalContent";

export async function openDeleteSolutionModal(solution: ServerApiTypes.api.solution.Solution, modalTitle: string) {
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
            <DeleteSolutionModalContent
                solution={solution}
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

export function useOpenDeleteSolutionModal() {
    const t = useTranslations("features.solutions");
    const openDeleteSolutionModalCallback = useCallback(
        async (solution: ServerApiTypes.api.solution.Solution) => {
            return await openDeleteSolutionModal(solution, t("deleteModal.modalTitle"));
        },
        [t],
    );

    return { openDeleteSolutionModal: openDeleteSolutionModalCallback };
}
