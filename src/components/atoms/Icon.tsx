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
    IconExclamationMark,
    IconExternalLink,
    IconEye,
    IconEyeOff,
    IconFilter,
    IconKey,
    IconLogin,
    IconMail,
    IconPencil,
    IconQuestionMark,
    IconReload,
    IconSearch,
    IconTrash,
    IconUser,
    IconX,
    IconZoomQuestionFilled,
} from "@tabler/icons-react";
import { ReactComponent as IconBox } from "./icons/box.svg";
import { ReactComponent as IconBubbles } from "./icons/bubbles.svg";
import { ReactComponent as IconContext } from "./icons/context.svg";
import { ReactComponent as IconHome } from "./icons/home.svg";
import { ReactComponent as IconLogout } from "./icons/logout.svg";
import { ReactComponent as IconMoreHor } from "./icons/more-hor.svg";
import { ReactComponent as IconPlusLinear } from "./icons/plusLinear.svg";
import { ReactComponent as IconSecureUser } from "./icons/secureUser.svg";
import { ReactComponent as IconShapes } from "./icons/shapes.svg";
import { ReactComponent as IconTeam } from "./icons/team.svg";

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
    add: IconPlusLinear,
    apiKey: IconKey,
    apiKeys: IconSecureUser,
    arrowRight: IconArrowBadgeRight,
    bridge: IconBuildingBridge2,
    cancel: IconX,
    check: IconCheck,
    chevronDown: IconChevronDown,
    chevronLeft: IconChevronLeft,
    chevronRight: IconChevronRight,
    chevronUp: IconChevronUp,
    confirm: IconCheck,
    context: IconContext,
    contexts: IconBubbles,
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
    more: IconMoreHor,
    no: IconX,
    reload: IconReload,
    remove: IconX,
    reset: IconBackspace,
    save: IconDeviceFloppy,
    search: IconSearch,
    signIn: IconLogin,
    signOut: IconLogout,
    solution: IconBox,
    solutions: IconShapes,
    submit: IconCheck,
    update: IconDeviceFloppy,
    user: IconUser,
    users: IconTeam,
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
