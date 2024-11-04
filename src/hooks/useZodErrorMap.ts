import { useCallback } from "react";
import { useFormatter, useTranslations } from "use-intl";
import type { ZodErrorMap } from "zod";
import { getZodErrorMap } from "@/validation/getZodErrorMap";

export function useZodErrorMap(): ZodErrorMap {
    const t = useTranslations("forms.errors");
    const formatters = useFormatter();

    const errorMap = useCallback<ZodErrorMap>(
        (issue, ctx) => {
            return getZodErrorMap(t, formatters)(issue, ctx);
        },
        [formatters, t],
    );
    return errorMap;
}
