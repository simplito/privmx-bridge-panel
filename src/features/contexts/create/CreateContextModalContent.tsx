import { Box, Center, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useState } from "react";
import { useTranslations } from "use-intl";
import { z } from "zod";
import { ContextScopeSelect } from "@/components/apiFormInputs/ContextScopeSelect";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { CopyableText } from "@/components/copyButton/CopyableText";
import { useContextApi } from "@/hooks/useContextApi";
import { useProcessing } from "@/hooks/useProcessing";
import { Logger } from "@/utils/Logger";
import { getErrorMessage } from "@/utils/miscFunctions/getErrorMessage";
import { zodResolver } from "@/validation/zodResolver";
import { zodSchemas } from "@/validation/zodSchemas";

type CreateContextModalResult = { result: "cancelled" } | { result: "created"; contextId: ServerApiTypes.types.context.ContextId };

export interface CreateContextModalContentProps {
    solutionId: ServerApiTypes.types.cloud.SolutionId;
    onResult: (result: CreateContextModalResult) => void;
}

const schema = z.object({
    contextName: zodSchemas.context.name(),
    contextDescription: zodSchemas.context.description(),
    contextScope: zodSchemas.context.scope(),
});

type FormValues = z.infer<typeof schema>;

interface CreateContextResult {
    contextId: ServerApiTypes.types.context.ContextId;
}

export function CreateContextModalContent(props: CreateContextModalContentProps) {
    const t = useTranslations("features.contexts");
    const { isProcessing, withProcessing } = useProcessing();
    const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null);
    const contextApi = useContextApi();
    const [result, setResult] = useState<CreateContextResult | null>(null);

    const form = useForm<FormValues>({
        initialValues: {
            contextName: "",
            contextDescription: "",
            contextScope: "private",
        },
        validate: zodResolver(schema),
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
                    solution: props.solutionId,
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
        [contextApi, props.solutionId, withProcessing],
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
                <ModalButtons onConfirm={handleCloseClick} confirmButtonPreset="ok" />
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
                        <TextInput
                            withAsterisk
                            label={t("profile.name")}
                            placeholder={t("profile.name")}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("contextName")}
                            disabled={isProcessing}
                        />
                        <Textarea
                            rows={5}
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
                    confirmButtonPreset="create"
                    cancelButtonPreset="cancel"
                />
            </Stack>
        </form>
    );
}
