import { Box, Center, CopyableText, Group, InfoIcon, SecretViewer, Stack, Text, TextInput } from "privmx-components/components/index";
import { useForm } from "privmx-components/hooks/useForm";
import { useProcessing } from "privmx-components/hooks/useProcessing";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Logger } from "privmx-components/utils/Logger";
import { getErrorMessage } from "privmx-components/utils/miscFunctions/getErrorMessage";
import type { InferValueFromValidator } from "privmx-components/validators/types";
import { validators } from "privmx-components/validators/validators";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useState } from "react";
import { ApiScopesEditor } from "@/components/apiScopesEditor/ApiScopesEditor";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { useManagerApi } from "@/hooks/useManagerApi";
import { DocsUtils } from "@/utils/DocsUtils";
import { validationSchemas } from "@/validation/validationSchemas";

type CreateApiKeyModalResult =
    | { result: "cancelled" }
    | { result: "created"; apiKeyId: ServerApiTypes.types.auth.ApiKeyId; apiKeySecret: ServerApiTypes.types.auth.ApiKeySecret };

export interface CreateApiKeyModalContentProps {
    onResult: (result: CreateApiKeyModalResult) => void;
}

const schema = validators.object({
    apiKeyName: validationSchemas.apiKey.name(),
    apiKeyScope: validationSchemas.apiKey.scope(),
});

type FormValues = InferValueFromValidator<typeof schema>;

interface CreateApiKeyResult {
    apiKeyId: ServerApiTypes.types.auth.ApiKeyId;
    apiKeySecret: ServerApiTypes.types.auth.ApiKeySecret;
}

export function CreateApiKeyModalContent(props: CreateApiKeyModalContentProps) {
    const { t } = useI18n("features.apiKeys");
    const { t: tRoot } = useI18n();
    const { isProcessing, withProcessing } = useProcessing();
    const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null);
    const managerApi = useManagerApi();
    const [result, setResult] = useState<CreateApiKeyResult | null>(null);

    const form = useForm<FormValues>({
        initialValues: {
            apiKeyName: "" as ServerApiTypes.types.auth.ApiKeyName,
            apiKeyScope: [],
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
                            required
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
