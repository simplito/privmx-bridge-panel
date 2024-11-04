import { Box, Center, Group, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useState } from "react";
import { useTranslations } from "use-intl";
import { z } from "zod";
import { AclEditor } from "@/components/aclEditor/AclEditor";
import { InfoIcon } from "@/components/atoms/InfoIcon";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { useContextApi } from "@/hooks/useContextApi";
import { useProcessing } from "@/hooks/useProcessing";
import type { ContextUserExIds } from "@/privMxBridgeApi/types";
import { DocsUtils } from "@/utils/DocsUtils";
import { Logger } from "@/utils/Logger";
import { getErrorMessage } from "@/utils/miscFunctions/getErrorMessage";
import { zodResolver } from "@/validation/zodResolver";
import { zodSchemas } from "@/validation/zodSchemas";

type CreateContextUserModalResult = { result: "cancelled" } | { result: "created"; contextUserExIds: ContextUserExIds };

export interface CreateContextUserModalContentProps {
    context: ServerApiTypes.api.context.Context;
    onResult: (result: CreateContextUserModalResult) => void;
}

const schema = z.object({
    userId: zodSchemas.context.userId(),
    userPubKey: zodSchemas.context.userPubKey(),
    userAcl: zodSchemas.context.userAcl(),
});

type FormValues = z.infer<typeof schema>;

export function CreateContextUserModalContent(props: CreateContextUserModalContentProps) {
    const t = useTranslations("features.contextUsers");
    const tRoot = useTranslations();
    const { isProcessing, withProcessing } = useProcessing();
    const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null);
    const contextApi = useContextApi();

    const form = useForm<FormValues>({
        initialValues: {
            userId: "" as ServerApiTypes.types.cloud.UserId,
            userPubKey: "" as ServerApiTypes.types.cloud.UserPubKey,
            userAcl: "" as ServerApiTypes.types.cloud.ContextAcl,
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
                            withAsterisk
                            label={t("profile.id")}
                            placeholder={t("profile.id")}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("userId")}
                            disabled={isProcessing}
                        />
                        <TextInput
                            withAsterisk
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
