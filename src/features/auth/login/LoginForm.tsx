import { Box, Center, Stack, Text, TextInput } from "privmx-components/components/index";
import { useForm } from "privmx-components/hooks/useForm";
import { useProcessing } from "privmx-components/hooks/useProcessing";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Logger } from "privmx-components/utils/Logger";
import { getErrorMessage } from "privmx-components/utils/miscFunctions/getErrorMessage";
import type { InferValueFromValidator } from "privmx-components/validators/types";
import { validators } from "privmx-components/validators/validators";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useState } from "react";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { useAuthData } from "@/hooks/useAuthData";
import { useManagerApi } from "@/hooks/useManagerApi";
import type { AccessToken, AccessTokenExpiry, AccessTokenPrivMxBridgeApiAuthData, RefreshToken, RefreshTokenExpiry } from "@/privMxBridgeApi/types";
import { validationSchemas } from "@/validation/validationSchemas";
import { AuthPersistence } from "../AuthPersistence";

const schema = validators.object({
    apiKeyId: validationSchemas.apiKey.id(),
    apiKeySecret: validationSchemas.apiKey.secret(),
});

type FormValues = InferValueFromValidator<typeof schema>;

export function LoginForm() {
    const { t } = useI18n("features.auth.login");
    const { isProcessing, withProcessing } = useProcessing();
    const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null);
    const managerApi = useManagerApi();
    const { setAuthData } = useAuthData();

    const form = useForm<FormValues>({
        initialValues: {
            apiKeyId: "",
            apiKeySecret: "",
        },
        validate: schema,
    });

    const handleSubmit = useCallback(
        async (values: FormValues) => {
            const result = await withProcessing(async () => {
                return await managerApi.auth({
                    apiKeyId: values.apiKeyId as ServerApiTypes.types.auth.ApiKeyId,
                    apiKeySecret: values.apiKeySecret as ServerApiTypes.types.auth.ApiKeySecret,
                    grantType: "api_key_credentials",
                    scope: ["apiKey", "solution", "context"] as ServerApiTypes.types.auth.Scope[],
                });
            });
            if (result.success) {
                const resultData = result.result as ServerApiTypes.api.manager.AuthResult;

                const accessTokenPrivMxBridgeApiAuthData: AccessTokenPrivMxBridgeApiAuthData = {
                    type: "accessToken",
                    accessToken: resultData.accessToken as string as AccessToken,
                    refreshToken: resultData.refreshToken as string as RefreshToken,
                    accessTokenExpiry: resultData.accessTokenExpiry as number as AccessTokenExpiry,
                    refreshTokenExpiry: resultData.refreshTokenExpiry as number as RefreshTokenExpiry,
                };
                AuthPersistence.saveAuthData(accessTokenPrivMxBridgeApiAuthData);
                setAuthData({
                    privMxBridgeApiAuthData: accessTokenPrivMxBridgeApiAuthData,
                });
            } else {
                const error = result.error;
                Logger.error(error);
                setErrorMessage(getErrorMessage(error));
            }
        },
        [withProcessing, managerApi, setAuthData],
    );

    return (
        <form
            onSubmit={form.onSubmit((values) => {
                void handleSubmit(values);
            })}
        >
            <Stack gap="xl" my="md" style={{ maxWidth: 500 }}>
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
                            label={t("apiKeyId")}
                            placeholder={t("apiKeyId")}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("apiKeyId")}
                            disabled={isProcessing}
                        />
                        <TextInput
                            required
                            type="password"
                            label={t("apiKeySecret")}
                            placeholder={t("apiKeySecret")}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("apiKeySecret")}
                            disabled={isProcessing}
                        />
                    </Stack>
                </Box>
                <ModalButtons onConfirm="formSubmit" isProcessing={isProcessing} confirmButtonPreset="login" />
            </Stack>
        </form>
    );
}
