import { Stack, Text } from "@mantine/core";
import { useCallback, useRef } from "react";
import { useTranslations } from "use-intl";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { useContextApi } from "@/hooks/useContextApi";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useProcessing } from "@/hooks/useProcessing";
import type { SolutionDeletedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import type { ContextUserEx } from "@/privMxBridgeApi/types";
import { Logger } from "@/utils/Logger";
import { Notifications } from "@/utils/Notifications";

export interface DeleteContextUserModalContentProps {
    contextUserEx: ContextUserEx;
    onResult: (result: "cancelled" | "deleted") => void;
}

export function DeleteContextUserModalContent(props: DeleteContextUserModalContentProps) {
    const t = useTranslations("features.contextUsers");
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
                await contextApi.removeUserFromContext({ contextId: props.contextUserEx.context.id, userId: props.contextUserEx.user.userId });
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
    }, [withProcessing, contextApi, props.contextUserEx.context.id, props.contextUserEx.user.userId, onResult, t]);
    usePrivMxBridgeApiEventListener(
        "solutionDeleted",
        useCallback(
            (event: SolutionDeletedEvent) => {
                if (hasTriggeredDeletionRef.current) {
                    return;
                }
                if (event.solutionId === props.contextUserEx.solution.id) {
                    Notifications.showInfo({ message: t("notifications.hasBeenDeleted") });
                    onResult("cancelled");
                }
            },
            [onResult, props.contextUserEx.solution.id, t],
        ),
    );

    return (
        <Stack gap="xl" my="md">
            <Text mx="md">{t("deleteModal.confirmText", { userId: props.contextUserEx.user.userId, contextName: props.contextUserEx.context.name })}</Text>
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
