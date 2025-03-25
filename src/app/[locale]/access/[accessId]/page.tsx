import type * as ServerApiTypes from "privmx-server-api";
import { AuthGuard } from "@/components/atoms/AuthGuard";
import { ApiKeyProfilePage } from "@/features/apiKeys/profile/ApiKeyProfilePage";

interface PageProps {
    params: {
        accessId: ServerApiTypes.types.auth.ApiKeyId;
    };
}

export default function Page(props: PageProps) {
    return (
        <AuthGuard type="requireAuthed" behavior="renderLoginForm">
            <ApiKeyProfilePage apiKeyId={props.params.accessId} />
        </AuthGuard>
    );
}
