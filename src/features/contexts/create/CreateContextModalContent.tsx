import { Box, Center, CopyableText, SimpleModalButtons, Stack, Text, TextArea, TextInput } from "privmx-components/components/index";
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
import { SolutionSelect } from "@/components/apiFormInputs/SolutionSelect";
import { useContextApi } from "@/hooks/useContextApi";
import { validationSchemas } from "@/validation/validationSchemas";

type CreateContextModalResult = { result: "cancelled" } | { result: "created"; contextId: ServerApiTypes.types.context.ContextId };

export interface CreateContextModalContentProps {
    solutionId: ServerApiTypes.types.cloud.SolutionId | null;
    onResult: (result: CreateContextModalResult) => void;
}

const schema = validators.object({
    solutionId: validationSchemas.solution.id(),
    contextName: validationSchemas.context.name(),
    contextDescription: validationSchemas.context.description(),
    contextScope: validationSchemas.context.scope(),
});

type FormValues = InferValueFromValidator<typeof schema>;

interface CreateContextResult {
    contextId: ServerApiTypes.types.context.ContextId;
}

export function CreateContextModalContent(props: CreateContextModalContentProps) {
    const { t } = useI18n("features.contexts");
    const { isProcessing, withProcessing } = useProcessing();
    const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null);
    const contextApi = useContextApi();
    const [result, setResult] = useState<CreateContextResult | null>(null);

    const form = useForm<FormValues>({
        initialValues: {
            solutionId: props.solutionId ?? "",
            contextName: "",
            contextDescription: "",
            contextScope: "private",
        },
        validate: schema,
    });

    const onResult = props.onResult;
    const handleCancelClick = useCallback(() => {
        onResult({ result: "cancelled" });
    }, [onResult]);
    const handleSubmit = useCallback(
        async (values: FormValues) => {
            const res = await withProcessing(async () => {
                const createContextResult = await contextApi.createContext({
                    name: values.contextName as ServerApiTypes.types.context.ContextName,
                    description: values.contextDescription as ServerApiTypes.types.context.ContextDescription,
                    scope: values.contextScope as ServerApiTypes.types.context.ContextScope,
                    solution: values.solutionId as ServerApiTypes.types.cloud.SolutionId,
                });
                return {
                    contextId: createContextResult.contextId,
                };
            });
            if (res.success) {
                setResult(res.result as { contextId: ServerApiTypes.types.context.ContextId });
            } else {
                const error = res.error;
                Logger.error(error);
                setErrorMessage(getErrorMessage(error));
            }
        },
        [contextApi, withProcessing],
    );

    const handleCloseClick = useCallback(() => {
        if (result) {
            onResult({ result: "created", contextId: result.contextId });
        } else {
            onResult({ result: "cancelled" });
        }
    }, [onResult, result]);

    if (result) {
        return (
            <Stack gap="xl" my="md">
                <Text>{t("notifications.contextCreated")}</Text>
                <Box mx="md" mb="md">
                    <Stack gap="md">
                        <Text fw="bold">{t("profile.name")}:</Text>
                        <CopyableText text={form.values.contextName} />
                    </Stack>
                    <Stack gap="md" mt="xl">
                        <Text fw="bold">{t("profile.id")}:</Text>
                        <CopyableText text={result.contextId} isIdLike />
                    </Stack>
                </Box>
                <SimpleModalButtons onConfirm={handleCloseClick} confirmButtonPreset="ok" />
            </Stack>
        );
    }

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
                        <SolutionSelect
                            required
                            label={t("profile.solution")}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("solutionId")}
                            disabled={isProcessing}
                        />
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
                <SimpleModalButtons
                    onCancel={handleCancelClick}
                    onConfirm="formSubmit"
                    isProcessing={isProcessing}
                    confirmButtonPreset="create"
                    cancelButtonPreset="cancel"
                />
            </Stack>
        </form>
    );
}
