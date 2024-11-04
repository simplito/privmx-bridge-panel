/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import { useEffect } from "react";
import { Link as ReactRouterLink, type LinkProps as ReactRouterLinkProps, type To, useNavigate } from "react-router-dom";

// Exported functions should support i18n routing in the future.

export interface LinkProps extends Omit<ReactRouterLinkProps, "to"> {
    href: ReactRouterLinkProps["to"];
}

export function Link(props: LinkProps) {
    const { href, ...rest } = props;
    return <ReactRouterLink to={href} {...rest} />;
}

export interface RedirectProps {
    to: To;
}

export function Redirect(props: RedirectProps) {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(props.to);
    }, [props.to, navigate]);
    return null;
}

export function useRouter() {
    const navigate = useNavigate();

    return { push: navigate };
}
