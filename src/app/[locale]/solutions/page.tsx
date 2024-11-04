import { AuthGuard } from "@/components/atoms/AuthGuard";
import { SolutionsListPage } from "@/features/solutions/list/SolutionsListPage";

export default function Page() {
    return (
        <AuthGuard type="requireAuthed" behavior="renderSignInForm">
            <SolutionsListPage />
        </AuthGuard>
    );
}
