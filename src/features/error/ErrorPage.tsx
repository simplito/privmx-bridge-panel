import { Box, type BreadcrumbItem, Button, Stack, Text } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { useMemo } from "react";
import { appRoutes } from "@/app/appRoutes";
import { PageWrapper } from "@/components/atoms/PageWrapper";

export interface ErrorPageProps {
    error: "general" | "notFound";
}

export function ErrorPage(props: ErrorPageProps) {
    const { t } = useI18n(`features.error`);
    const { t: tError } = useI18n(`features.error.${props.error}`);
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [];
    }, []);

    return (
        <PageWrapper title={tError("title")} breadcrumbs={breadcrumbs}>
            <Stack>
                <Text>{tError("message")}</Text>
                <Box mt="lg">
                    <Button type="link" href={appRoutes.home()} icon="home" variant="primary">
                        {t("homeButtonLabel")}
                    </Button>
                </Box>
            </Stack>
        </PageWrapper>
    );
}
