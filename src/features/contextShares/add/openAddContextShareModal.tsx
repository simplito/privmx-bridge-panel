import { modals } from "@mantine/modals";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback } from "react";
import { useTranslations } from "use-intl";
import { Deferred } from "@/utils/Deferred";
import { AddContextShareModalContent } from "./AddContextShareModalContent";

export async function openAddContextShareModal(context: ServerApiTypes.api.context.Context, modalTitle: string) {
    const resultDeferred = new Deferred<{ added: boolean }>();
    const modalId = `${Math.random().toString(36).substring(2)}-${Date.now()}`;
    const close = () => {
        modals.close(modalId);
    };
    modals.open({
        modalId: modalId,
        size: "xl",
        title: modalTitle,
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
        onClose: () => {
            resultDeferred.resolve({ added: false });
        },
    });
    return await resultDeferred.promise;
}

export function useOpenAddContextShareModal() {
    const t = useTranslations("features.contextShares");
    const openAddContextShareModalCallback = useCallback(
        async (context: ServerApiTypes.api.context.Context) => {
            return await openAddContextShareModal(context, t("add.modalTitle"));
        },
        [t],
    );

    return { openAddContextShareModal: openAddContextShareModalCallback };
}
