import { modals } from "@mantine/modals";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback } from "react";
import { useTranslations } from "use-intl";
import { Deferred } from "@/utils/Deferred";
import { EditSolutionModalContent } from "./EditSolutionModalContent";

export async function openEditSolutionModal(solution: ServerApiTypes.api.solution.Solution, modalTitle: string) {
    const resultDeferred = new Deferred<{ changed: boolean }>();
    const modalId = `${Math.random().toString(36).substring(2)}-${Date.now()}`;
    const close = () => {
        modals.close(modalId);
    };
    modals.open({
        modalId: modalId,
        size: "lg",
        title: modalTitle,
        children: (
            <EditSolutionModalContent
                solution={solution}
                // eslint-disable-next-line react/jsx-no-bind
                onResult={(result) => {
                    resultDeferred.resolve({ changed: result.result === "changed" });
                    close();
                }}
            />
        ),
        onClose: () => {
            resultDeferred.resolve({ changed: false });
        },
    });
    return await resultDeferred.promise;
}

export function useOpenEditSolutionModal() {
    const t = useTranslations("features.solutions");
    const openEditSolutionModalCallback = useCallback(
        async (solution: ServerApiTypes.api.solution.Solution) => {
            return await openEditSolutionModal(solution, t("edit.modalTitle"));
        },
        [t],
    );
    return { openEditSolutionModal: openEditSolutionModalCallback };
}
