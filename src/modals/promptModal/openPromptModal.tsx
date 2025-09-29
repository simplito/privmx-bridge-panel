import { Modals } from "privmx-components/components/index";
import type { Size } from "privmx-components/types";
import { Deferred } from "privmx-components/utils/Deferred";
import type { StringValidator } from "privmx-components/validators/StringValidator";
import { useCallback } from "react";
import { PromptModalContent } from "./PromptModalContent";

export interface OpenPromptModalProps {
    title: React.ReactNode;
    content?: React.ReactNode | undefined;
    initialValue?: string | undefined;
    inputPlaceholder?: string | undefined;
    validationSchema?: StringValidator | undefined;
    size?: Size | undefined;
}

export async function openPromptModal(props: OpenPromptModalProps) {
    const resultDeferred = new Deferred<{ submitted: false } | { submitted: true; value: string }>();
    const modalId = `${Math.random().toString(36).substring(2)}-${Date.now()}`;
    const close = () => {
        Modals.closeModal(modalId);
    };
    Modals.showModal(
        {
            modalId: modalId,
        },
        {
            title: props.title,
            width: props.size ?? "xl",
            height: "auto",
            withCloseButton: true,
            observeBackdropClicks: true,
            observeEscapeKey: true,
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
            onAction: () => {
                resultDeferred.resolve({ submitted: false });
            },
        },
    );
    return await resultDeferred.promise;
}

export function useOpenPromptModal() {
    const openPromptModalCallback = useCallback(async (props: OpenPromptModalProps) => {
        return await openPromptModal(props);
    }, []);

    return { openPromptModal: openPromptModalCallback };
}
