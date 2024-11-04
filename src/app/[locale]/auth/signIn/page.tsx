import { AuthGuard } from "@/components/atoms/AuthGuard";
import { SignInPage } from "@/features/auth/signIn/SignInPage";

export default function Page() {
    return (
        <AuthGuard type="requireUnauthed" behavior="redirectToHomePage">
            <SignInPage />
        </AuthGuard>
    );
}
