import { Box, Stack, Text, Title } from "@mantine/core";
import { type BreadcrumbItem, Breadcrumbs } from "./Breadcrumbs";

export interface PageWrapperProps extends React.PropsWithChildren {
    title: React.ReactNode;
    subTitle?: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    breadcrumbs?: BreadcrumbItem[] | undefined;
}

const widthBySize = {
    sm: 500,
    md: 700,
    lg: 900,
    xl: 1200,
    full: "100%",
};

export function PageWrapper(props: PageWrapperProps) {
    const size = props.size ?? "full";

    return (
        <Stack maw={widthBySize[size]} gap={20} ml={20}>
            <Stack gap="m">
                {props.breadcrumbs === undefined ? null : <Breadcrumbs items={props.breadcrumbs} />}
                <Title order={1}>{props.title}</Title>
                {props.subTitle === undefined ? null : <Text>{props.subTitle}</Text>}
            </Stack>
            <Box>{props.children}</Box>
        </Stack>
    );
}
