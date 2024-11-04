import { modals } from "@mantine/modals";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback } from "react";
import { useTranslations } from "use-intl";
import { Deferred } from "@/utils/Deferred";
import { CreateContextModalContent } from "./CreateContextModalContent";

export async function openCreateContextModal(solutionId: ServerApiTypes.types.cloud.SolutionId, modalTitle: string) {
    const resultDeferred = new Deferred<{ created: boolean }>();
    const modalId = `${Math.random().toString(36).substring(2)}-${Date.now()}`;
    const close = () => {
        modals.close(modalId);
    };
    modals.open({
        modalId: modalId,
        size: "xl",
        title: modalTitle,
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
        onClose: () => {
            resultDeferred.resolve({ created: false });
        },
    });
    return await resultDeferred.promise;
}

export function useOpenCreateContextModal() {
    const t = useTranslations("features.contexts");
    const openCreateContextModalCallback = useCallback(
        async (solutionId: ServerApiTypes.types.cloud.SolutionId) => {
            return await openCreateContextModal(solutionId, t("create.modalTitle"));
        },
        [t],
    );

    return { openCreateContextModal: openCreateContextModalCallback };
}
