import type * as ServerApiTypes from "privmx-server-api";
import { AuthGuard } from "@/components/atoms/AuthGuard";
import { ContextShareProfilePage } from "@/features/contextShares/profile/ContextShareProfilePage";

interface PageProps {
    params: {
        solutionId: ServerApiTypes.types.cloud.SolutionId;
        contextId: ServerApiTypes.types.context.ContextId;
        contextShareId: ServerApiTypes.types.cloud.SolutionId;
    };
}

export default function Page(props: PageProps) {
    return (
        <AuthGuard type="requireAuthed" behavior="renderSignInForm">
            <ContextShareProfilePage solutionId={props.params.solutionId} contextId={props.params.contextId} contextShareId={props.params.contextShareId} />
        </AuthGuard>
    );
}
