import type * as ServerApiTypes from "privmx-server-api";
import { AuthGuard } from "@/components/atoms/AuthGuard";
import { ContextsListPage } from "@/features/contexts/list/ContextsListPage";

interface PageProps {
    params: {
        solutionId: ServerApiTypes.types.cloud.SolutionId;
    };
}

export default function Page(props: PageProps) {
    return (
        <AuthGuard type="requireAuthed" behavior="renderSignInForm">
            <ContextsListPage solutionId={props.params.solutionId} />
        </AuthGuard>
    );
}
