import type * as ServerApiTypes from "privmx-server-api";
import { AuthGuard } from "@/components/atoms/AuthGuard";
import { ContextUsersListPage } from "@/features/contextUsers/list/ContextUsersListPage";

interface PageProps {
    params: {
        solutionId: ServerApiTypes.types.cloud.SolutionId;
        contextId: ServerApiTypes.types.context.ContextId;
    };
}

export default function Page(props: PageProps) {
    return (
        <AuthGuard type="requireAuthed" behavior="renderSignInForm">
            <ContextUsersListPage solutionId={props.params.solutionId} contextId={props.params.contextId} />
        </AuthGuard>
    );
}
