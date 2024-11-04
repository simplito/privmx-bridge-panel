import { modals } from "@mantine/modals";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback } from "react";
import { useTranslations } from "use-intl";
import { Deferred } from "@/utils/Deferred";
import { DeleteApiKeyModalContent } from "./DeleteApiKeyModalContent";

export async function openDeleteApiKeyModal(apiKey: ServerApiTypes.api.manager.ApiKey, modalTitle: string) {
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
            <DeleteApiKeyModalContent
                apiKey={apiKey}
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

export function useOpenDeleteApiKeyModal() {
    const t = useTranslations("features.management.apiKeys");
    const openDeleteApiKeyModalCallback = useCallback(
        async (apiKey: ServerApiTypes.api.manager.ApiKey) => {
            return await openDeleteApiKeyModal(apiKey, t("deleteModal.modalTitle"));
        },
        [t],
    );

    return { openDeleteApiKeyModal: openDeleteApiKeyModalCallback };
}
