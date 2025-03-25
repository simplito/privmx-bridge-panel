import { useMemo } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import type { BreadcrumbItem } from "@/components/atoms/Breadcrumbs";
import { PageWrapper } from "@/components/atoms/PageWrapper";
import { LoginForm } from "./LoginForm";

export function LoginPage() {
    const t = useTranslations("features.auth.login");
    const tRoot = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [
            { label: tRoot("features.home.title"), href: appRoutes.home() },
            { label: t("title"), href: appRoutes.auth.login() },
        ];
    }, [t, tRoot]);

    return (
        <PageWrapper title={t("title")} breadcrumbs={breadcrumbs}>
            <LoginForm />
        </PageWrapper>
    );
}
