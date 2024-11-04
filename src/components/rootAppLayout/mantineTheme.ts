/* eslint-disable @typescript-eslint/strict-boolean-expressions, @typescript-eslint/naming-convention, max-lines-per-function */

import type { CSSVariablesResolver, DefaultMantineColor, MantineColorsTuple, MantineThemeOverride } from "@mantine/core";
import {
    ActionIcon,
    AppShell,
    AppShellNavbar,
    Autocomplete,
    Breadcrumbs,
    Checkbox,
    MultiSelect,
    NavLink,
    NumberInput,
    Pagination,
    Paper,
    PasswordInput,
    Radio,
    Select,
    Switch,
    Table,
    TextInput,
    Textarea,
    defaultVariantColorsResolver,
} from "@mantine/core";
import { ColorUtils } from "@/utils/ColorUtils";

export const colors = {
    "document/activeElements/background": "#00E069",
    "document/activeElements/backgroundSelected": "#063E5633",
    "document/activeElements/bgdActive": "#24FF5E",
    "document/activeElements/text": "#00182E",
    "document/activeElements/textActive": "#00182E",
    "document/backgrounds/appBody": "#000C17",
    "document/backgrounds/body": "#00182E",
    "document/backgrounds/bodyAccent": "#04646C",
    "document/backgrounds/grid": "#063E56",
    "document/backgrounds/module": "#063E56",
    "document/backgrounds/moduleAccent": "#008F7C",
    "document/typography/accent": "#00EB75",
    "document/typography/header": "#FCFDFC",
    "document/typography/text": "#D7E9EA",
} as const;

export const getMantineTheme = (_themeColor: string): MantineThemeOverride => {
    return {
        colors: {
            primary: generateMantineColorsTuple(colors["document/typography/accent"]),
            subtle: ["#f8f9fa", "#f1f3f5", "#e9ecef", "#dee2e6", "#ced4da", "#adb5bd", "#868e96", "#495057", "#343a40", "#212529"],
            info: ["#e7f5ff", "#d0ebff", "#a5d8ff", "#74c0fc", "#4dabf7", "#339af0", "#228be6", "#1c7ed6", "#1971c2", "#1864ab"],
            success: ["#e6fcf5", "#c3fae8", "#96f2d7", "#63e6be", "#38d9a9", "#20c997", "#12b886", "#0ca678", "#099268", "#087f5b"],
            warning: ["#fff4e6", "#ffe8cc", "#ffd8a8", "#ffc078", "#ffa94d", "#ff922b", "#fd7e14", "#f76707", "#e8590c", "#d9480f"],
            error: ["#fff5f5", "#ffe3e3", "#ffc9c9", "#ffa8a8", "#ff8787", "#ff6b6b", "#fa5252", "#f03e3e", "#e03131", "#c92a2a"],
        },
        primaryColor: "primary",
        primaryShade: 5,

        components: {
            ActionIcon: ActionIcon.extend({
                styles(_theme, _props) {
                    return {
                        root: {
                            color: colors["document/typography/text"],
                        },
                    };
                },
            }),
            AppShell: AppShell.extend({
                classNames: {
                    root: "pmx-AppShell",
                },
            }),
            AppShellNavbar: AppShellNavbar.extend({
                defaultProps: {
                    bg: colors["document/backgrounds/body"],
                },
            }),
            Breadcrumbs: Breadcrumbs.extend({
                classNames: {
                    root: "pmx-Breadcrumbs",
                    separator: "pmx-BreadcrumbsSeparator",
                },
            }),
            NavLink: NavLink.extend({
                styles(_theme, props) {
                    return {
                        root: {
                            color: props.active ? colors["document/typography/header"] : colors["document/typography/text"],
                            background: props.active ? colors["document/activeElements/backgroundSelected"] : undefined,
                        },
                        section: {
                            color: props.active ? colors["document/typography/accent"] : colors["document/backgrounds/moduleAccent"],
                        },
                    };
                },
                classNames: {
                    root: "pmx-NavLink-root",
                    section: "pmx-NavLink-section",
                },
            }),
            Pagination: Pagination.extend({
                classNames: {
                    root: "pmx-Pagination",
                    control: "pmx-PaginationControl",
                    dots: "pmx-PaginationDots",
                },
            }),
            Paper: Paper.extend({
                styles(_theme, _props) {
                    return {
                        root: {
                            background: colors["document/backgrounds/body"],
                            backgroundColor: colors["document/backgrounds/body"],
                        },
                    };
                },
            }),
            Table: Table.extend({
                classNames: {
                    table: "pmx-Table",
                },
            }),

            // Forms
            Autocomplete: Autocomplete.extend({
                classNames: {
                    root: "pmx-Autocomplete",
                },
            }),
            Checkbox: Checkbox.extend({
                classNames: {
                    root: "pmx-Checkbox",
                },
            }),
            MultiSelect: MultiSelect.extend({
                classNames: {
                    root: "pmx-MultiSelect",
                },
            }),
            NumberInput: NumberInput.extend({
                classNames: {
                    root: "pmx-NumberInput",
                },
            }),
            PasswordInput: PasswordInput.extend({
                classNames: {
                    root: "pmx-PasswordInput",
                },
            }),
            Radio: Radio.extend({
                classNames: {
                    root: "pmx-Radio",
                },
            }),
            Select: Select.extend({
                classNames: {
                    root: "pmx-Select",
                },
            }),
            Switch: Switch.extend({
                classNames: {
                    root: "pmx-Switch",
                },
            }),
            Textarea: Textarea.extend({
                classNames: {
                    root: "pmx-Textarea",
                },
            }),
            TextInput: TextInput.extend({
                classNames: {
                    root: "pmx-TextInput",
                },
            }),
        },

        variantColorResolver: (input) => {
            const { variant } = input;
            const defaultResolvedColors = defaultVariantColorsResolver(input);

            // filled = primary
            if (variant === "filled") {
                return {
                    ...defaultResolvedColors,
                    background: colors["document/activeElements/background"],
                    color: colors["document/activeElements/text"],
                    hover: colors["document/activeElements/bgdActive"],
                    hoverColor: colors["document/activeElements/textActive"],
                    border: "none",
                };
            }

            // outline = secondary
            if (variant === "outline") {
                return {
                    ...defaultResolvedColors,
                    background: "none",
                    color: colors["document/typography/header"],
                    border: `1px solid ${colors["document/typography/text"]}`,
                    hover: colors["document/activeElements/bgdActive"],
                    hoverColor: colors["document/activeElements/textActive"],
                };
            }

            // subtle = lowProfile
            if (variant === "subtle") {
                return {
                    ...defaultResolvedColors,
                    background: colors["document/backgrounds/bodyAccent"],
                    color: colors["document/typography/text"],
                    border: "none",
                    hover: colors["document/activeElements/bgdActive"],
                    hoverColor: colors["document/activeElements/textActive"],
                };
            }

            // light = secondaryLowProfile
            if (variant === "light") {
                return {
                    ...defaultResolvedColors,
                    background: "none",
                    color: colors["document/typography/header"],
                    border: `1px solid ${colors["document/backgrounds/grid"]}`,
                    hover: colors["document/activeElements/bgdActive"],
                    hoverColor: colors["document/activeElements/textActive"],
                };
            }

            // transparent = link
            if (variant === "transparent") {
                return {
                    ...defaultResolvedColors,
                    background: "none",
                    color: colors["document/typography/header"],
                    border: "none",
                    hover: "none",
                    hoverColor: colors["document/typography/accent"],
                };
            }

            return defaultResolvedColors;
        },
    };
};

export const mantineTheme = getMantineTheme("#000C17");

export const themeCssVariablesResolver: CSSVariablesResolver = (_theme) => {
    return {
        variables: {
            "--mantine-color-body": colors["document/backgrounds/appBody"],
        },
        dark: {
            "--mantine-color-body": colors["document/backgrounds/appBody"],
            "--mantine-color-text": colors["document/typography/text"],
            "--mantine-color-primary-text": colors["document/typography/text"],
            "--mantine-color-anchor": colors["document/typography/text"],
            "--nl-hover": "#ff0000",
        },
        light: {
            "--mantine-color-body": colors["document/backgrounds/appBody"],
            "--mantine-color-text": colors["document/typography/text"],
            "--mantine-color-primary-text": colors["document/typography/text"],
            "--mantine-color-anchor": colors["document/typography/text"],
            "--nl-hover": "#ff0000",
        },
    };
};

export const customCss = `
    html, body {
        background: ${colors["document/backgrounds/appBody"]};
    }
    [data-mantine-color-scheme] .pmx-AppShell {
        --_app-shell-border-color: ${colors["document/backgrounds/module"]};
        --app-shell-border-color: ${colors["document/backgrounds/module"]};
    }
    .pmx-Breadcrumbs {
        font-size: 0.9em;
    }
    .pmx-Breadcrumbs a {
        text-decoration: none;
        text-transform: uppercase;
        font-weight: bold;
        letter-spacing: 1px;
    }
    .pmx-BreadcrumbsSeparator {
        color: ${colors["document/backgrounds/moduleAccent"]};
    }
    .pmx-NavLink-root:hover {
        background: ${colors["document/activeElements/backgroundSelected"]};
    }
    .pmx-NavLink-root:hover .pmx-NavLink-section {
        color: ${colors["document/typography/accent"]};
    }
    [data-mantine-color-scheme] .pmx-Table {
        --_table-border-color: ${colors["document/backgrounds/grid"]};
        --table-border-color: ${colors["document/backgrounds/grid"]};
    }
    [data-mantine-color-scheme] .pmx-Table tr.pmx-Table-row-clickable {
        cursor: pointer;
    }
    [data-mantine-color-scheme] .pmx-Table tr.pmx-Table-row-clickable:hover {
        background: ${colors["document/backgrounds/body"]};
    }
    [data-mantine-color-scheme] .pmx-Table th {
        font-weight: 400;
    }
    a {
        color: ${colors["document/backgrounds/moduleAccent"]};
    }
    .pmx-AppSidebarLink .mantine-NavLink-label {
        font-weight: 500;
    }
    .pmx-AppSidebarLink--lg .mantine-NavLink-label {
        font-size: var(--mantine-font-size-lg);
    }
    .pmx-PaginationControl[data-active=true] {
        background: ${colors["document/activeElements/background"]};
        color: ${colors["document/activeElements/text"]};
    }
    .pmx-PaginationControl[data-active=true]:hover {
        background: ${colors["document/activeElements/bgdActive"]};
        color: ${colors["document/activeElements/textActive"]};
    }
    .pmx-PaginationControl:not([data-active=true]) {
        background: none;
        color: ${colors["document/typography/header"]};
        border: 1px solid ${colors["document/backgrounds/grid"]};
    }
    .pmx-PaginationControl:not([data-active=true]):not([data-disabled=true]):hover {
        background: ${colors["document/activeElements/bgdActive"]};
        color: ${colors["document/activeElements/textActive"]};
    }
    
    /* Forms */
    [data-mantine-color-scheme] .pmx-Autocomplete [data-variant],
    [data-mantine-color-scheme] .pmx-MultiSelect [data-variant],
    [data-mantine-color-scheme] .pmx-NumberInput [data-variant],
    [data-mantine-color-scheme] .pmx-PasswordInput [data-variant],
    [data-mantine-color-scheme] .pmx-Select [data-variant],
    [data-mantine-color-scheme] .pmx-Textarea [data-variant],
    [data-mantine-color-scheme] .pmx-TextInput [data-variant] {
        --_input-bg: ${colors["document/backgrounds/module"]};
        --_input-bd: ${colors["document/backgrounds/bodyAccent"]};
        --_input-color: ${colors["document/typography/text"]};
        --_input-placeholder-color: ${colors["document/backgrounds/moduleAccent"]};
        --input-bg: ${colors["document/backgrounds/module"]};
        --input-bd: ${colors["document/backgrounds/bodyAccent"]};
        --input-color: ${colors["document/typography/text"]};
        --input-placeholder-color: ${colors["document/backgrounds/moduleAccent"]};
    }
    [data-mantine-color-scheme] .pmx-Select [data-variant=transparent] {
        --_input-bg: transparent;
        --_input-bd: transparent;
        --input-bg: transparent;
        --input-bd: transparent;
    }
    [data-mantine-color-scheme] .pmx-Autocomplete [data-variant] button,
    [data-mantine-color-scheme] .pmx-Autocomplete [data-variant] .mantine-Input-section,
    [data-mantine-color-scheme] .pmx-MultiSelect [data-variant] button,
    [data-mantine-color-scheme] .pmx-MultiSelect [data-variant] .mantine-Input-section,
    [data-mantine-color-scheme] .pmx-MultiSelect [data-variant] .mantine-ComboboxChevron-chevron,
    [data-mantine-color-scheme] .pmx-NumberInput [data-variant] button,
    [data-mantine-color-scheme] .pmx-NumberInput [data-variant] .mantine-Input-section,
    [data-mantine-color-scheme] .pmx-PasswordInput [data-variant] button,
    [data-mantine-color-scheme] .pmx-PasswordInput [data-variant] .mantine-Input-section,
    [data-mantine-color-scheme] .pmx-Select [data-variant] button,
    [data-mantine-color-scheme] .pmx-Select [data-variant] .mantine-Input-section,
    [data-mantine-color-scheme] .pmx-Select [data-variant] .mantine-ComboboxChevron-chevron,
    [data-mantine-color-scheme] .pmx-Textarea [data-variant] button,
    [data-mantine-color-scheme] .pmx-Textarea [data-variant] .mantine-Input-section,
    [data-mantine-color-scheme] .pmx-TextInput [data-variant] button,
    [data-mantine-color-scheme] .pmx-TextInput [data-variant] .mantine-Input-section {
        color: ${colors["document/backgrounds/moduleAccent"]} !important;
        --_input-section-color: ${colors["document/backgrounds/moduleAccent"]};
        --_color: ${colors["document/backgrounds/moduleAccent"]};
        --input-section-color: ${colors["document/backgrounds/moduleAccent"]};
        --color: ${colors["document/backgrounds/moduleAccent"]};
    }
    [data-mantine-color-scheme] .pmx-Autocomplete [data-variant]:hover,
    [data-mantine-color-scheme] .pmx-Autocomplete [data-variant]:focus,
    [data-mantine-color-scheme] .pmx-Autocomplete [data-variant]:focus-within,
    [data-mantine-color-scheme] .pmx-MultiSelect [data-variant]:hover,
    [data-mantine-color-scheme] .pmx-MultiSelect [data-variant]:focus,
    [data-mantine-color-scheme] .pmx-MultiSelect [data-variant]:focus-within,
    [data-mantine-color-scheme] .pmx-NumberInput [data-variant]:hover,
    [data-mantine-color-scheme] .pmx-NumberInput [data-variant]:focus,
    [data-mantine-color-scheme] .pmx-NumberInput [data-variant]:focus-within,
    [data-mantine-color-scheme] .pmx-PasswordInput [data-variant]:hover,
    [data-mantine-color-scheme] .pmx-PasswordInput [data-variant]:focus,
    [data-mantine-color-scheme] .pmx-PasswordInput [data-variant]:focus-within,
    [data-mantine-color-scheme] .pmx-Select [data-variant]:hover,
    [data-mantine-color-scheme] .pmx-Select [data-variant]:focus,
    [data-mantine-color-scheme] .pmx-Select [data-variant]:focus-within,
    [data-mantine-color-scheme] .pmx-Textarea [data-variant]:hover,
    [data-mantine-color-scheme] .pmx-Textarea [data-variant]:focus,
    [data-mantine-color-scheme] .pmx-Textarea [data-variant]:focus-within,
    [data-mantine-color-scheme] .pmx-TextInput [data-variant]:hover,
    [data-mantine-color-scheme] .pmx-TextInput [data-variant]:focus,
    [data-mantine-color-scheme] .pmx-TextInput [data-variant]:focus-within {
        --_input-bg: ${colors["document/backgrounds/module"]};
        --_input-bd: ${colors["document/backgrounds/moduleAccent"]};
        --input-bg: ${colors["document/backgrounds/module"]};
        --input-bd: ${colors["document/backgrounds/moduleAccent"]};
    }
    [data-mantine-color-scheme] .pmx-Select [data-variant=transparent]:hover,
    [data-mantine-color-scheme] .pmx-Select [data-variant=transparent]:focus,
    [data-mantine-color-scheme] .pmx-Select [data-variant=transparent]:focus-within {
        --_input-bg: transparent;
        --_input-bd: ${colors["document/backgrounds/module"]};
        --input-bg: transparent;
        --input-bd: ${colors["document/backgrounds/module"]};
    }
    [data-mantine-color-scheme] .pmx-Checkbox input {
        --_checkbox-bg: ${colors["document/backgrounds/module"]};
        --_checkbox-bd-color: ${colors["document/backgrounds/bodyAccent"]};
        --checkbox-bg: ${colors["document/backgrounds/module"]};
        --checkbox-bd-color: ${colors["document/backgrounds/bodyAccent"]};
    }
    [data-mantine-color-scheme] .pmx-Radio input {
        --_radio-bg: ${colors["document/backgrounds/module"]};
        --_radio-bd-color: ${colors["document/backgrounds/bodyAccent"]};
        --radio-bg: ${colors["document/backgrounds/module"]};
        --radio-bd-color: ${colors["document/backgrounds/bodyAccent"]};
    }
    [data-mantine-color-scheme] .pmx-Switch .mantine-Switch-track {
        --_switch-bd: ${colors["document/backgrounds/bodyAccent"]};
        --switch-bd: ${colors["document/backgrounds/bodyAccent"]};
    }
    [data-mantine-color-scheme] .pmx-Switch input:not(:checked) + .mantine-Switch-track {
        --_switch-bg: ${colors["document/backgrounds/module"]};
        --switch-bg: ${colors["document/backgrounds/module"]};
    }
    [data-mantine-color-scheme] .pmx-Switch input:checked + .mantine-Switch-track {
        --_switch-bg: ${colors["document/typography/accent"]};
        --switch-bg: ${colors["document/typography/accent"]};
    }
    
    /* Buttons */
    .mantine-UnstyledButton-root[data-variant=outline]:hover {
        border-color: ${colors["document/activeElements/bgdActive"]};
    }
    .mantine-UnstyledButton-root[data-variant=light]:hover,
    .pmx-PaginationControl:not([data-active=true]):hover {
        border-color: ${colors["document/activeElements/bgdActive"]};
    }
    .mantine-UnstyledButton-root[data-disabled=true] .mantine-Button-inner {
        color: ${colors["document/backgrounds/moduleAccent"]};
    }
    .mantine-UnstyledButton-root[data-variant=outline][data-disabled=true] {
        border-color: ${colors["document/backgrounds/moduleAccent"]};
    }
    .mantine-UnstyledButton-root[data-variant=light][data-disabled=true],
    .pmx-PaginationControl[data-disabled=true]:not([data-active=true]) {
        border-color: ${colors["document/backgrounds/moduleAccent"]};
    }
    .mantine-UnstyledButton-root[data-variant=filled][data-disabled=true],
    .mantine-UnstyledButton-root[data-variant=subtle][data-disabled=true] {
        background-color: ${colors["document/backgrounds/module"]};
    }
    .mantine-UnstyledButton-root[data-variant=outline][data-disabled=true],
    .mantine-UnstyledButton-root[data-variant=light][data-disabled=true],
    .pmx-PaginationControl[data-disabled=true]:not([data-active=true]),
    .mantine-UnstyledButton-root[data-variant=transparent][data-disabled=true] {
        background-color: transparent;
    }
    .mantine-UnstyledButton-root.pmx-Button-fullWithContent .mantine-Button-inner,
    .mantine-UnstyledButton-root.pmx-Button-fullWithContent .mantine-Button-inner .mantine-Button-label {
        width: 100%;
    }
`;

export type CustomColor = "primary" | "subtle" | "info" | "success" | "warning" | "error";
type ExtendedCustomColors = DefaultMantineColor | CustomColor;

declare module "@mantine/core" {
    export interface MantineThemeColorsOverride {
        colors: Record<ExtendedCustomColors, MantineColorsTuple>;
    }
}

function generateMantineColorsTuple(themeColor: string): MantineColorsTuple {
    const hsl = ColorUtils.rgbToHsl(ColorUtils.hexToRgb(themeColor));
    return [
        ColorUtils.rgbToHex(ColorUtils.hslToRgb(ColorUtils.lightenHsl(hsl, -20))), // 0
        ColorUtils.rgbToHex(ColorUtils.hslToRgb(ColorUtils.lightenHsl(hsl, -16))), // 1
        ColorUtils.rgbToHex(ColorUtils.hslToRgb(ColorUtils.lightenHsl(hsl, -12))), // 2
        ColorUtils.rgbToHex(ColorUtils.hslToRgb(ColorUtils.lightenHsl(hsl, -8))), // 3
        ColorUtils.rgbToHex(ColorUtils.hslToRgb(ColorUtils.lightenHsl(hsl, -4))), // 4
        ColorUtils.rgbToHex(ColorUtils.hslToRgb(ColorUtils.lightenHsl(hsl, 0))), // 5
        ColorUtils.rgbToHex(ColorUtils.hslToRgb(ColorUtils.lightenHsl(hsl, 7))), // 6
        ColorUtils.rgbToHex(ColorUtils.hslToRgb(ColorUtils.lightenHsl(hsl, 13))), // 7
        ColorUtils.rgbToHex(ColorUtils.hslToRgb(ColorUtils.lightenHsl(hsl, 20))), // 8
        ColorUtils.rgbToHex(ColorUtils.hslToRgb(ColorUtils.lightenHsl(hsl, 27))), // 9
    ];
}
