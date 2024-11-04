import type * as ServerApiTypes from "privmx-server-api";
import { AuthGuard } from "@/components/atoms/AuthGuard";
import { SolutionProfilePage } from "@/features/solutions/profile/SolutionProfilePage";

interface PageProps {
    params: {
        solutionId: ServerApiTypes.types.cloud.SolutionId;
    };
}

export default function Page(props: PageProps) {
    return (
        <AuthGuard type="requireAuthed" behavior="renderSignInForm">
            <SolutionProfilePage solutionId={props.params.solutionId} />
        </AuthGuard>
    );
}
