import { Outlet } from "react-router-dom";
import { RootAppLayout } from "@/components/rootAppLayout/RootAppLayout";

export default function RootLayout() {
    return (
        <RootAppLayout>
            <Outlet />
        </RootAppLayout>
    );
}
