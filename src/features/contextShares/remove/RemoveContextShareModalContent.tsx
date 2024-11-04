import { Stack, Text } from "@mantine/core";
import { useCallback, useRef } from "react";
import { useTranslations } from "use-intl";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { useContextApi } from "@/hooks/useContextApi";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useProcessing } from "@/hooks/useProcessing";
import type { SolutionDeletedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import type { ContextShare } from "@/privMxBridgeApi/types";
import { Logger } from "@/utils/Logger";
import { Notifications } from "@/utils/Notifications";

export interface RemoveContextShareModalContentProps {
    contextShare: ContextShare;
    onResult: (result: "cancelled" | "removed") => void;
}

export function RemoveContextShareModalContent(props: RemoveContextShareModalContentProps) {
    const t = useTranslations("features.contextShares");
    const { isProcessing, withProcessing } = useProcessing();
    const contextApi = useContextApi();

    const onResult = props.onResult;
    const handleCancelClick = useCallback(() => {
        onResult("cancelled");
    }, [onResult]);
    const hasTriggeredDeletionRef = useRef(false);
    const handleRemoveClick = useCallback(() => {
        void (async () => {
            hasTriggeredDeletionRef.current = true;
            const result = await withProcessing(async () => {
                await contextApi.removeSolutionFromContext({ contextId: props.contextShare.context.id, solutionId: props.contextShare.solution.id });
            });
            if (result.success) {
                onResult("removed");
                Notifications.showSuccess({ message: t("notifications.removed") });
            } else {
                hasTriggeredDeletionRef.current = false;
                const error = result.error;
                Logger.error(error);
                Notifications.showError({ message: t("notifications.removeError") });
            }
        })();
    }, [withProcessing, contextApi, props.contextShare.context.id, props.contextShare.solution.id, onResult, t]);
    usePrivMxBridgeApiEventListener(
        "solutionDeleted",
        useCallback(
            (event: SolutionDeletedEvent) => {
                if (hasTriggeredDeletionRef.current) {
                    return;
                }
                if (event.solutionId === props.contextShare.solution.id) {
                    Notifications.showInfo({ message: t("notifications.hasBeenDeleted") });
                    onResult("cancelled");
                }
            },
            [onResult, props.contextShare.solution.id, t],
        ),
    );

    return (
        <Stack gap="xl" my="md">
            <Text mx="md">{t("remove.confirmText", { solutionName: props.contextShare.solution.name, contextName: props.contextShare.context.name })}</Text>
            <ModalButtons
                onCancel={handleCancelClick}
                onConfirm={handleRemoveClick}
                isProcessing={isProcessing}
                confirmButtonPreset="remove"
                cancelButtonPreset="cancel"
            />
        </Stack>
    );
}
