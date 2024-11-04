import type { FormErrors } from "@mantine/form";
import type { Schema } from "zod";

// Moved from mantine-form-zod-resolver (https://github.com/mantinedev/mantine-form-zod-resolver/blob/master/src/zod-resolver.ts) due the package (mantine-form-zod-resolver) causing build errors
export function zodResolver(schema: Schema) {
    return (values: Record<string, unknown>): FormErrors => {
        const parsed = schema.safeParse(values);

        if (parsed.success) {
            return {};
        }

        const results: FormErrors = {};

        if ("error" in parsed) {
            parsed.error.errors.forEach((error) => {
                results[error.path.join(".")] = error.message;
            });
        }

        return results;
    };
}
