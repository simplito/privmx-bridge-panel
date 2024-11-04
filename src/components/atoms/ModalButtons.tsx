import { Group } from "@mantine/core";
import { Button } from "../button/Button";
import type { ButtonPresetName } from "../button/buttonPresets";

export interface ModalButtonsProps extends React.PropsWithChildren {
    confirmButtonPreset?: ButtonPresetName | undefined;
    cancelButtonPreset?: ButtonPresetName | undefined;
    onCancel?: (() => void) | undefined;
    onConfirm?: (() => void) | "formSubmit" | undefined;
    isProcessing?: boolean | undefined;
}

export function ModalButtons(props: ModalButtonsProps) {
    return (
        <Group justify="center" gap="md">
            {props.onConfirm === undefined ? null : (
                <Button
                    type={props.onConfirm === "formSubmit" ? "submit" : "button"}
                    preset={props.confirmButtonPreset}
                    disabled={props.isProcessing}
                    onClick={typeof props.onConfirm === "function" ? props.onConfirm : undefined}
                />
            )}
            {props.onCancel === undefined ? null : (
                <Button type={"button"} preset={props.cancelButtonPreset} disabled={props.isProcessing} onClick={props.onCancel} />
            )}
            {props.children}
        </Group>
    );
}
