import { Select, type SelectProps } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { useMemo } from "react";
import { contextScopes } from "@/privMxBridgeApi/contextScopes";

export type ContextScopeSelectProps = Omit<SelectProps, "options">;

export function ContextScopeSelect(props: ContextScopeSelectProps) {
    const { t } = useI18n("api.context.scope");
    // eslint-disable-next-line react/destructuring-assignment
    const { ...selectProps } = props;
    const options: React.ComponentProps<typeof Select>["options"] = useMemo(() => {
        return contextScopes.map((scope) => ({ value: scope, label: t(scope) }));
    }, [t]);

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Select {...selectProps} options={options} />;
}
