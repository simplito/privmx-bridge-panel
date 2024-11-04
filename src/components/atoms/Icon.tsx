import {
    IconArrowBadgeRight,
    IconArrowRight,
    IconBackspace,
    IconBook,
    IconBuildingBridge2,
    IconCheck,
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronUp,
    IconCopy,
    IconDeviceFloppy,
    IconDotsVertical,
    IconDroplet,
    IconDroplets,
    IconExclamationMark,
    IconExternalLink,
    IconEye,
    IconEyeOff,
    IconFilter,
    IconHexagon,
    IconHexagons,
    IconHome,
    IconKey,
    IconLogin,
    IconLogout,
    IconMail,
    IconPencil,
    IconPlus,
    IconQuestionMark,
    IconReload,
    IconSearch,
    IconTrash,
    IconUser,
    IconUsers,
    IconX,
    IconZoomQuestionFilled,
} from "@tabler/icons-react";

export interface IconProps {
    name: IconName;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | number | undefined;
    className?: string | undefined;
}

export function Icon(props: IconProps) {
    const IconComponent = iconsMap[props.name];
    const size = typeof props.size === "number" ? props.size : iconSizes[props.size ?? "md"];

    return <IconComponent size={size} className={props.className} />;
}

const iconsMap = {
    add: IconPlus,
    apiKey: IconKey,
    apiKeys: IconKey,
    arrowRight: IconArrowBadgeRight,
    bridge: IconBuildingBridge2,
    cancel: IconX,
    check: IconCheck,
    chevronDown: IconChevronDown,
    chevronLeft: IconChevronLeft,
    chevronRight: IconChevronRight,
    chevronUp: IconChevronUp,
    confirm: IconCheck,
    context: IconDroplet,
    contexts: IconDroplets,
    copy: IconCopy,
    delete: IconTrash,
    docs: IconBook,
    dotMenu: IconDotsVertical,
    edit: IconPencil,
    error: IconX,
    externalLink: IconExternalLink,
    filter: IconFilter,
    hideSecret: IconEyeOff,
    home: IconHome,
    info: IconQuestionMark,
    internalLink: IconArrowRight,
    mail: IconMail,
    no: IconX,
    reload: IconReload,
    remove: IconX,
    reset: IconBackspace,
    save: IconDeviceFloppy,
    search: IconSearch,
    signIn: IconLogin,
    signOut: IconLogout,
    solution: IconHexagon,
    solutions: IconHexagons,
    submit: IconCheck,
    update: IconDeviceFloppy,
    user: IconUser,
    users: IconUsers,
    viewDetails: IconZoomQuestionFilled,
    viewSecret: IconEye,
    warning: IconExclamationMark,
    yes: IconCheck,
} as const;

export type IconName = keyof typeof iconsMap;

const iconSizes = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
} as const;
