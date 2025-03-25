import type * as ServerApiTypes from "privmx-server-api";
import { AuthGuard } from "@/components/atoms/AuthGuard";
import { ContextProfilePage } from "@/features/contexts/profile/ContextProfilePage";

interface PageProps {
    params: {
        contextId: ServerApiTypes.types.context.ContextId;
    };
}

export default function Page(props: PageProps) {
    return (
        <AuthGuard type="requireAuthed" behavior="renderLoginForm">
            <ContextProfilePage contextId={props.params.contextId} />
        </AuthGuard>
    );
}
