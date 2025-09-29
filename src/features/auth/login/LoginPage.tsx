import type { BreadcrumbItem } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { useMemo } from "react";
import { appRoutes } from "@/app/appRoutes";
import { PageWrapper } from "@/components/atoms/PageWrapper";
import { LoginForm } from "./LoginForm";

export function LoginPage() {
    const { t } = useI18n("features.auth.login");
    const { t: tRoot } = useI18n();
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [
            { label: tRoot("features.home.breadcrumb"), href: appRoutes.home() },
            { label: t("title"), href: appRoutes.auth.login() },
        ];
    }, [t, tRoot]);

    return (
        <PageWrapper title={t("title")} breadcrumbs={breadcrumbs}>
            <LoginForm />
        </PageWrapper>
    );
}
