import { Stack, Text } from "@mantine/core";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useRef } from "react";
import { useTranslations } from "use-intl";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { useContextApi } from "@/hooks/useContextApi";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useProcessing } from "@/hooks/useProcessing";
import type { ContextDeletedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { Logger } from "@/utils/Logger";
import { Notifications } from "@/utils/Notifications";

export interface DeleteContextModalContentProps {
    context: ServerApiTypes.api.context.Context;
    onResult: (result: "cancelled" | "deleted") => void;
}

export function DeleteContextModalContent(props: DeleteContextModalContentProps) {
    const t = useTranslations("features.contexts");
    const { isProcessing, withProcessing } = useProcessing();
    const contextApi = useContextApi();

    const onResult = props.onResult;
    const handleCancelClick = useCallback(() => {
        onResult("cancelled");
    }, [onResult]);
    const hasTriggeredDeletionRef = useRef(false);
    const handleDeleteClick = useCallback(() => {
        void (async () => {
            hasTriggeredDeletionRef.current = true;
            const result = await withProcessing(async () => {
                await contextApi.deleteContext({ contextId: props.context.id });
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
    }, [withProcessing, contextApi, props.context.id, onResult, t]);
    usePrivMxBridgeApiEventListener(
        "contextDeleted",
        useCallback(
            (event: ContextDeletedEvent) => {
                if (hasTriggeredDeletionRef.current) {
                    return;
                }
                if (event.contextId === props.context.id) {
                    Notifications.showInfo({ message: t("notifications.hasBeenDeleted") });
                    onResult("cancelled");
                }
            },
            [onResult, props.context.id, t],
        ),
    );

    return (
        <Stack gap="xl" my="md">
            <Text mx="md">{t("deleteModal.confirmText", { name: props.context.name })}</Text>
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
