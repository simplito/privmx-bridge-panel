import { Box, Center, Group, Stack, Switch, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useState } from "react";
import { useTranslations } from "use-intl";
import { z } from "zod";
import { ApiScopesEditor } from "@/components/apiScopesEditor/ApiScopesEditor";
import { InfoIcon } from "@/components/atoms/InfoIcon";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { useManagerApi } from "@/hooks/useManagerApi";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useProcessing } from "@/hooks/useProcessing";
import type { ApiKeyDeletedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { DocsUtils } from "@/utils/DocsUtils";
import { Logger } from "@/utils/Logger";
import { getErrorMessage } from "@/utils/miscFunctions/getErrorMessage";
import { Notifications } from "@/utils/Notifications";
import { zodResolver } from "@/validation/zodResolver";
import { zodSchemas } from "@/validation/zodSchemas";
import { ApiKeyUtils } from "../ApiKeyUtils";

type EditApiKeyModalResult = { result: "cancelled" } | { result: "changed" };

export interface EditApiKeyModalContentProps {
    apiKey: ServerApiTypes.api.manager.ApiKey;
    onResult: (result: EditApiKeyModalResult) => void;
}

const schema = z.object({
    apiKeyName: zodSchemas.apiKey.name(),
    apiKeyScope: zodSchemas.apiKey.scope(),
    apiKeyEnabled: zodSchemas.apiKey.enabled(),
});

type FormValues = z.infer<typeof schema>;

export function EditApiKeyModalContent(props: EditApiKeyModalContentProps) {
    const t = useTranslations("features.management.apiKeys");
    const tRoot = useTranslations();
    const { isProcessing, withProcessing } = useProcessing();
    const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null);
    const managerApi = useManagerApi();

    const form = useForm<FormValues>({
        initialValues: {
            apiKeyName: props.apiKey.name,
            apiKeyScope: props.apiKey.scope,
            apiKeyEnabled: props.apiKey.enabled,
        },
        validate: zodResolver(schema),
    });

    const onResult = props.onResult;
    const handleCancelClick = useCallback(() => {
        onResult({ result: "cancelled" });
    }, [onResult]);
    const handleSubmit = useCallback(
        async (values: FormValues) => {
            const areValuesDifferent =
                values.apiKeyName !== props.apiKey.name ||
                ApiKeyUtils.scopeArrayToString(values.apiKeyScope as ServerApiTypes.types.auth.Scope[]) !==
                    ApiKeyUtils.scopeArrayToString(props.apiKey.scope) ||
                values.apiKeyEnabled !== props.apiKey.enabled;
            if (!areValuesDifferent) {
                onResult({ result: "cancelled" });
                return;
            }
            const result = await withProcessing(async () => {
                return await managerApi.updateApiKey({
                    id: props.apiKey.id,
                    name: values.apiKeyName as ServerApiTypes.types.auth.ApiKeyName,
                    scope: values.apiKeyScope as ServerApiTypes.types.auth.Scope[],
                    enabled: values.apiKeyEnabled,
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
        [props.apiKey.name, props.apiKey.scope, props.apiKey.enabled, props.apiKey.id, withProcessing, onResult, managerApi, t],
    );
    usePrivMxBridgeApiEventListener(
        "apiKeyDeleted",
        useCallback(
            (event: ApiKeyDeletedEvent) => {
                if (event.apiKeyId === props.apiKey.id) {
                    Notifications.showInfo({ message: t("notifications.hasBeenDeleted") });
                    onResult({ result: "cancelled" });
                }
            },
            [onResult, props.apiKey.id, t],
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
                            withAsterisk
                            label={t("profile.name")}
                            placeholder={t("profile.name")}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("apiKeyName")}
                            disabled={isProcessing}
                        />
                        <Switch
                            label={t("profile.enabled")}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("apiKeyEnabled")}
                            checked={form.values.apiKeyEnabled}
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
                    confirmButtonPreset="save"
                    cancelButtonPreset="cancel"
                />
            </Stack>
        </form>
    );
}
