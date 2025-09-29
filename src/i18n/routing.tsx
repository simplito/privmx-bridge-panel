import { useEffect } from "react";
import { type To, useNavigate } from "react-router-dom";

// Exported functions should support i18n routing in the future.

export interface RedirectProps {
    to: To;
}

export function Redirect(props: RedirectProps) {
    const navigate = useNavigate();
    useEffect(() => {
        void navigate(props.to);
    }, [props.to, navigate]);
    return null;
}

export function useRouter() {
    const navigate = useNavigate();

    return { push: navigate };
}
