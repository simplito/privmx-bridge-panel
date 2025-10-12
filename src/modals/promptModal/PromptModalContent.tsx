import { Box, Center, SimpleModalButtons, Stack, Text, TextInput } from "privmx-components/components/index";
import { useForm } from "privmx-components/hooks/useForm";
import type { StringValidator } from "privmx-components/validators/StringValidator";
import type { InferValueFromValidator } from "privmx-components/validators/types";
import { validators } from "privmx-components/validators/validators";
import { useCallback } from "react";

type PromptModalResult = { result: "cancelled" } | { result: "submitted"; value: string };

export interface PromptModalContentProps {
    onResult: (result: PromptModalResult) => void;
    content?: React.ReactNode | undefined;
    initialValue?: string | undefined;
    inputPlaceholder?: string | undefined;
    validationSchema?: StringValidator | undefined;
}

export function PromptModalContent(props: PromptModalContentProps) {
    const schema = validators.object({
        value: props.validationSchema ?? validators.string(),
    });
    type FormValues = InferValueFromValidator<typeof schema>;

    const form = useForm<FormValues>({
        initialValues: {
            value: props.initialValue ?? "",
        },
        validate: schema,
    });

    const onResult = props.onResult;
    const handleCancelClick = useCallback(() => {
        onResult({ result: "cancelled" });
    }, [onResult]);
    const handleSubmit = useCallback(
        (values: FormValues) => {
            onResult({ result: "submitted", value: values.value });
        },
        [onResult],
    );

    return (
        <form
            onSubmit={form.onSubmit((values) => {
                handleSubmit(values);
            })}
        >
            <Stack gap="xl" my="md">
                {props.content === undefined ? null : (
                    <Center>
                        <Text size="sm" fw="bolder" c="error">
                            {props.content}
                        </Text>
                    </Center>
                )}
                <Box mx="md">
                    <Stack gap="md">
                        <TextInput
                            required
                            placeholder={props.inputPlaceholder}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("value")}
                            data-autofocus
                        />
                    </Stack>
                </Box>
                <SimpleModalButtons onCancel={handleCancelClick} onConfirm="formSubmit" confirmButtonPreset="create" cancelButtonPreset="cancel" />
            </Stack>
        </form>
    );
}
