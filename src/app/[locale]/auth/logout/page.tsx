import { AuthGuard } from "@/components/atoms/AuthGuard";
import { LogoutPage } from "@/features/auth/logout/LogoutPage";

export default function Page() {
    return (
        <AuthGuard type="requireAuthed" behavior="redirectToHomePage">
            <LogoutPage />
        </AuthGuard>
    );
}
