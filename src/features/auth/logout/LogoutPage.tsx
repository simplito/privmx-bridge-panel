import type { BreadcrumbItem } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { useEffect, useMemo } from "react";
import { appRoutes } from "@/app/appRoutes";
import { PageWrapper } from "@/components/atoms/PageWrapper";
import { useAuthData } from "@/hooks/useAuthData";
import { AuthPersistence } from "../AuthPersistence";

export function LogoutPage() {
    const { setAuthData } = useAuthData();
    const { t } = useI18n("features.auth.logout");
    const { t: tRoot } = useI18n();
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
