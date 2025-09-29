import { Notifications, Stack, Text } from "privmx-components/components/index";
import { useProcessing } from "privmx-components/hooks/useProcessing";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Logger } from "privmx-components/utils/Logger";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useRef } from "react";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { useManagerApi } from "@/hooks/useManagerApi";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import type { ApiKeyDeletedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";

export interface DeleteApiKeyModalContentProps {
    apiKey: ServerApiTypes.api.manager.ApiKey;
    onResult: (result: "cancelled" | "deleted") => void;
}

export function DeleteApiKeyModalContent(props: DeleteApiKeyModalContentProps) {
    const { t } = useI18n("features.apiKeys");
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
