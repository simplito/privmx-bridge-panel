import type * as ServerApiTypes from "privmx-server-api";
import { AuthGuard } from "@/components/atoms/AuthGuard";
import { ContextUsersListPage } from "@/features/contextUsers/list/ContextUsersListPage";

interface PageProps {
    params: {
        contextId: ServerApiTypes.types.context.ContextId;
    };
}

export default function Page(props: PageProps) {
    return (
        <AuthGuard type="requireAuthed" behavior="renderSignInForm">
            <ContextUsersListPage contextId={props.params.contextId} />
        </AuthGuard>
    );
}
