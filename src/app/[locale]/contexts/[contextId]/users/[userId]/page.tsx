import type * as ServerApiTypes from "privmx-server-api";
import { AuthGuard } from "@/components/atoms/AuthGuard";
import { ContextUserProfilePage } from "@/features/contextUsers/profile/ContextUserProfilePage";

interface PageProps {
    params: {
        contextId: ServerApiTypes.types.context.ContextId;
        contextUserId: ServerApiTypes.types.cloud.UserId;
    };
}

export default function Page(props: PageProps) {
    return (
        <AuthGuard type="requireAuthed" behavior="renderLoginForm">
            <ContextUserProfilePage contextId={props.params.contextId} contextUserId={props.params.contextUserId} />
        </AuthGuard>
    );
}
