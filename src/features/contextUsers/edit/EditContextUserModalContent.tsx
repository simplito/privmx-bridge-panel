import { Box, Center, Group, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useState } from "react";
import { useTranslations } from "use-intl";
import { z } from "zod";
import { AclEditor } from "@/components/aclEditor/AclEditor";
import { InfoIcon } from "@/components/atoms/InfoIcon";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { useContextApi } from "@/hooks/useContextApi";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useProcessing } from "@/hooks/useProcessing";
import type { ContextDeletedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { DocsUtils } from "@/utils/DocsUtils";
import { Logger } from "@/utils/Logger";
import { getErrorMessage } from "@/utils/miscFunctions/getErrorMessage";
import { Notifications } from "@/utils/Notifications";
import { zodResolver } from "@/validation/zodResolver";
import { zodSchemas } from "@/validation/zodSchemas";

type EditContextUserModalResult = { result: "cancelled" } | { result: "changed" };

export interface EditContextUserModalContentProps {
    contextUser: ServerApiTypes.api.context.ContextUser;
    onResult: (result: EditContextUserModalResult) => void;
}

const schema = z.object({
    userAcl: zodSchemas.context.userAcl(),
});

type FormValues = z.infer<typeof schema>;

export function EditContextUserModalContent(props: EditContextUserModalContentProps) {
    const t = useTranslations("features.contextUsers");
    const tRoot = useTranslations();
    const { isProcessing, withProcessing } = useProcessing();
    const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null);
    const contextApi = useContextApi();

    const form = useForm<FormValues>({
        initialValues: {
            userAcl: props.contextUser.acl,
        },
        validate: zodResolver(schema),
    });

    const onResult = props.onResult;
    const handleCancelClick = useCallback(() => {
        onResult({ result: "cancelled" });
    }, [onResult]);
    const handleSubmit = useCallback(
        async (values: FormValues) => {
            const areValuesDifferent = values.userAcl !== props.contextUser.acl;
            if (!areValuesDifferent) {
                onResult({ result: "cancelled" });
                return;
            }
            const result = await withProcessing(async () => {
                return await contextApi.setUserAcl({
                    contextId: props.contextUser.contextId,
                    userId: props.contextUser.userId,
                    acl: values.userAcl as ServerApiTypes.types.cloud.ContextAcl,
                });
            });
            if (result.success) {
                onResult({ result: "changed" });
                Notifications.showSuccess({ message: t("notifications.updated") });
            } else {
                const error = result.error;
                Logger.error(error);
                setErrorMessage(getErrorMessage(error));
            }
        },
        [props.contextUser.acl, props.contextUser.contextId, props.contextUser.userId, withProcessing, onResult, contextApi, t],
    );
    usePrivMxBridgeApiEventListener(
        "contextDeleted",
        useCallback(
            (event: ContextDeletedEvent) => {
                if (event.contextId === props.contextUser.contextId) {
                    Notifications.showInfo({ message: t("notifications.hasBeenDeleted") });
                    onResult({ result: "cancelled" });
                }
            },
            [onResult, props.contextUser.contextId, t],
        ),
    );

    return (
        <form
            onSubmit={form.onSubmit((values) => {
                void handleSubmit(values);
            })}
        >
            <Stack gap="xl" my="md">
                <Center>
                    <Text
                        size="sm"
                        fw="bolder"
                        c="error"
                        style={{ opacity: errorMessage !== null && errorMessage !== undefined ? 1 : 0, userSelect: "none", pointerEvents: "none" }}
                    >
                        {errorMessage}
                    </Text>
                </Center>
                <Box mx="md">
                    <Stack gap="md">
                        <AclEditor
                            label={
                                <Group component="span" style={{ display: "inline-flex" }} mb="xs">
                                    <span>
                                        {t("profile.acl")}
                                        <Text component="span" c="red" size="sm">
                                            *
                                        </Text>
                                    </span>
                                    <InfoIcon tooltip={tRoot("clickToOpenDocs")} linkType="external" href={DocsUtils.getIntroductionToAclUrl()} />
                                </Group>
                            }
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("userAcl")}
                            disabled={isProcessing}
                        />
                    </Stack>
                </Box>
                <ModalButtons
                    onCancel={handleCancelClick}
                    onConfirm="formSubmit"
                    isProcessing={isProcessing}
                    confirmButtonPreset="save"
                    cancelButtonPreset="cancel"
                />
            </Stack>
        </form>
    );
}
