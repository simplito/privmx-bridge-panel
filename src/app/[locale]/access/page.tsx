import { AuthGuard } from "@/components/atoms/AuthGuard";
import { ApiKeysListPage } from "@/features/apiKeys/list/ApiKeysListPage";

export default function Page() {
    return (
        <AuthGuard type="requireAuthed" behavior="renderLoginForm">
            <ApiKeysListPage />
        </AuthGuard>
    );
}
