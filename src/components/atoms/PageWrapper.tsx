import { Box, type BreadcrumbItem, Breadcrumbs, Stack, Text } from "privmx-components/components/index";

export interface PageWrapperProps extends React.PropsWithChildren {
    title: React.ReactNode;
    subTitle?: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    breadcrumbs?: BreadcrumbItem[] | undefined;
}

export const pageWidthBySize = {
    sm: 500,
    md: 700,
    lg: 900,
    xl: 1200,
    full: "100%",
};

export function PageWrapper(props: PageWrapperProps) {
    const size = props.size ?? "full";

    return (
        <Stack
            gap={20}
            ml={20}
            style={{
                maxWidth: pageWidthBySize[size],
            }}
        >
            <Stack gap="m">
                {props.breadcrumbs === undefined ? null : <Breadcrumbs items={props.breadcrumbs} />}
                <Text component="h1">{props.title}</Text>
                {props.subTitle === undefined ? null : <Text>{props.subTitle}</Text>}
            </Stack>
            <Box>{props.children}</Box>
        </Stack>
    );
}
