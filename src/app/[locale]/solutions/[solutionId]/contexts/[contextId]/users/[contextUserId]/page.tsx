import type * as ServerApiTypes from "privmx-server-api";
import { AuthGuard } from "@/components/atoms/AuthGuard";
import { ContextUserProfilePage } from "@/features/contextUsers/profile/ContextUserProfilePage";

interface PageProps {
    params: {
        solutionId: ServerApiTypes.types.cloud.SolutionId;
        contextId: ServerApiTypes.types.context.ContextId;
        contextUserId: ServerApiTypes.types.cloud.UserId;
    };
}

export default function Page(props: PageProps) {
    return (
        <AuthGuard type="requireAuthed" behavior="renderSignInForm">
            <ContextUserProfilePage
                solutionId={props.params.solutionId}
                contextId={props.params.contextId}
                contextUserId={decodeURIComponent(props.params.contextUserId) as ServerApiTypes.types.cloud.UserId}
            />
        </AuthGuard>
    );
}
