import { Box, Center, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "use-intl";
import { z } from "zod";
import { SolutionSelect } from "@/components/apiFormInputs/SolutionSelect";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { useContextApi } from "@/hooks/useContextApi";
import { useProcessing } from "@/hooks/useProcessing";
import type { ContextShareIds } from "@/privMxBridgeApi/types";
import { Logger } from "@/utils/Logger";
import { getErrorMessage } from "@/utils/miscFunctions/getErrorMessage";
import { zodResolver } from "@/validation/zodResolver";
import { zodSchemas } from "@/validation/zodSchemas";

type AddContextShareModalResult = { result: "cancelled" } | { result: "added"; contextShareIds: ContextShareIds };

export interface AddContextShareModalContentProps {
    context: ServerApiTypes.api.context.Context;
    onResult: (result: AddContextShareModalResult) => void;
}

const schema = z.object({
    solutionId: zodSchemas.solution.id(),
});

type FormValues = z.infer<typeof schema>;

export function AddContextShareModalContent(props: AddContextShareModalContentProps) {
    const t = useTranslations("features.contextShares");
    const { isProcessing, withProcessing } = useProcessing();
    const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null);
    const contextApi = useContextApi();

    const form = useForm<FormValues>({
        initialValues: {
            solutionId: "" as ServerApiTypes.types.cloud.SolutionId,
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
                await contextApi.addSolutionToContext({
                    contextId: props.context.id,
                    solutionId: values.solutionId as ServerApiTypes.types.cloud.SolutionId,
                });
                return {
                    contextId: props.context.id,
                    solutionId: values.solutionId as ServerApiTypes.types.cloud.SolutionId,
                };
            });
            if (res.success) {
                onResult({ result: "added", contextShareIds: res.result as ContextShareIds });
            } else {
                const error = res.error;
                Logger.error(error);
                setErrorMessage(getErrorMessage(error));
            }
        },
        [contextApi, onResult, props.context.id, withProcessing],
    );

    const omitSolutionIds = useMemo(() => {
        return [...props.context.shares, props.context.solution];
    }, [props.context.shares, props.context.solution]);

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
                            omitSolutionIds={omitSolutionIds}
                            withAsterisk
                            required
                            label={t("add.solutionId.label")}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("solutionId")}
                            disabled={isProcessing}
                        />
                    </Stack>
                </Box>
                <ModalButtons
                    onCancel={handleCancelClick}
                    onConfirm="formSubmit"
                    isProcessing={isProcessing}
                    confirmButtonPreset="add"
                    cancelButtonPreset="cancel"
                />
            </Stack>
        </form>
    );
}
