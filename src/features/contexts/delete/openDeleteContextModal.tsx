import { modals } from "@mantine/modals";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback } from "react";
import { useTranslations } from "use-intl";
import { Deferred } from "@/utils/Deferred";
import { DeleteContextModalContent } from "./DeleteContextModalContent";

export async function openDeleteContextModal(context: ServerApiTypes.api.context.Context, modalTitle: string) {
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
            <DeleteContextModalContent
                context={context}
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

export function useOpenDeleteContextModal() {
    const t = useTranslations("features.contexts");
    const openDeleteContextModalCallback = useCallback(
        async (context: ServerApiTypes.api.context.Context) => {
            return await openDeleteContextModal(context, t("deleteModal.modalTitle"));
        },
        [t],
    );

    return { openDeleteContextModal: openDeleteContextModalCallback };
}
