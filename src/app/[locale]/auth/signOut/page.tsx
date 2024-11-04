import { AuthGuard } from "@/components/atoms/AuthGuard";
import { SignOutPage } from "@/features/auth/signOut/SignOutPage";

export default function Page() {
    return (
        <AuthGuard type="requireAuthed" behavior="redirectToHomePage">
            <SignOutPage />
        </AuthGuard>
    );
}
