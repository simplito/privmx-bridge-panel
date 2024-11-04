import { modals } from "@mantine/modals";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback } from "react";
import { useTranslations } from "use-intl";
import { Deferred } from "@/utils/Deferred";
import { EditApiKeyModalContent } from "./EditApiKeyModalContent";

export async function openEditApiKeyModal(apiKey: ServerApiTypes.api.manager.ApiKey, modalTitle: string) {
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
            <EditApiKeyModalContent
                apiKey={apiKey}
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

export function useOpenEditApiKeyModal() {
    const t = useTranslations("features.management.apiKeys");
    const openEditApiKeyModalCallback = useCallback(
        async (apiKey: ServerApiTypes.api.manager.ApiKey) => {
            return await openEditApiKeyModal(apiKey, t("edit.modalTitle"));
        },
        [t],
    );
    return { openEditApiKeyModal: openEditApiKeyModalCallback };
}
