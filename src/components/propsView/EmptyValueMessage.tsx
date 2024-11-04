import type React from "react";
import { NoneText } from "../noneText/NoneText";

export interface EmptyValueMessageProps {
    message: React.ReactNode;
}

export function EmptyValueMessage(props: EmptyValueMessageProps) {
    if (props.message === true) {
        return <NoneText />;
    }
    if (props.message === false) {
        return null;
    }
    return <NoneText customMessage={props.message} />;
}
