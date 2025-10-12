import { Box, Center, Group, InfoIcon, Notifications, SimpleModalButtons, Stack, Text } from "privmx-components/components/index";
import { useForm } from "privmx-components/hooks/useForm";
import { useProcessing } from "privmx-components/hooks/useProcessing";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Logger } from "privmx-components/utils/Logger";
import { getErrorMessage } from "privmx-components/utils/miscFunctions/getErrorMessage";
import type { InferValueFromValidator } from "privmx-components/validators/types";
import { validators } from "privmx-components/validators/validators";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useState } from "react";
import { AclEditor } from "@/components/aclEditor/AclEditor";
import { useContextApi } from "@/hooks/useContextApi";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import type { ContextDeletedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { DocsUtils } from "@/utils/DocsUtils";
import { validationSchemas } from "@/validation/validationSchemas";

type EditContextUserModalResult = { result: "cancelled" } | { result: "changed" };

export interface EditContextUserModalContentProps {
    contextUser: ServerApiTypes.api.context.ContextUser;
    onResult: (result: EditContextUserModalResult) => void;
}

const schema = validators.object({
    userAcl: validationSchemas.context.userAcl(),
});

type FormValues = InferValueFromValidator<typeof schema>;

export function EditContextUserModalContent(props: EditContextUserModalContentProps) {
    const { t } = useI18n("features.contextUsers");
    const { t: tRoot } = useI18n();
    const { isProcessing, withProcessing } = useProcessing();
    const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null);
    const contextApi = useContextApi();

    const form = useForm<FormValues>({
        initialValues: {
            userAcl: props.contextUser.acl,
        },
        validate: schema,
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
                <SimpleModalButtons
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
