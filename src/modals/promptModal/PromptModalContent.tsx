import { Box, Center, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback } from "react";
import { type ZodString, z } from "zod";
import { ModalButtons } from "@/components/atoms/ModalButtons";
import { zodResolver } from "@/validation/zodResolver";

type PromptModalResult = { result: "cancelled" } | { result: "submitted"; value: string };

export interface PromptModalContentProps {
    onResult: (result: PromptModalResult) => void;
    content?: React.ReactNode | undefined;
    initialValue?: string | undefined;
    inputPlaceholder?: string | undefined;
    validationSchema?: ZodString | undefined;
}

export function PromptModalContent(props: PromptModalContentProps) {
    const schema = z.object({
        value: props.validationSchema ?? z.string(),
    });
    type FormValues = z.infer<typeof schema>;

    const form = useForm<FormValues>({
        initialValues: {
            value: props.initialValue ?? "",
        },
        validate: zodResolver(schema),
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
                            withAsterisk
                            placeholder={props.inputPlaceholder}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...form.getInputProps("value")}
                            data-autofocus
                        />
                    </Stack>
                </Box>
                <ModalButtons onCancel={handleCancelClick} onConfirm="formSubmit" confirmButtonPreset="create" cancelButtonPreset="cancel" />
            </Stack>
        </form>
    );
}
