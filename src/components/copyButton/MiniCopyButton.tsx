import { CopyButton } from "@mantine/core";
import { Button } from "../button/Button";

export interface MiniCopyButtonProps {
    value: string;
}

export function MiniCopyButton(props: MiniCopyButtonProps) {
    return (
        <CopyButton value={props.value}>
            {({ copied, copy }) => <Button type="button" priority="quaternary" onClick={copy} onlyIcon size="xxs" icon={copied ? "check" : "copy"} />}
        </CopyButton>
    );
}
