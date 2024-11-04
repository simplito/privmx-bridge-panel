import { Box, Center, Loader } from "@mantine/core";

export interface IconOrLoadingProps extends React.PropsWithChildren {
    isLoading?: boolean | undefined;
    size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | number | undefined;
    color?: "default" | "black" | "white" | undefined;
}

export function IconOrLoading(props: IconOrLoadingProps) {
    return (
        <Center style={{ display: "grid" }}>
            <Loader
                size={props.size === undefined ? "xs" : props.size === "xxs" ? 13 : props.size}
                style={{ gridColumn: 1, gridRow: 1, opacity: props.isLoading === true ? 1 : 0, pointerEvents: props.isLoading === true ? "auto" : "none" }}
                color={props.color === undefined || props.color === "default" ? "black" : props.color}
            />
            <Box style={{ gridColumn: 1, gridRow: 1, opacity: props.isLoading === true ? 0 : 1, pointerEvents: props.isLoading === true ? "none" : "auto" }}>
                {props.children}
            </Box>
        </Center>
    );
}
