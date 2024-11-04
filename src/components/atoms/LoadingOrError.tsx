import { Center, Group, Loader, Text } from "@mantine/core";
import { useTranslations } from "use-intl";
import { getErrorMessage } from "@/utils/miscFunctions/getErrorMessage";
import { Button } from "../button/Button";

export interface LoadingOrErrorProps {
    isLoading: boolean;
    error?: unknown;
    errorMessage?: string | null | undefined;
    retry?: () => unknown;
    loaderSize?: "xs" | "sm" | "md" | "lg" | "xl" | undefined;
}

export function LoadingOrError(props: LoadingOrErrorProps) {
    const t = useTranslations();
    const handleRetry = props.retry;

    return (
        <>
            {props.isLoading ? (
                <Center w="100%">
                    <Loader size={props.loaderSize} />
                </Center>
            ) : null}
            {Boolean(props.errorMessage) || Boolean(props.error) ? (
                <Center w="100%">
                    <Group gap="xl">
                        <Text size="lg" c="red" fw="bolder">
                            {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */}
                            {props.errorMessage ?? (props.error ? getErrorMessage(props.error) : "Error")}
                        </Text>
                        {handleRetry ? (
                            <Button type="button" onClick={handleRetry} size="sm" priority="tertiary">
                                {t("retry")}
                            </Button>
                        ) : null}
                    </Group>
                </Center>
            ) : null}
        </>
    );
}
