import type { ButtonVariant } from "@mantine/core";

export type ButtonPriority = "primary" | "secondary" | "tertiary" | "quaternary";

export const mantineVariantByButtonPriority = {
    primary: "filled",
    secondary: "light",
    tertiary: "outline",
    quaternary: "transparent",
} satisfies Record<ButtonPriority, ButtonVariant>;
