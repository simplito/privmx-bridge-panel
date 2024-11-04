import { modals } from "@mantine/modals";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback } from "react";
import { useTranslations } from "use-intl";
import { Deferred } from "@/utils/Deferred";
import { CreateContextUserModalContent } from "./CreateContextUserModalContent";

export async function openCreateContextUserModal(context: ServerApiTypes.api.context.Context, modalTitle: string) {
    const resultDeferred = new Deferred<{ created: boolean }>();
    const modalId = `${Math.random().toString(36).substring(2)}-${Date.now()}`;
    const close = () => {
        modals.close(modalId);
    };
    modals.open({
        modalId: modalId,
        size: "calc(min(90%, 1500px))",
        title: modalTitle,
        children: (
            <CreateContextUserModalContent
                context={context}
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

export function useOpenCreateContextUserModal() {
    const t = useTranslations("features.contextUsers");
    const openCreateContextUserModalCallback = useCallback(
        async (context: ServerApiTypes.api.context.Context) => {
            return await openCreateContextUserModal(context, t("create.modalTitle"));
        },
        [t],
    );

    return { openCreateContextUserModal: openCreateContextUserModalCallback };
}
