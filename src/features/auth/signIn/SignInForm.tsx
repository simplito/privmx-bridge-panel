import { Box, Center, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useState } from "react";
import { useTranslations } from "use-intl";
import { z } from "zod";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { useAuthData } from "@/hooks/useAuthData";
import { useManagerApi } from "@/hooks/useManagerApi";
import { useProcessing } from "@/hooks/useProcessing";
import type { AccessToken, AccessTokenExpiry, AccessTokenPrivMxBridgeApiAuthData, RefreshToken, RefreshTokenExpiry } from "@/privMxBridgeApi/types";
import { Logger } from "@/utils/Logger";
import { getErrorMessage } from "@/utils/miscFunctions/getErrorMessage";
import { zodResolver } from "@/validation/zodResolver";
import { zodSchemas } from "@/validation/zodSchemas";
import { AuthPersistence } from "../AuthPersistence";

const schema = z.object({
    apiKeyId: zodSchemas.apiKey.id(),
    apiKeySecret: zodSchemas.apiKey.secret(),
});

type FormValues = z.infer<typeof schema>;

export function SignInForm() {
    const t = useTranslations("features.auth.signIn");
    const { isProcessing, withProcessing } = useProcessing();
    const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null);
    const managerApi = useManagerApi();
    const { setAuthData } = useAuthData();

    const form = useForm<FormValues>({
        initialValues: {
            apiKeyId: "",
            apiKeySecret: "",
        },
        validate: zodResolver(schema),
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
            <Stack gap="xl" my="md" maw={500}>
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
                            label={t("apiKeyId")}
                            placeholder={t("apiKeyId")}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("apiKeyId")}
                            disabled={isProcessing}
                        />
                        <PasswordInput
                            withAsterisk
                            label={t("apiKeySecret")}
                            placeholder={t("apiKeySecret")}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("apiKeySecret")}
                            disabled={isProcessing}
                        />
                    </Stack>
                </Box>
                <ModalButtons onConfirm="formSubmit" isProcessing={isProcessing} confirmButtonPreset="signIn" />
            </Stack>
        </form>
    );
}
