import type * as ServerApiTypes from "privmx-server-api";
import { AuthGuard } from "@/components/atoms/AuthGuard";
import { ContextSharesListPage } from "@/features/contextShares/list/ContextSharesListPage";

interface PageProps {
    params: {
        contextId: ServerApiTypes.types.context.ContextId;
    };
}

export default function Page(props: PageProps) {
    return (
        <AuthGuard type="requireAuthed" behavior="renderSignInForm">
            <ContextSharesListPage contextId={props.params.contextId} />
        </AuthGuard>
    );
}
