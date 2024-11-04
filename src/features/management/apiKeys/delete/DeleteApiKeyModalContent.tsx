import { Stack, Text } from "@mantine/core";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useRef } from "react";
import { useTranslations } from "use-intl";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { useManagerApi } from "@/hooks/useManagerApi";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useProcessing } from "@/hooks/useProcessing";
import type { ApiKeyDeletedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { Logger } from "@/utils/Logger";
import { Notifications } from "@/utils/Notifications";

export interface DeleteApiKeyModalContentProps {
    apiKey: ServerApiTypes.api.manager.ApiKey;
    onResult: (result: "cancelled" | "deleted") => void;
}

export function DeleteApiKeyModalContent(props: DeleteApiKeyModalContentProps) {
    const t = useTranslations("features.management.apiKeys");
    const { isProcessing, withProcessing } = useProcessing();
    const managerApi = useManagerApi();

    const onResult = props.onResult;
    const handleCancelClick = useCallback(() => {
        onResult("cancelled");
    }, [onResult]);
    const hasTriggeredDeletionRef = useRef(false);
    const handleDeleteClick = useCallback(() => {
        void (async () => {
            hasTriggeredDeletionRef.current = true;
            const result = await withProcessing(async () => {
                await managerApi.deleteApiKey({ id: props.apiKey.id });
            });
            if (result.success) {
                onResult("deleted");
                Notifications.showSuccess({ message: t("notifications.deleted") });
            } else {
                hasTriggeredDeletionRef.current = false;
                const error = result.error;
                Logger.error(error);
                Notifications.showError({ message: t("notifications.deleteError") });
            }
        })();
    }, [withProcessing, managerApi, props.apiKey.id, onResult, t]);
    usePrivMxBridgeApiEventListener(
        "apiKeyDeleted",
        useCallback(
            (event: ApiKeyDeletedEvent) => {
                if (hasTriggeredDeletionRef.current) {
                    return;
                }
                if (event.apiKeyId === props.apiKey.id) {
                    Notifications.showInfo({ message: t("notifications.hasBeenDeleted") });
                    onResult("cancelled");
                }
            },
            [onResult, props.apiKey.id, t],
        ),
    );

    return (
        <Stack gap="xl" my="md">
            <Text mx="md">{t("deleteModal.confirmText", { name: props.apiKey.name })}</Text>
            <ModalButtons
                onCancel={handleCancelClick}
                onConfirm={handleDeleteClick}
                isProcessing={isProcessing}
                confirmButtonPreset="delete"
                cancelButtonPreset="cancel"
            />
        </Stack>
    );
}
