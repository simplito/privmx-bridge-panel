import { Select, type SelectProps } from "@mantine/core";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "use-intl";
import { useDataLoader } from "@/hooks/useDataLoader";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useSolutionApi } from "@/hooks/useSolutionApi";
import type { SolutionApi } from "@/privMxBridgeApi/SolutionApi";

export interface SolutionSelectProps extends Omit<SelectProps, "data"> {
    omitSolutionIds?: ServerApiTypes.types.cloud.SolutionId[] | undefined;
}

async function loadSolutions(solutionApi: SolutionApi): Promise<ServerApiTypes.api.solution.Solution[]> {
    const res = await solutionApi.listSolutions();
    return res.list;
}

export function SolutionSelect(props: SolutionSelectProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const { omitSolutionIds, ...selectProps } = props;
    const t = useTranslations("components.apiFormInputs");
    const solutionApi = useSolutionApi();
    const [solutions, setSolutions] = useState<ServerApiTypes.api.solution.Solution[]>([]);
    const solutionsLoader = useCallback(async () => await loadSolutions(solutionApi), [solutionApi]);
    const { isLoading: isLoadingSolutions, error: solutionsLoadingError, reload: reloadSolutions } = useDataLoader(solutionsLoader, setSolutions);
    const options = useMemo(
        () =>
            solutions
                .filter((solution) => (omitSolutionIds === undefined ? true : !omitSolutionIds.includes(solution.id)))
                .map((solution) => ({ value: solution.id, label: solution.name })),
        [omitSolutionIds, solutions],
    );
    usePrivMxBridgeApiEventListener("solutionsChanged", reloadSolutions);

    return (
        <Select
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...selectProps}
            label={selectProps.label ?? t("solution")}
            placeholder={
                isLoadingSolutions
                    ? t("loadingSolutions")
                    : solutionsLoadingError === undefined || solutionsLoadingError === null
                      ? selectProps.placeholder
                      : t("failedToLoadSolutions")
            }
            disabled={isLoadingSolutions ? true : selectProps.disabled}
            data={options}
        />
    );
}
