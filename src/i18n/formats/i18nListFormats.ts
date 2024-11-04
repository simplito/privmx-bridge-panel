export enum I18nListFormatName {
    ConjunctionWithAnd = "conjunctionWithAnd",
    ConjunctionWithoutAnd = "conjunctionWithoutAnd",
    DisjunctionWithOr = "disjunctionWithOr",
}

export const i18nListFormats = {
    [I18nListFormatName.ConjunctionWithAnd]: {
        type: "conjunction",
        style: "long",
    },
    [I18nListFormatName.ConjunctionWithoutAnd]: {
        type: "conjunction",
        style: "narrow",
    },
    [I18nListFormatName.DisjunctionWithOr]: {
        type: "disjunction",
        style: "long",
    },
} satisfies Record<I18nListFormatName, Intl.ListFormatOptions>;
