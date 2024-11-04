import { Text } from "@mantine/core";
import { Icon, type IconProps } from "../atoms/Icon";

export interface AppIconProps {
    size?: IconProps["size"] | undefined;
}

export function AppIcon(props: AppIconProps) {
    return (
        <Text c={"primary"} component="span">
            <Icon name="bridge" size={props.size} />
        </Text>
    );
}
