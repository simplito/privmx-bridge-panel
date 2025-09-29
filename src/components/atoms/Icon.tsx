import { Icon, type IconProps, iconsMap, iconsMapCore } from "privmx-components/components/index";

declare global {
    interface CustomIconNames {
        // Proprietary objects
        // iconName: "iconName"; // <- example
    }
}

// Proprietary objects
// iconsMap["iconName"] = iconImg as IconImage; // <- example; iconImg imported like: import { ReactComponent as IconBox } from "./svg/box.svg";

export type { IconProps };
export { Icon, iconsMap, iconsMapCore };
