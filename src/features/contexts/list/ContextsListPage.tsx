import type { BreadcrumbItem } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import type * as ServerApiTypes from "privmx-server-api";
import { useMemo } from "react";
import { appRoutes } from "@/app/appRoutes";
import { PageWrapper } from "@/components/atoms/PageWrapper";
import { ContextsCrudTable } from "./ContextsCrudTable";

export interface ContextsListPageProps {
    solutionId?: ServerApiTypes.types.cloud.SolutionId | undefined;
}

export function ContextsListPage(props: ContextsListPageProps) {
    const { t } = useI18n("features.contexts");
    const { t: tRoot } = useI18n();
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
        return [
            { label: tRoot("features.home.breadcrumb"), href: appRoutes.home() },
            { label: t("list.title"), href: appRoutes.contexts.list() },
        ];
    }, [t, tRoot]);

    return (
        <PageWrapper title={t("list.title")} breadcrumbs={breadcrumbs}>
            <ContextsCrudTable solutionId={props.solutionId} />
        </PageWrapper>
    );
}
