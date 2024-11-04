import { useMemo } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import type { BreadcrumbItem } from "@/components/atoms/Breadcrumbs";
import { PageWrapper } from "@/components/atoms/PageWrapper";
import { ApiKeysCrudTable } from "./ApiKeysCrudTable";

export function ApiKeysListPage() {
    const t = useTranslations("features.management.apiKeys");
    const tRoot = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [
            { label: tRoot("features.home.title"), href: appRoutes.home() },
            { label: t("list.title"), href: appRoutes.management.apiKeys.list() },
        ];
    }, [t, tRoot]);

    return (
        <PageWrapper title={t("list.title")} breadcrumbs={breadcrumbs}>
            <ApiKeysCrudTable />
        </PageWrapper>
    );
}
