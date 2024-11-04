/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { z } from "zod";
import { StringValidationUtils } from "./StringValidationUtils";

export const zodSchemas = {
    apiKey: {
        id: () => z.string().min(1).max(128),
        secret: () => z.string().min(1).max(128),
        name: () => z.string().min(1).max(128),
        scope: () => z.array(z.string().min(1).max(256)),
        enabled: () => z.boolean(),
    },
    common: {
        email: () => z.string().max(128).email(),
        emailOptional: () => zodSchemas.common.email().or(z.literal("")),
        pubKey: () =>
            z
                .string()
                .length(50)
                .refine((value) => StringValidationUtils.isStringBase58(value), { message: "Invalid public key" }),
    },
    context: {
        description: () => z.string().max(2048),
        id: () => z.string().min(8).max(128),
        name: () => z.string().min(2).max(128),
        scope: () => z.enum(["private", "public"]),
        solutionId: () => zodSchemas.solution.id(),
        userId: () => z.string().min(1).max(128),
        userPubKey: () => zodSchemas.common.pubKey(),
        userAcl: () => z.string().min(1).max(2048),
    },
    solution: {
        id: () => z.string().min(8).max(128),
        name: () => z.string().min(1).max(256),
    },
    z: z,
};
