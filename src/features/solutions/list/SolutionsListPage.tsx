import { useMemo } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import type { BreadcrumbItem } from "@/components/atoms/Breadcrumbs";
import { PageWrapper } from "@/components/atoms/PageWrapper";
import { SolutionsCrudTable } from "./SolutionsCrudTable";

export function SolutionsListPage() {
    const t = useTranslations("features.solutions");
    const tRoot = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [
            { label: tRoot("features.home.title"), href: appRoutes.home() },
            { label: t("list.title"), href: appRoutes.solutions.list() },
        ];
    }, [t, tRoot]);

    return (
        <PageWrapper title={t("list.title")} breadcrumbs={breadcrumbs}>
            <SolutionsCrudTable />
        </PageWrapper>
    );
}
