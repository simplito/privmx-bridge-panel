import { modals } from "@mantine/modals";
import { useCallback } from "react";
import { useTranslations } from "use-intl";
import { Deferred } from "@/utils/Deferred";
import { CreateApiKeyModalContent } from "./CreateApiKeyModalContent";

export async function openCreateApiKeyModal(modalTitle: string) {
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
            <CreateApiKeyModalContent
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

export function useOpenCreateApiKeyModal() {
    const t = useTranslations("features.management.apiKeys");
    const openCreateApiKeyModalCallback = useCallback(async () => {
        return await openCreateApiKeyModal(t("create.modalTitle"));
    }, [t]);

    return { openCreateApiKeyModal: openCreateApiKeyModalCallback };
}
