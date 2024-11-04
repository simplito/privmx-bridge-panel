import { Box, Center, Group, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useState } from "react";
import { useTranslations } from "use-intl";
import { z } from "zod";
import { ApiScopesEditor } from "@/components/apiScopesEditor/ApiScopesEditor";
import { InfoIcon } from "@/components/atoms/InfoIcon";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { SecretViewer } from "@/components/atoms/SecretViewer";
import { CopyableText } from "@/components/copyButton/CopyableText";
import { useManagerApi } from "@/hooks/useManagerApi";
import { useProcessing } from "@/hooks/useProcessing";
import { DocsUtils } from "@/utils/DocsUtils";
import { Logger } from "@/utils/Logger";
import { getErrorMessage } from "@/utils/miscFunctions/getErrorMessage";
import { zodResolver } from "@/validation/zodResolver";
import { zodSchemas } from "@/validation/zodSchemas";

type CreateApiKeyModalResult =
    | { result: "cancelled" }
    | { result: "created"; apiKeyId: ServerApiTypes.types.auth.ApiKeyId; apiKeySecret: ServerApiTypes.types.auth.ApiKeySecret };

export interface CreateApiKeyModalContentProps {
    onResult: (result: CreateApiKeyModalResult) => void;
}

const schema = z.object({
    apiKeyName: zodSchemas.apiKey.name(),
    apiKeyScope: zodSchemas.apiKey.scope(),
});

type FormValues = z.infer<typeof schema>;

interface CreateApiKeyResult {
    apiKeyId: ServerApiTypes.types.auth.ApiKeyId;
    apiKeySecret: ServerApiTypes.types.auth.ApiKeySecret;
}

export function CreateApiKeyModalContent(props: CreateApiKeyModalContentProps) {
    const t = useTranslations("features.management.apiKeys");
    const tRoot = useTranslations();
    const { isProcessing, withProcessing } = useProcessing();
    const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null);
    const managerApi = useManagerApi();
    const [result, setResult] = useState<CreateApiKeyResult | null>(null);

    const form = useForm<FormValues>({
        initialValues: {
            apiKeyName: "" as ServerApiTypes.types.auth.ApiKeyName,
            apiKeyScope: [],
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
                const createApiKeyResult = await managerApi.createApiKey({
                    name: values.apiKeyName as ServerApiTypes.types.auth.ApiKeyName,
                    scope: values.apiKeyScope as ServerApiTypes.types.auth.Scope[],
                });
                return {
                    apiKeyId: createApiKeyResult.id,
                    apiKeySecret: createApiKeyResult.secret,
                } satisfies CreateApiKeyResult;
            });
            if (res.success) {
                setResult(res.result as CreateApiKeyResult);
            } else {
                const error = res.error;
                Logger.error(error);
                setErrorMessage(getErrorMessage(error));
            }
        },
        [managerApi, withProcessing],
    );

    const handleCloseClick = useCallback(() => {
        if (result) {
            onResult({ result: "created", apiKeyId: result.apiKeyId, apiKeySecret: result.apiKeySecret });
        } else {
            onResult({ result: "cancelled" });
        }
    }, [onResult, result]);

    if (result) {
        return (
            <Stack gap="xl" my="md">
                <Text>{t("notifications.apiKeyCreated")}</Text>
                <Box mx="md" mb="md">
                    <Stack gap="md">
                        <Text fw="bold">{t("profile.name")}:</Text>
                        <CopyableText text={form.values.apiKeyName} />
                    </Stack>
                    <Stack gap="md" mt="xl">
                        <Text fw="bold">{t("profile.id")}:</Text>
                        <CopyableText text={result.apiKeyId} isIdLike />
                    </Stack>
                    <Stack gap="md" mt="xl">
                        <Text fw="bold">{t("profile.secret")}:</Text>
                        <SecretViewer secret={result.apiKeySecret} />
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
                            {...form.getInputProps("apiKeyName")}
                            disabled={isProcessing}
                        />
                        <ApiScopesEditor
                            label={
                                <Group component="span" style={{ display: "inline-flex" }} mb="xs">
                                    {t("profile.scope")}
                                    <InfoIcon tooltip={tRoot("clickToOpenDocs")} linkType="external" href={DocsUtils.getApiScopesUrl()} />
                                </Group>
                            }
                            placeholder={t("profile.scope")}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("apiKeyScope")}
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
