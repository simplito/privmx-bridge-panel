import { Modal } from "privmx-components/components/index";
import { useCallback } from "react";
import { PromptModalContent, type PromptModalContentProps } from "./PromptModalContent";

export interface PromptModalProps extends PromptModalContentProps {
    title: React.ReactNode;
    isOpened: boolean;
}

export function PromptModal(props: PromptModalProps) {
    const onResult = props.onResult;
    const handleModalAction = useCallback(() => {
        onResult({ result: "cancelled" });
    }, [onResult]);

    return (
        <Modal title={props.title} onAction={handleModalAction} isOpen={props.isOpened} zIndex={99999999}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <PromptModalContent {...props} />
        </Modal>
    );
}
