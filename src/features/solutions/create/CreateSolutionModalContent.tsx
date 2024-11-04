import { Box, Center, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useState } from "react";
import { useTranslations } from "use-intl";
import { z } from "zod";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { CopyableText } from "@/components/copyButton/CopyableText";
import { useProcessing } from "@/hooks/useProcessing";
import { useSolutionApi } from "@/hooks/useSolutionApi";
import { Logger } from "@/utils/Logger";
import { getErrorMessage } from "@/utils/miscFunctions/getErrorMessage";
import { zodResolver } from "@/validation/zodResolver";
import { zodSchemas } from "@/validation/zodSchemas";

type CreateSolutionModalResult = { result: "cancelled" } | { result: "created"; solutionId: ServerApiTypes.types.cloud.SolutionId };

export interface CreateSolutionModalContentProps {
    onResult: (result: CreateSolutionModalResult) => void;
}

const schema = z.object({
    solutionName: zodSchemas.solution.name(),
});

type FormValues = z.infer<typeof schema>;

interface CreateSolutionResult {
    solutionId: ServerApiTypes.types.cloud.SolutionId;
}

export function CreateSolutionModalContent(props: CreateSolutionModalContentProps) {
    const t = useTranslations("features.solutions");
    const { isProcessing, withProcessing } = useProcessing();
    const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null);
    const solutionApi = useSolutionApi();
    const [result, setResult] = useState<CreateSolutionResult | null>(null);

    const form = useForm<FormValues>({
        initialValues: {
            solutionName: "",
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
                const createSolutionResult = await solutionApi.createSolution({
                    name: values.solutionName as ServerApiTypes.types.cloud.SolutionName,
                });
                return {
                    solutionId: createSolutionResult.solutionId,
                };
            });
            if (res.success) {
                setResult(res.result as { solutionId: ServerApiTypes.types.cloud.SolutionId });
            } else {
                const error = res.error;
                Logger.error(error);
                setErrorMessage(getErrorMessage(error));
            }
        },
        [solutionApi, withProcessing],
    );

    const handleCloseClick = useCallback(() => {
        if (result) {
            onResult({ result: "created", solutionId: result.solutionId });
        } else {
            onResult({ result: "cancelled" });
        }
    }, [onResult, result]);

    if (result) {
        return (
            <Stack gap="xl" my="md">
                <Text>{t("notifications.solutionCreated")}</Text>
                <Box mx="md" mb="md">
                    <Stack gap="md">
                        <Text fw="bold">{t("profile.name")}:</Text>
                        <CopyableText text={form.values.solutionName} />
                    </Stack>
                    <Stack gap="md" mt="xl">
                        <Text fw="bold">{t("profile.id")}:</Text>
                        <CopyableText text={result.solutionId} isIdLike />
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
                            {...form.getInputProps("solutionName")}
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
