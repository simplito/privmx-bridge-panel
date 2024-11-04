/* eslint-disable max-lines-per-function */

import type { useFormatter, useTranslations } from "use-intl";
import { type ZodErrorMap, ZodIssueCode, ZodParsedType, util } from "zod";
import { I18nDateTimeFormatName } from "@/i18n/formats/i18nDateTimeFormats";
import { I18nListFormatName } from "@/i18n/formats/i18nListFormats";

type FormErrorTranslator = ReturnType<typeof useTranslations<"forms.errors">>;
type Formatters = ReturnType<typeof useFormatter>;

export function getZodErrorMap(t: FormErrorTranslator, formatters: Formatters): ZodErrorMap {
    const { dateTime: formatDateTime, list: formatList } = formatters;
    return (issue, ctx) => {
        let message;
        switch (issue.code) {
            case ZodIssueCode.invalid_type:
                if (issue.received === ZodParsedType.undefined) {
                    message = t("required");
                } else {
                    message = t("invalidType", { expected: issue.expected, received: issue.received });
                }
                break;
            case ZodIssueCode.invalid_literal:
                message = t("invalidLiteral", { expected: JSON.stringify(issue.expected, util.jsonStringifyReplacer) });
                break;
            case ZodIssueCode.unrecognized_keys:
                message = t("unrecognizedKeys", { count: issue.keys.length, keys: formatList(issue.keys, I18nListFormatName.ConjunctionWithoutAnd) });
                break;
            case ZodIssueCode.invalid_union:
                message = t("invalidUnion");
                break;
            case ZodIssueCode.invalid_union_discriminator:
                message = t("invalidUnionDiscriminator", { expected: util.joinValues(issue.options) });
                break;
            case ZodIssueCode.invalid_enum_value:
                message = t("invalidEnumValue", { expected: util.joinValues(issue.options), received: issue.received });
                break;
            case ZodIssueCode.invalid_arguments:
                message = t("invalidArguments");
                break;
            case ZodIssueCode.invalid_return_type:
                message = t("invalidReturnType");
                break;
            case ZodIssueCode.invalid_date:
                message = t("invalidDate");
                break;
            case ZodIssueCode.invalid_string:
                if (typeof issue.validation === "object") {
                    if ("includes" in issue.validation) {
                        message = t("invalidString.includes.simple", { includes: issue.validation.includes });
                        if (typeof issue.validation.position === "number") {
                            message = t("invalidString.includes.atPositions", { includes: issue.validation.includes, position: issue.validation.position });
                        }
                    } else if ("startsWith" in issue.validation) {
                        message = t("invalidString.startsWith", { startsWith: issue.validation.startsWith });
                    } else if ("endsWith" in issue.validation) {
                        message = t("invalidString.endsWith", { endsWith: issue.validation.endsWith });
                    } else {
                        util.assertNever(issue.validation);
                    }
                } else if (issue.validation === "regex") {
                    message = t("invalidString.format.regex");
                } else {
                    message = t(`invalidString.format.${issue.validation}`);
                }
                break;
            case ZodIssueCode.too_small:
                if (issue.type === "array") {
                    message = t("tooSmall.array", { minimum: Number(issue.minimum), condition: issue.exact === true ? "eq" : issue.inclusive ? "gte" : "gt" });
                } else if (issue.type === "set") {
                    message = t("tooSmall.set", { minimum: Number(issue.minimum), condition: issue.exact === true ? "eq" : issue.inclusive ? "gte" : "gt" });
                } else if (issue.type === "string") {
                    message = t("tooSmall.string", { minimum: Number(issue.minimum), condition: issue.exact === true ? "eq" : issue.inclusive ? "gte" : "gt" });
                } else if (issue.type === "number") {
                    message = t("tooSmall.number", { minimum: Number(issue.minimum), condition: issue.exact === true ? "eq" : issue.inclusive ? "gte" : "gt" });
                } else if (issue.type === "bigint") {
                    message = t("tooSmall.bigint", { minimum: Number(issue.minimum), condition: issue.exact === true ? "eq" : issue.inclusive ? "gte" : "gt" });
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                } else if (issue.type === "date") {
                    message = t("tooSmall.date", {
                        minimum: formatDateTime(Number(issue.minimum), I18nDateTimeFormatName.DmyHms),
                        condition: issue.exact === true ? "eq" : issue.inclusive ? "gte" : "gt",
                    });
                } else {
                    t("tooSmall.unknown");
                }
                break;
            case ZodIssueCode.too_big:
                if (issue.type === "array") {
                    message = t("tooBig.array", { maximum: Number(issue.maximum), condition: issue.exact === true ? "eq" : issue.inclusive ? "lte" : "lt" });
                } else if (issue.type === "set") {
                    message = t("tooBig.set", { maximum: Number(issue.maximum), condition: issue.exact === true ? "eq" : issue.inclusive ? "lte" : "lt" });
                } else if (issue.type === "string") {
                    message = t("tooBig.string", { maximum: Number(issue.maximum), condition: issue.exact === true ? "eq" : issue.inclusive ? "lte" : "lt" });
                } else if (issue.type === "number") {
                    message = t("tooBig.number", { maximum: Number(issue.maximum), condition: issue.exact === true ? "eq" : issue.inclusive ? "lte" : "lt" });
                } else if (issue.type === "bigint") {
                    message = t("tooBig.bigint", { maximum: Number(issue.maximum), condition: issue.exact === true ? "eq" : issue.inclusive ? "lte" : "lt" });
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                } else if (issue.type === "date") {
                    message = t("tooBig.date", {
                        maximum: formatDateTime(Number(issue.maximum), I18nDateTimeFormatName.DmyHms),
                        condition: issue.exact === true ? "eq" : issue.inclusive ? "lte" : "lt",
                    });
                } else {
                    message = t("tooBig.unknown");
                }
                break;
            case ZodIssueCode.invalid_intersection_types:
                message = t("invalidIntersectionTypes");
                break;
            case ZodIssueCode.not_multiple_of:
                message = t("notMultipleOf", { multipleOf: issue.multipleOf.toString() });
                break;
            case ZodIssueCode.not_finite:
                message = t("notFinite");
                break;
            case ZodIssueCode.custom:
                if (issue.params === undefined) {
                    message = t("custom.unknown");
                } else {
                    switch (issue.params["type"]) {
                        default:
                            message = t("custom.unknown");
                            break;
                    }
                }
                break;
            default:
                message = ctx.defaultError;
        }
        return { message: message ?? ctx.defaultError };
    };
}
