import { CopyButton as MantineCopyButton } from "@mantine/core";
import { useTranslations } from "use-intl";
import { Button } from "../button/Button";

export interface CopyButtonProps {
    value: string;
}

export function CopyButton(props: CopyButtonProps) {
    const t = useTranslations("components.copyButton");

    return (
        <MantineCopyButton value={props.value}>
            {({ copied, copy }) => (
                <Button type="button" onClick={copy} icon={copied ? "check" : "copy"} width={150}>
                    {copied ? t("copied") : t("copy")}
                </Button>
            )}
        </MantineCopyButton>
    );
}
