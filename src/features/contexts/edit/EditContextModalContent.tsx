import { Box, Center, Notifications, Stack, Text, TextArea, TextInput } from "privmx-components/components/index";
import { useForm } from "privmx-components/hooks/useForm";
import { useProcessing } from "privmx-components/hooks/useProcessing";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Logger } from "privmx-components/utils/Logger";
import { getErrorMessage } from "privmx-components/utils/miscFunctions/getErrorMessage";
import type { InferValueFromValidator } from "privmx-components/validators/types";
import { validators } from "privmx-components/validators/validators";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useState } from "react";
import { ContextScopeSelect } from "@/components/apiFormInputs/ContextScopeSelect";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { useContextApi } from "@/hooks/useContextApi";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import type { ContextDeletedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { validationSchemas } from "@/validation/validationSchemas";

type EditContextModalResult = { result: "cancelled" } | { result: "changed" };

export interface EditContextModalContentProps {
    context: ServerApiTypes.api.context.Context;
    onResult: (result: EditContextModalResult) => void;
}

const schema = validators.object({
    contextName: validationSchemas.context.name(),
    contextDescription: validationSchemas.context.description(),
    contextScope: validationSchemas.context.scope(),
});

type FormValues = InferValueFromValidator<typeof schema>;

export function EditContextModalContent(props: EditContextModalContentProps) {
    const { t } = useI18n("features.contexts");
    const { isProcessing, withProcessing } = useProcessing();
    const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null);
    const contextApi = useContextApi();

    const form = useForm<FormValues>({
        initialValues: {
            contextName: props.context.name,
            contextDescription: props.context.description,
            contextScope: props.context.scope,
        },
        validate: schema,
    });

    const onResult = props.onResult;
    const handleCancelClick = useCallback(() => {
        onResult({ result: "cancelled" });
    }, [onResult]);
    const handleSubmit = useCallback(
        async (values: FormValues) => {
            const areValuesDifferent =
                values.contextName !== props.context.name ||
                values.contextDescription !== props.context.description ||
                values.contextScope !== props.context.scope;
            if (!areValuesDifferent) {
                onResult({ result: "cancelled" });
                return;
            }
            const result = await withProcessing(async () => {
                return await contextApi.updateContext({
                    contextId: props.context.id,
                    name: values.contextName as ServerApiTypes.types.context.ContextName,
                    description: values.contextDescription as ServerApiTypes.types.context.ContextDescription,
                    scope: values.contextScope as ServerApiTypes.types.context.ContextScope,
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
        [props.context.name, props.context.description, props.context.scope, props.context.id, withProcessing, onResult, contextApi, t],
    );
    usePrivMxBridgeApiEventListener(
        "contextDeleted",
        useCallback(
            (event: ContextDeletedEvent) => {
                if (event.contextId === props.context.id) {
                    Notifications.showInfo({ message: t("notifications.hasBeenDeleted") });
                    onResult({ result: "cancelled" });
                }
            },
            [onResult, props.context.id, t],
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
                        <TextInput
                            required
                            label={t("profile.name")}
                            placeholder={t("profile.name")}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("contextName")}
                            disabled={isProcessing}
                        />
                        <TextArea
                            fieldHeight={100}
                            label={t("profile.description")}
                            placeholder={t("profile.description")}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("contextDescription")}
                            disabled={isProcessing}
                        />
                        <ContextScopeSelect
                            label={t("profile.scope")}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("contextScope")}
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
