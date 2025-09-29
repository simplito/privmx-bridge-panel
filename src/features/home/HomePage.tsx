import { type BreadcrumbItem, Button, Group, Stack, Text } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { useMemo } from "react";
import { appRoutes } from "@/app/appRoutes";
import { AuthGuard } from "@/components/atoms/AuthGuard";
import { PageWrapper } from "@/components/atoms/PageWrapper";
import { DocsUtils } from "@/utils/DocsUtils";

export function HomePage() {
    const { t } = useI18n("features.home");
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [{ label: t("breadcrumb"), href: appRoutes.home() }];
    }, [t]);

    return (
        <PageWrapper title={t("title")} breadcrumbs={breadcrumbs}>
            <Stack gap="md">
                <Text>{t("message_1")}</Text>
                <AuthGuard type="requireUnauthed" behavior="renderNothing">
                    <Text>{t("message_2_notSignedIn")}</Text>
                    <Group mt="md">
                        <Button type="link" preset="login" href={appRoutes.auth.login()} />
                        <Button type="linkExternal" href={DocsUtils.getDocsUrl()} variant="primary" icon="docs">
                            {t("openDocsButtonLabel")}
                        </Button>
                    </Group>
                </AuthGuard>
                <AuthGuard type="requireAuthed" behavior="renderNothing">
                    <Text>{t("message_2_signedIn")}</Text>
                    <Group mt="md">
                        <Button type="linkExternal" href={DocsUtils.getDocsUrl()} variant="primary" icon="docs">
                            {t("openDocsButtonLabel")}
                        </Button>
                    </Group>
                </AuthGuard>
            </Stack>
        </PageWrapper>
    );
}
