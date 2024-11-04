import { modals } from "@mantine/modals";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback } from "react";
import { useTranslations } from "use-intl";
import { Deferred } from "@/utils/Deferred";
import { EditContextModalContent } from "./EditContextModalContent";

export async function openEditContextModal(context: ServerApiTypes.api.context.Context, modalTitle: string) {
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
            <EditContextModalContent
                context={context}
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

export function useOpenEditContextModal() {
    const t = useTranslations("features.contexts");
    const openEditContextModalCallback = useCallback(
        async (context: ServerApiTypes.api.context.Context) => {
            return await openEditContextModal(context, t("edit.modalTitle"));
        },
        [t],
    );
    return { openEditContextModal: openEditContextModalCallback };
}
