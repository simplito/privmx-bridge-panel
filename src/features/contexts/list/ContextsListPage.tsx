import type * as ServerApiTypes from "privmx-server-api";
import { useMemo } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import type { BreadcrumbItem } from "@/components/atoms/Breadcrumbs";
import { PageWrapper } from "@/components/atoms/PageWrapper";
import { ContextsCrudTable } from "./ContextsCrudTable";

export interface ContextsListPageProps {
    solutionId?: ServerApiTypes.types.cloud.SolutionId | undefined;
}

export function ContextsListPage(props: ContextsListPageProps) {
    const t = useTranslations("features.contexts");
    const tRoot = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [
            { label: tRoot("features.home.title"), href: appRoutes.home() },
            { label: t("list.title"), href: appRoutes.contexts.list() },
        ];
    }, [t, tRoot]);

    return (
        <PageWrapper title={t("list.title")} breadcrumbs={breadcrumbs}>
            <ContextsCrudTable solutionId={props.solutionId} />
        </PageWrapper>
    );
}
