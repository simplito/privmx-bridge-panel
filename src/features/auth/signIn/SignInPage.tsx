import { useMemo } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import type { BreadcrumbItem } from "@/components/atoms/Breadcrumbs";
import { PageWrapper } from "@/components/atoms/PageWrapper";
import { SignInForm } from "./SignInForm";

export function SignInPage() {
    const t = useTranslations("features.auth.signIn");
    const tRoot = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [
            { label: tRoot("features.home.title"), href: appRoutes.home() },
            { label: t("title"), href: appRoutes.auth.signIn() },
        ];
    }, [t, tRoot]);

    return (
        <PageWrapper title={t("title")} breadcrumbs={breadcrumbs}>
            <SignInForm />
        </PageWrapper>
    );
}
