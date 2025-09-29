import type { BreadcrumbItem } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { useMemo } from "react";
import { appRoutes } from "@/app/appRoutes";
import { PageWrapper } from "@/components/atoms/PageWrapper";
import { ApiKeysCrudTable } from "./ApiKeysCrudTable";

export function ApiKeysListPage() {
    const { t } = useI18n("features.apiKeys");
    const { t: tRoot } = useI18n();
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [
            { label: tRoot("features.home.breadcrumb"), href: appRoutes.home() },
            { label: t("list.title"), href: appRoutes.access.list() },
        ];
    }, [t, tRoot]);

    return (
        <PageWrapper title={t("list.title")} breadcrumbs={breadcrumbs}>
            <ApiKeysCrudTable />
        </PageWrapper>
    );
}
