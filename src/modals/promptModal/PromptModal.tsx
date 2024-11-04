import { Modal } from "@mantine/core";
import { useCallback } from "react";
import { PromptModalContent, type PromptModalContentProps } from "./PromptModalContent";

export interface PromptModalProps extends PromptModalContentProps {
    title: React.ReactNode;
    isOpened: boolean;
}

function stopPropagation(e: React.FormEvent) {
    e.stopPropagation();
}

export function PromptModal(props: PromptModalProps) {
    const onResult = props.onResult;
    const handleCancelClick = useCallback(() => {
        onResult({ result: "cancelled" });
    }, [onResult]);

    return (
        <Modal title={props.title} onClose={handleCancelClick} opened={props.isOpened} zIndex={99999999} onSubmit={stopPropagation}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <PromptModalContent {...props} />
        </Modal>
    );
}
