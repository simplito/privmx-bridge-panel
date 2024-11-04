import { Group, Button as MantineButton, type MantineSize } from "@mantine/core";
import type { MouseEventHandler } from "react";
import { useTranslations } from "use-intl";
import type { CustomColor } from "@/components/rootAppLayout/mantineTheme";
import { Link } from "@/i18n/routing";
import { Icon, type IconName } from "../atoms/Icon";
import { type ButtonPresetName, resolvePresetProps } from "./buttonPresets";
import { type ButtonPriority, mantineVariantByButtonPriority } from "./mantineVariantByButtonPriority";

interface CommonButtonProps extends React.PropsWithChildren {
    preset?: ButtonPresetName | undefined;
    onlyIcon?: boolean | undefined;
    withPresetLabelAsTitle?: boolean | undefined;
    color?: CustomColor | undefined;
    priority?: ButtonPriority | undefined;
    icon?: IconName | null | undefined;
    size?: MantineSize | "xxs" | undefined;
    disabled?: boolean | undefined;
    width?: number | string | undefined;
    height?: number | string | undefined;
    title?: string | undefined;
    style?: React.CSSProperties | undefined;
}

interface FormButtonProps extends CommonButtonProps {
    type: "button" | "reset" | "submit";
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

interface LinkButtonProps extends CommonButtonProps {
    type: "link" | "linkExternal" | "linkInternal";
    href: string;
    linkType?: "basic" | "internal" | "external" | undefined;
    onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
}

export type ButtonProps = FormButtonProps | LinkButtonProps;

export function Button(props: ButtonProps) {
    const t = useTranslations("forms.buttons");

    const {
        color,
        icon,
        label,
        priority,
        title: presetTitle,
    } = resolvePresetProps(
        {
            preset: props.preset,
            color: props.color,
            priority: props.priority,
            icon: props.icon,
            label: props.children,
        },
        t,
    );
    const variant = mantineVariantByButtonPriority[priority];
    let hasLabel = typeof label !== "undefined" && label !== null && (typeof label !== "string" || label.length > 0);
    if (props.onlyIcon === true) {
        hasLabel = false;
    }
    const title = props.title ?? (props.withPresetLabelAsTitle === true ? presetTitle : undefined);

    if (props.type === "link" || props.type === "linkExternal" || props.type === "linkInternal") {
        return (
            <MantineButton
                color={color}
                size={props.size === "xxs" ? "xs" : props.size}
                disabled={props.disabled}
                variant={variant}
                leftSection={getButtonLeftSection({ hasLabel, icon, size: props.size })}
                onClick={props.onClick}
                component={Link}
                href={props.href}
                target={props.type === "linkExternal" ? "_blank" : undefined}
                title={title}
                w={props.width}
                h={props.height ?? (props.size === "xxs" ? 24 : undefined)}
                px={props.size === "xxs" ? 5 : undefined}
                py={props.size === "xxs" ? 0 : undefined}
                style={props.style}
            >
                <ButtonContent hasLabel={hasLabel} icon={icon} label={label} type={props.type} size={props.size} />
            </MantineButton>
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (props.type === "button" || props.type === "reset" || props.type === "submit") {
        return (
            <MantineButton
                color={color}
                size={props.size === "xxs" ? "xs" : props.size}
                disabled={props.disabled}
                variant={variant}
                leftSection={getButtonLeftSection({ hasLabel, icon, size: props.size })}
                onClick={props.onClick}
                type={props.type}
                title={title}
                w={props.width}
                h={props.height ?? (props.size === "xxs" ? 24 : undefined)}
                px={props.size === "xxs" ? 5 : undefined}
                py={props.size === "xxs" ? 0 : undefined}
                style={props.style}
            >
                <ButtonContent hasLabel={hasLabel} icon={icon} label={label} type={props.type} size={props.size} />
            </MantineButton>
        );
    }

    return <></>;
}

interface GetButtonLeftSectionProps {
    hasLabel: boolean;
    icon: IconName | null | undefined;
    size: MantineSize | "xxs" | undefined;
}

function getButtonLeftSection(props: GetButtonLeftSectionProps) {
    return props.icon && props.hasLabel ? <Icon name={props.icon} size={props.size === "xxs" ? "xs" : props.size} /> : undefined;
}

interface ButtonContentProps {
    type: ButtonProps["type"];
    hasLabel: boolean;
    icon: IconName | null | undefined;
    label: React.ReactNode | null | undefined;
    size: MantineSize | "xxs" | undefined;
}

function ButtonContent(props: ButtonContentProps) {
    if (props.type === "linkExternal" || props.type === "linkInternal") {
        return (
            <Group gap="xs">
                <span>{props.hasLabel ? <>{props.label}</> : <Icon name={props.icon ?? "save"} size={props.size === "xxs" ? "xs" : props.size} />}</span>
                <Icon name={props.type === "linkExternal" ? "externalLink" : "internalLink"} />
            </Group>
        );
    }
    return props.hasLabel ? <>{props.label}</> : <Icon name={props.icon ?? "check"} size={props.size === "xxs" ? "xs" : props.size} />;
}
