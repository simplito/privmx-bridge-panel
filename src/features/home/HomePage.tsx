import { Group, Stack, Text } from "@mantine/core";
import { useMemo } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import { AuthGuard } from "@/components/atoms/AuthGuard";
import type { BreadcrumbItem } from "@/components/atoms/Breadcrumbs";
import { PageWrapper } from "@/components/atoms/PageWrapper";
import { Button } from "@/components/button/Button";
import { DocsUtils } from "@/utils/DocsUtils";

export function HomePage() {
    const t = useTranslations("features.home");
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [{ label: t("breadcrumb"), href: appRoutes.home() }];
    }, [t]);

    return (
        <PageWrapper title={t("title")} breadcrumbs={breadcrumbs}>
            <Stack>
                <Text>{t("message_1")}</Text>
                <AuthGuard type="requireUnauthed" behavior="renderNothing">
                    <Text>{t("message_2_notSignedIn")}</Text>
                    <Group>
                        <Button type="link" preset="signIn" href={appRoutes.auth.signIn()} />
                        <Button type="linkExternal" href={DocsUtils.getDocsUrl()} priority="primary" icon="docs">
                            {t("openDocsButtonLabel")}
                        </Button>
                    </Group>
                </AuthGuard>
                <AuthGuard type="requireAuthed" behavior="renderNothing">
                    <Text>{t("message_2_signedIn")}</Text>
                    <Group>
                        <Button type="linkExternal" href={DocsUtils.getDocsUrl()} priority="primary" icon="docs">
                            {t("openDocsButtonLabel")}
                        </Button>
                    </Group>
                </AuthGuard>
            </Stack>
        </PageWrapper>
    );
}
