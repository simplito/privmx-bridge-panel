import { Stack, Text } from "@mantine/core";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useRef } from "react";
import { useTranslations } from "use-intl";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useProcessing } from "@/hooks/useProcessing";
import { useSolutionApi } from "@/hooks/useSolutionApi";
import type { SolutionDeletedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { Logger } from "@/utils/Logger";
import { Notifications } from "@/utils/Notifications";

export interface DeleteSolutionModalContentProps {
    solution: ServerApiTypes.api.solution.Solution;
    onResult: (result: "cancelled" | "deleted") => void;
}

export function DeleteSolutionModalContent(props: DeleteSolutionModalContentProps) {
    const t = useTranslations("features.solutions");
    const { isProcessing, withProcessing } = useProcessing();
    const solutionApi = useSolutionApi();

    const onResult = props.onResult;
    const handleCancelClick = useCallback(() => {
        onResult("cancelled");
    }, [onResult]);
    const hasTriggeredDeletionRef = useRef(false);
    const handleDeleteClick = useCallback(() => {
        void (async () => {
            hasTriggeredDeletionRef.current = true;
            const result = await withProcessing(async () => {
                await solutionApi.deleteSolution({ id: props.solution.id });
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
    }, [withProcessing, solutionApi, props.solution.id, onResult, t]);
    usePrivMxBridgeApiEventListener(
        "solutionDeleted",
        useCallback(
            (event: SolutionDeletedEvent) => {
                if (hasTriggeredDeletionRef.current) {
                    return;
                }
                if (event.solutionId === props.solution.id) {
                    Notifications.showInfo({ message: t("notifications.hasBeenDeleted") });
                    onResult("cancelled");
                }
            },
            [onResult, props.solution.id, t],
        ),
    );

    return (
        <Stack gap="xl" my="md">
            <Text mx="md">{t("deleteModal.confirmText", { name: props.solution.name })}</Text>
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
