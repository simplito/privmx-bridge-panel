import type { I18nDateTimeFormatName } from "@/i18n/formats/i18nDateTimeFormats";
import type { I18nNumberFormatName } from "@/i18n/formats/i18nNumberFormats";
import type { BooleanValueProps } from "../atoms/BooleanValue";

export interface BaseProp {
    id: string;
    label: React.ReactNode;
    preLabelNode?: React.ReactNode | undefined;
    postLabelNode?: React.ReactNode | undefined;
    withCopyButton?: boolean | undefined;
    hidden?: boolean | undefined;
}

export interface BasePropWithText extends BaseProp {
    useMonospaceFont?: boolean | undefined;
}

export interface BaseStringProp extends BasePropWithText {
    value: string;
    emptyValueMessage?: React.ReactNode | undefined;
}

export interface ShortStringProp extends BaseStringProp {
    type: "shortString";
}

export interface LongStringProp extends BaseStringProp {
    type: "longString";
    whiteSpace?: React.CSSProperties["whiteSpace"] | undefined;
}

export interface EmailProp extends BaseStringProp {
    type: "email";
}

export interface UrlProp extends BaseStringProp {
    type: "url";
}

export interface NumberProp extends BasePropWithText {
    type: "number";
    value: number;
    formatName?: I18nNumberFormatName | undefined;
    prefix?: string | undefined;
    suffix?: string | undefined;
}

export interface BooleanProp extends BaseProp {
    type: "boolean";
    value: boolean;
    yesColor?: BooleanValueProps["yesColor"] | undefined;
    noColor?: BooleanValueProps["noColor"] | undefined;
}

export interface DateTimeProp extends BaseProp {
    type: "dateTime";
    value: number;
    formatName?: I18nDateTimeFormatName | undefined;
    emptyValueMessage?: React.ReactNode;
    useMonospaceFont?: boolean | undefined;
}

export interface CustomProp extends BaseProp {
    type: "custom";
    value: React.ReactNode;
    withCopyButton: false;
    copyableValue?: string | undefined;
    emptyValueMessage?: React.ReactNode | undefined;
}

export type Prop = ShortStringProp | LongStringProp | EmailProp | UrlProp | NumberProp | BooleanProp | DateTimeProp | CustomProp;
