import { Breadcrumbs as MantineBreadcrumbs, Text } from "@mantine/core";
import { Link } from "@/i18n/routing";
import { Icon } from "./Icon";
import styles from "./Breadcrumbs.module.scss";

export interface BreadcrumbItem {
    label: React.ReactNode;
    href?: string | undefined;
}

export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs(props: BreadcrumbsProps) {
    return (
        <MantineBreadcrumbs separator={<Icon name="chevronRight" />} style={{ flexWrap: "wrap" }}>
            {props.items.map((item) => {
                if (item.href === undefined) {
                    return <Text key={item.href}>{item.label}</Text>;
                }
                return (
                    <Link key={item.href} href={item.href} className={styles["link"]}>
                        {item.label}
                    </Link>
                );
            })}
        </MantineBreadcrumbs>
    );
}
