import { Box, Text, Tooltip } from "@mantine/core";
import type { To } from "react-router-dom";
import { Link } from "@/i18n/routing";
import { Icon } from "./Icon";

interface InfoIconBaseProps {
    tooltip: React.ReactNode;
    onClick?: (() => void) | undefined;
}

interface InfoIconNoLinkProps extends InfoIconBaseProps {
    href?: undefined;
    linkType?: undefined;
}

interface InfoIconExternalLinkProps extends InfoIconBaseProps {
    href: string;
    linkType: "external";
}

interface InfoIconInternalLinkProps extends InfoIconBaseProps {
    href: To;
    linkType: "internal";
}

export type InfoIconProps = InfoIconNoLinkProps | InfoIconExternalLinkProps | InfoIconInternalLinkProps;

export function InfoIcon(props: InfoIconProps) {
    return (
        <Tooltip label={props.tooltip}>
            <span>
                <MaybeLink linkType={props.linkType} href={props.href}>
                    <Box
                        bg="info"
                        style={{ borderRadius: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}
                        w={20}
                        h={20}
                        component={"span"}
                        onClick={props.onClick}
                    >
                        <Text c="white" mt={5} size="sm" component="span">
                            <Icon name="info" size="sm" />
                        </Text>
                    </Box>
                </MaybeLink>
            </span>
        </Tooltip>
    );
}

interface MaybeLinkBaseProps extends React.PropsWithChildren {
    href: string | To | undefined;
    linkType: "external" | "internal" | undefined;
}

function MaybeLink(props: MaybeLinkBaseProps) {
    if (props.linkType === undefined || props.href === undefined) {
        return <>{props.children}</>;
    }
    if (props.linkType === "internal") {
        return <Link href={props.href}>{props.children}</Link>;
    }

    return (
        <a href={props.href as string} target="_blank" rel="noreferrer">
            {props.children}
        </a>
    );
}
