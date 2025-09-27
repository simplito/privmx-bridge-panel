import { useEffect, useMemo } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import type { BreadcrumbItem } from "@/components/atoms/Breadcrumbs";
import { PageWrapper } from "@/components/atoms/PageWrapper";
import { useAuthData } from "@/hooks/useAuthData";
import { AuthPersistence } from "../AuthPersistence";

export function LogoutPage() {
    const { setAuthData } = useAuthData();
    const t = useTranslations("features.auth.logout");
    const tRoot = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [
            { label: tRoot("features.home.breadcrumb"), href: appRoutes.home() },
            { label: t("title"), href: appRoutes.auth.logout() },
        ];
    }, [t, tRoot]);
    useEffect(() => {
        setAuthData((prev) => {
            if (prev.privMxBridgeApiAuthData === null) {
                return prev;
            }
            return {
                privMxBridgeApiAuthData: null,
            };
        });
        AuthPersistence.clearAuthData();
    }, [setAuthData]);

    return (
        <PageWrapper title={t("title")} breadcrumbs={breadcrumbs}>
            {t("message")}
        </PageWrapper>
    );
}
