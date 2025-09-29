/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { ValidationError, ValidationResult } from "privmx-components/validators/types";
import { validators } from "privmx-components/validators/validators";
import { StringValidationUtils } from "./StringValidationUtils";

export const validationSchemas = {
    apiKey: {
        id: () => validators.string().min(1).max(128),
        secret: () => validators.string().min(1).max(128),
        name: () => validators.string().min(1).max(128),
        scope: () => validators.array(validators.string().min(1).max(256)),
        enabled: () => validators.boolean(),
    },
    common: {
        email: () => validators.string().max(128).email(),
        emailOptional: () => validationSchemas.common.email().or(validators.literal("")),
        pubKey: () => validators.string().length(50).custom(validatePubKey),
    },
    context: {
        description: () => validators.string().max(2048),
        id: () => validators.string().min(8).max(128),
        name: () => validators.string().min(2).max(128),
        scope: () => validators.enum(["private", "public"]),
        solutionId: () => validationSchemas.solution.id(),
        userId: () => validators.string().min(1).max(128),
        userPubKey: () => validationSchemas.common.pubKey(),
        userAcl: () => validators.string().min(1).max(2048),
    },
    solution: {
        id: () => validators.string().min(8).max(128),
        name: () => validators.string().min(1).max(256),
    },
};

function validatePubKey(value: string): ValidationResult {
    const errors: ValidationError[] = [];

    if (!StringValidationUtils.isStringBase58(value)) {
        errors.push({
            type: "custom",
            path: [],
            args: {},
            message: "Invalid public key",
            i18nKey: "forms.validation.pubKey.invalid",
        });
    }

    return {
        valid: errors.length === 0,
        errors: errors,
    };
}
