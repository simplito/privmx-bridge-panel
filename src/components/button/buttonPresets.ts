import type { useTranslations } from "use-intl";
import type { CustomColor } from "@/components/rootAppLayout/mantineTheme";
import type { IconName } from "../atoms/Icon";
import type { ButtonPriority } from "./mantineVariantByButtonPriority";

export type ButtonPresetName =
    | "default"
    | "add"
    | "cancel"
    | "confirm"
    | "confirmDanger"
    | "create"
    | "delete"
    | "edit"
    | "ok"
    | "update"
    | "remove"
    | "reset"
    | "save"
    | "signIn"
    | "signOut"
    | "submit"
    | "viewDetails";

interface ButtonPreset {
    color: CustomColor;
    priority: ButtonPriority;
    icon: IconName | null;
    label: React.ReactNode | null;
}

const buttonPresets = {
    default: {
        color: "primary",
        priority: "primary",
        icon: null,
        label: "submit",
    },
    add: {
        color: "primary",
        priority: "primary",
        icon: "add",
        label: "add",
    },
    cancel: {
        color: "subtle",
        priority: "secondary",
        icon: "cancel",
        label: "cancel",
    },
    confirm: {
        color: "success",
        priority: "primary",
        icon: "confirm",
        label: "confirm",
    },
    confirmDanger: {
        color: "warning",
        priority: "primary",
        icon: "confirm",
        label: "confirm",
    },
    create: {
        color: "primary",
        priority: "primary",
        icon: "add",
        label: "create",
    },
    delete: {
        color: "error",
        priority: "primary",
        icon: "delete",
        label: "delete",
    },
    edit: {
        color: "primary",
        priority: "primary",
        icon: "edit",
        label: "edit",
    },
    ok: {
        color: "primary",
        priority: "primary",
        icon: "check",
        label: "ok",
    },
    update: {
        color: "primary",
        priority: "primary",
        icon: "update",
        label: "update",
    },
    remove: {
        color: "error",
        priority: "primary",
        icon: "remove",
        label: "remove",
    },
    reset: {
        color: "subtle",
        priority: "secondary",
        icon: "reset",
        label: "reset",
    },
    save: {
        color: "primary",
        priority: "primary",
        icon: "save",
        label: "save",
    },
    signIn: {
        color: "primary",
        priority: "primary",
        icon: "signIn",
        label: "signIn",
    },
    signOut: {
        color: "primary",
        priority: "tertiary",
        icon: "signOut",
        label: "signOut",
    },
    submit: {
        color: "primary",
        priority: "primary",
        icon: "submit",
        label: "submit",
    },
    viewDetails: {
        color: "primary",
        priority: "primary",
        icon: "viewDetails",
        label: "viewDetails",
    },
} as const satisfies Record<ButtonPresetName, ButtonPreset>;

type FormButtonTranslator = ReturnType<typeof useTranslations<"forms.buttons">>;

interface ResolvePresetPropsProps {
    preset?: ButtonPresetName | undefined;
    color?: CustomColor | undefined;
    priority?: ButtonPriority | undefined;
    icon?: IconName | null | undefined;
    label?: React.ReactNode | null | undefined;
}

interface ResolvePresetPropsReturnValue extends ButtonPreset {
    title: string;
}

export function resolvePresetProps(props: ResolvePresetPropsProps, t: FormButtonTranslator): ResolvePresetPropsReturnValue {
    const presetName: ButtonPresetName = props.preset ?? "default";
    const preset = buttonPresets[presetName];
    const presetLabel = t(preset.label);
    return {
        color: props.color ?? preset.color,
        priority: props.priority ?? preset.priority,
        icon: props.icon === undefined ? preset.icon : props.icon,
        label: props.label === undefined ? presetLabel : props.label,
        title: presetLabel,
    };
}
