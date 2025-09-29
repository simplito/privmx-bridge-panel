import { Notifications, Stack, Text } from "privmx-components/components/index";
import { useProcessing } from "privmx-components/hooks/useProcessing";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Logger } from "privmx-components/utils/Logger";
import { useCallback, useRef } from "react";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { useContextApi } from "@/hooks/useContextApi";
import type { ContextUserEx } from "@/privMxBridgeApi/types";

export type ContextUserForDeletion = Omit<ContextUserEx, "solution">;

export interface DeleteContextUserModalContentProps {
    contextUserForDeletion: ContextUserForDeletion;
    onResult: (result: "cancelled" | "deleted") => void;
}

export function DeleteContextUserModalContent(props: DeleteContextUserModalContentProps) {
    const { t } = useI18n("features.contextUsers");
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
                await contextApi.removeUserFromContext({
                    contextId: props.contextUserForDeletion.context.id,
                    userId: props.contextUserForDeletion.user.userId,
                });
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
    }, [withProcessing, contextApi, props.contextUserForDeletion.context.id, props.contextUserForDeletion.user.userId, onResult, t]);

    return (
        <Stack gap="xl" my="md">
            <Text mx="md">
                {t("deleteModal.confirmText", { userId: props.contextUserForDeletion.user.userId, contextName: props.contextUserForDeletion.context.name })}
            </Text>
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
