import { Box, Stack, Text } from "@mantine/core";
import { useMemo } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import type { BreadcrumbItem } from "@/components/atoms/Breadcrumbs";
import { PageWrapper } from "@/components/atoms/PageWrapper";
import { Button } from "@/components/button/Button";

export interface ErrorPageProps {
    error: "general" | "notFound";
}

export function ErrorPage(props: ErrorPageProps) {
    const t = useTranslations(`features.error`);
    const tError = useTranslations(`features.error.${props.error}`);
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [];
    }, []);

    return (
        <PageWrapper title={tError("title")} breadcrumbs={breadcrumbs}>
            <Stack>
                <Text>{tError("message")}</Text>
                <Box mt="lg">
                    <Button type="link" href={appRoutes.home()} icon="home" priority="primary">
                        {t("homeButtonLabel")}
                    </Button>
                </Box>
            </Stack>
        </PageWrapper>
    );
}
