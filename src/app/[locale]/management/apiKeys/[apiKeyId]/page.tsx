import type * as ServerApiTypes from "privmx-server-api";
import { AuthGuard } from "@/components/atoms/AuthGuard";
import { ApiKeyProfilePage } from "@/features/management/apiKeys/profile/ApiKeyProfilePage";

interface PageProps {
    params: {
        apiKeyId: ServerApiTypes.types.auth.ApiKeyId;
    };
}

export default function Page(props: PageProps) {
    return (
        <AuthGuard type="requireAuthed" behavior="renderSignInForm">
            <ApiKeyProfilePage apiKeyId={props.params.apiKeyId} />
        </AuthGuard>
    );
}
