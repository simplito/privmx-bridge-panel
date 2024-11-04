import { AuthGuard } from "@/components/atoms/AuthGuard";
import { ApiKeysListPage } from "@/features/management/apiKeys/list/ApiKeysListPage";

export default function Page() {
    return (
        <AuthGuard type="requireAuthed" behavior="renderSignInForm">
            <ApiKeysListPage />
        </AuthGuard>
    );
}
