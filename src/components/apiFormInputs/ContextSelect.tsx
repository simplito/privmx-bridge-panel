import { Select, type SelectProps } from "@mantine/core";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "use-intl";
import { useContextApi } from "@/hooks/useContextApi";
import { useDataLoader } from "@/hooks/useDataLoader";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { ApiUtils } from "@/privMxBridgeApi/ApiUtils";
import type { ContextApi } from "@/privMxBridgeApi/ContextApi";

export interface ContextSelectProps extends Omit<SelectProps, "data"> {
    solutionId?: ServerApiTypes.types.cloud.SolutionId | undefined;
}

async function loadContexts(contextApi: ContextApi, solutionId?: ServerApiTypes.types.cloud.SolutionId): Promise<ServerApiTypes.api.context.Context[]> {
    const pageSize = 100;
    if (solutionId) {
        return await ApiUtils.loadAllPages(pageSize, async (pageId) => {
            const res = await contextApi.listContextsOfSolution({
                solutionId: solutionId,
                limit: pageSize,
                skip: pageId * pageSize,
                sortOrder: "desc",
            });
            return { totalCount: res.count, pageItems: res.list };
        });
    }
    return await ApiUtils.loadAllPages(pageSize, async (pageId) => {
        const res = await contextApi.listContexts({
            limit: pageSize,
            skip: pageId * pageSize,
            sortOrder: "desc",
        });
        return { totalCount: res.count, pageItems: res.list };
    });
}

export function ContextSelect(props: ContextSelectProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const { solutionId, ...selectProps } = props;
    const t = useTranslations("components.apiFormInputs");
    const contextApi = useContextApi();
    const [contexts, setContexts] = useState<ServerApiTypes.api.context.Context[]>([]);
    const contextsLoader = useCallback(async () => await loadContexts(contextApi, solutionId), [contextApi, solutionId]);
    const { isLoading: isLoadingContexts, error: contextsLoadingError, reload: reloadContexts } = useDataLoader(contextsLoader, setContexts);
    const options = useMemo(() => contexts.map((context) => ({ value: context.id, label: context.name })), [contexts]);
    usePrivMxBridgeApiEventListener("contextsChanged", reloadContexts);

    return (
        <Select
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...selectProps}
            label={selectProps.label ?? t("context")}
            placeholder={
                isLoadingContexts
                    ? t("loadingContexts")
                    : contextsLoadingError === undefined || contextsLoadingError === null
                      ? selectProps.placeholder
                      : t("failedToLoadContexts")
            }
            disabled={isLoadingContexts ? true : selectProps.disabled}
            data={options}
        />
    );
}
