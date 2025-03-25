import { AuthGuard } from "@/components/atoms/AuthGuard";
import { LoginPage } from "@/features/auth/login/LoginPage";

export default function Page() {
    return (
        <AuthGuard type="requireUnauthed" behavior="redirectToHomePage">
            <LoginPage />
        </AuthGuard>
    );
}
