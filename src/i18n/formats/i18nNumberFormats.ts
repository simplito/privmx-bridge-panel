export enum NumberOfFractionDigits {
    Rough = 0,
    SemiPrecise = 1,
    Precise = 2,
    VeryPrecise = 3,
}

export enum I18nNumberFormatName {
    PercentageRough = "percentageRough",
    PercentageSemiPrecise = "percentageSemiPrecise",
    PercentagePrecise = "percentagePrecise",
    PercentageVeryPrecise = "percentageVeryPrecise",
    PlainNumberRough = "plainNumberRough",
    PlainNumberSemiPrecise = "plainNumberSemiPrecise",
    PlainNumberPrecise = "plainNumberPrecise",
    PlainNumberVeryPrecise = "plainNumberVeryPrecise",
}

export const i18nNumberFormats = {
    [I18nNumberFormatName.PercentageRough]: {
        style: "percent",
        minimumFractionDigits: NumberOfFractionDigits.Rough,
        maximumFractionDigits: NumberOfFractionDigits.Rough,
    },
    [I18nNumberFormatName.PercentageSemiPrecise]: {
        style: "percent",
        minimumFractionDigits: NumberOfFractionDigits.SemiPrecise,
        maximumFractionDigits: NumberOfFractionDigits.SemiPrecise,
    },
    [I18nNumberFormatName.PercentagePrecise]: {
        style: "percent",
        minimumFractionDigits: NumberOfFractionDigits.Precise,
        maximumFractionDigits: NumberOfFractionDigits.Precise,
    },
    [I18nNumberFormatName.PercentageVeryPrecise]: {
        style: "percent",
        minimumFractionDigits: NumberOfFractionDigits.VeryPrecise,
        maximumFractionDigits: NumberOfFractionDigits.VeryPrecise,
    },
    [I18nNumberFormatName.PlainNumberRough]: {
        style: "decimal",
        minimumFractionDigits: NumberOfFractionDigits.Rough,
        maximumFractionDigits: NumberOfFractionDigits.Rough,
    },
    [I18nNumberFormatName.PlainNumberSemiPrecise]: {
        style: "decimal",
        minimumFractionDigits: NumberOfFractionDigits.SemiPrecise,
        maximumFractionDigits: NumberOfFractionDigits.SemiPrecise,
    },
    [I18nNumberFormatName.PlainNumberPrecise]: {
        style: "decimal",
        minimumFractionDigits: NumberOfFractionDigits.Precise,
        maximumFractionDigits: NumberOfFractionDigits.Precise,
    },
    [I18nNumberFormatName.PlainNumberVeryPrecise]: {
        style: "decimal",
        minimumFractionDigits: NumberOfFractionDigits.VeryPrecise,
        maximumFractionDigits: NumberOfFractionDigits.VeryPrecise,
    },
} satisfies Record<I18nNumberFormatName, Intl.NumberFormatOptions>;
