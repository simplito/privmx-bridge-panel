import { modals } from "@mantine/modals";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback } from "react";
import { useTranslations } from "use-intl";
import { Deferred } from "@/utils/Deferred";
import { EditContextUserModalContent } from "./EditContextUserModalContent";

export async function openEditContextUserModal(contextUser: ServerApiTypes.api.context.ContextUser, modalTitle: string) {
    const resultDeferred = new Deferred<{ changed: boolean }>();
    const modalId = `${Math.random().toString(36).substring(2)}-${Date.now()}`;
    const close = () => {
        modals.close(modalId);
    };
    modals.open({
        modalId: modalId,
        size: "calc(min(90%, 1500px))",
        title: modalTitle,
        children: (
            <EditContextUserModalContent
                contextUser={contextUser}
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

export function useOpenEditContextUserModal() {
    const t = useTranslations("features.contextUsers");
    const openEditContextUserModalCallback = useCallback(
        async (contextUser: ServerApiTypes.api.context.ContextUser) => {
            return await openEditContextUserModal(contextUser, t("edit.modalTitle"));
        },
        [t],
    );
    return { openEditContextUserModal: openEditContextUserModalCallback };
}
