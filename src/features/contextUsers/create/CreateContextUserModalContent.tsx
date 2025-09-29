import { Box, Center, Group, InfoIcon, Stack, Text, TextInput } from "privmx-components/components/index";
import { useForm } from "privmx-components/hooks/useForm";
import { useProcessing } from "privmx-components/hooks/useProcessing";
import { useI18n } from "privmx-components/i18n/useI18n";
import { Logger } from "privmx-components/utils/Logger";
import { getErrorMessage } from "privmx-components/utils/miscFunctions/getErrorMessage";
import type { InferValueFromValidator } from "privmx-components/validators/types";
import { validators } from "privmx-components/validators/validators";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useState } from "react";
import { AclEditor } from "@/components/aclEditor/AclEditor";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { useContextApi } from "@/hooks/useContextApi";
import type { ContextUserExIds } from "@/privMxBridgeApi/types";
import { DocsUtils } from "@/utils/DocsUtils";
import { validationSchemas } from "@/validation/validationSchemas";

type CreateContextUserModalResult = { result: "cancelled" } | { result: "created"; contextUserExIds: ContextUserExIds };

export interface CreateContextUserModalContentProps {
    context: ServerApiTypes.api.context.Context;
    onResult: (result: CreateContextUserModalResult) => void;
}

const schema = validators.object({
    userId: validationSchemas.context.userId(),
    userPubKey: validationSchemas.context.userPubKey(),
    userAcl: validationSchemas.context.userAcl(),
});

type FormValues = InferValueFromValidator<typeof schema>;

export function CreateContextUserModalContent(props: CreateContextUserModalContentProps) {
    const { t } = useI18n("features.contextUsers");
    const { t: tRoot } = useI18n();
    const { isProcessing, withProcessing } = useProcessing();
    const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null);
    const contextApi = useContextApi();

    const form = useForm<FormValues>({
        initialValues: {
            userId: "" as ServerApiTypes.types.cloud.UserId,
            userPubKey: "" as ServerApiTypes.types.cloud.UserPubKey,
            userAcl: "" as ServerApiTypes.types.cloud.ContextAcl,
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
                await contextApi.addUserToContext({
                    contextId: props.context.id,
                    userId: values.userId as ServerApiTypes.types.cloud.UserId,
                    userPubKey: values.userPubKey as ServerApiTypes.types.cloud.UserPubKey,
                    acl: values.userAcl as ServerApiTypes.types.cloud.ContextAcl,
                });
                return {
                    contextId: props.context.id,
                    solutionId: props.context.solution,
                    userId: values.userId,
                };
            });
            if (res.success) {
                onResult({ result: "created", contextUserExIds: res.result as ContextUserExIds });
            } else {
                const error = res.error;
                Logger.error(error);
                setErrorMessage(getErrorMessage(error));
            }
        },
        [contextApi, onResult, props.context.id, props.context.solution, withProcessing],
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
                            label={t("profile.id")}
                            placeholder={t("profile.id")}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("userId")}
                            disabled={isProcessing}
                        />
                        <TextInput
                            required
                            label={t("profile.pubKey")}
                            placeholder={t("profile.pubKey")}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("userPubKey")}
                            disabled={isProcessing}
                        />
                        <AclEditor
                            label={
                                <Group component="span" style={{ display: "inline-flex" }} mb="xs">
                                    <span>
                                        {t("profile.acl")}
                                        <Text component="span" c="red" size="sm">
                                            *
                                        </Text>
                                    </span>
                                    <InfoIcon tooltip={tRoot("clickToOpenDocs")} linkType="external" href={DocsUtils.getIntroductionToAclUrl()} />
                                </Group>
                            }
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("userAcl")}
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
