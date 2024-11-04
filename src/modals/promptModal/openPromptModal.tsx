import type { ModalBaseProps } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback } from "react";
import type { ZodString } from "zod";
import { Deferred } from "@/utils/Deferred";
import { PromptModalContent } from "./PromptModalContent";

export interface OpenPromptModalProps {
    title: React.ReactNode;
    content?: React.ReactNode | undefined;
    initialValue?: string | undefined;
    inputPlaceholder?: string | undefined;
    validationSchema?: ZodString | undefined;
    size?: ModalBaseProps["size"] | undefined;
}

export async function openPromptModal(props: OpenPromptModalProps) {
    const resultDeferred = new Deferred<{ submitted: false } | { submitted: true; value: string }>();
    const modalId = `${Math.random().toString(36).substring(2)}-${Date.now()}`;
    const close = () => {
        modals.close(modalId);
    };
    modals.open({
        modalId: modalId,
        size: "xl",
        title: props.title,
        children: (
            <PromptModalContent
                content={props.content}
                initialValue={props.initialValue}
                inputPlaceholder={props.inputPlaceholder}
                validationSchema={props.validationSchema}
                // eslint-disable-next-line react/jsx-no-bind
                onResult={(result) => {
                    resultDeferred.resolve(result.result === "submitted" ? { submitted: true, value: result.value } : { submitted: false });
                    close();
                }}
            />
        ),
        onClose: () => {
            resultDeferred.resolve({ submitted: false });
        },
    });
    return await resultDeferred.promise;
}

export function useOpenPromptModal() {
    const openPromptModalCallback = useCallback(async (props: OpenPromptModalProps) => {
        return await openPromptModal(props);
    }, []);

    return { openPromptModal: openPromptModalCallback };
}
