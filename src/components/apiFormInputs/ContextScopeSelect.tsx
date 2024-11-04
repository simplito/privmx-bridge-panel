import { Select, type SelectProps } from "@mantine/core";
import { useMemo } from "react";
import { useTranslations } from "use-intl";
import { contextScopes } from "@/privMxBridgeApi/contextScopes";

export type ContextScopeSelectProps = Omit<SelectProps, "data">;

export function ContextScopeSelect(props: ContextScopeSelectProps) {
    const t = useTranslations("api.context.scope");
    // eslint-disable-next-line react/destructuring-assignment
    const { ...selectProps } = props;
    const options: React.ComponentProps<typeof Select>["data"] = useMemo(() => {
        return contextScopes.map((scope) => ({ value: scope, label: t(scope) }));
    }, [t]);

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Select {...selectProps} data={options} />;
}
