/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/naming-convention */
import { Navigate, type RouteObject, createBrowserRouter, useParams } from "react-router-dom";
import Home_Page from "./[locale]/page";
import Auth_SignIn_Page from "./[locale]/auth/signIn/page";
import Auth_SignOut_Page from "./[locale]/auth/signOut/page";
import Management_ApiKeys_Page from "./[locale]/management/apiKeys/page";
import Management_ApiKeys_Profile_Page from "./[locale]/management/apiKeys/[apiKeyId]/page";
import Solutions_Page from "./[locale]/solutions/page";
import Solutions_Profile_Page from "./[locale]/solutions/[solutionId]/page";
import Solutions_Contexts_Page from "./[locale]/solutions/[solutionId]/contexts/page";
import Solutions_Contexts_Profile_Page from "./[locale]/solutions/[solutionId]/contexts/[contextId]/page";
import Solutions_Contexts_Users_Page from "./[locale]/solutions/[solutionId]/contexts/[contextId]/users/page";
import Solutions_Contexts_Users_Profile_Page from "./[locale]/solutions/[solutionId]/contexts/[contextId]/users/[contextUserId]/page";
import Solutions_Contexts_Shares_Page from "./[locale]/solutions/[solutionId]/contexts/[contextId]/shares/page";
import Solutions_Contexts_Shares_Profile_Page from "./[locale]/solutions/[solutionId]/contexts/[contextId]/shares/[contextShareId]/page";

import RootLayout from "./layout";

const redirectToPanelRoute: RouteObject = {
    path: "",
    element: <Navigate to="/panel" />,
};

const mainPanelRoute: RouteObject = {
    path: "panel",
    element: <RootLayout />,
    children: [
        { index: true, element: <RenderWithProps page={Home_Page} /> },
        {
            path: "auth",
            children: [
                {
                    path: "signIn",
                    element: <RenderWithProps page={Auth_SignIn_Page} />,
                },
                {
                    path: "signOut",
                    element: <RenderWithProps page={Auth_SignOut_Page} />,
                },
            ],
        },
        {
            path: "management",
            children: [
                {
                    path: "apiKeys",
                    children: [
                        {
                            path: "",
                            element: <RenderWithProps page={Management_ApiKeys_Page} />,
                        },

                        {
                            path: ":apiKeyId",
                            element: <RenderWithProps page={Management_ApiKeys_Profile_Page} />,
                        },
                    ],
                },
            ],
        },
        {
            path: "solutions",
            children: [
                {
                    path: "",
                    element: <RenderWithProps page={Solutions_Page} />,
                },
                {
                    path: ":solutionId",
                    children: [
                        {
                            path: "",
                            element: <RenderWithProps page={Solutions_Profile_Page} />,
                        },
                        {
                            path: "contexts",
                            children: [
                                {
                                    path: "",
                                    element: <RenderWithProps page={Solutions_Contexts_Page} />,
                                },
                                {
                                    path: ":contextId",
                                    children: [
                                        {
                                            path: "",
                                            element: <RenderWithProps page={Solutions_Contexts_Profile_Page} />,
                                        },
                                        {
                                            path: "users",
                                            children: [
                                                {
                                                    path: "",
                                                    element: <RenderWithProps page={Solutions_Contexts_Users_Page} />,
                                                },
                                                {
                                                    path: ":contextUserId",
                                                    element: <RenderWithProps page={Solutions_Contexts_Users_Profile_Page} />,
                                                },
                                            ],
                                        },
                                        {
                                            path: "shares",
                                            children: [
                                                {
                                                    path: "",
                                                    element: <RenderWithProps page={Solutions_Contexts_Shares_Page} />,
                                                },
                                                {
                                                    path: ":contextShareId",
                                                    element: <RenderWithProps page={Solutions_Contexts_Shares_Profile_Page} />,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

const instanceRootRoutes: RouteObject[] = [redirectToPanelRoute, mainPanelRoute];

const serverRootRoutesWithInstance: RouteObject = {
    path: "d",
    children: [
        {
            path: ":instanceId",
            children: instanceRootRoutes,
        },
    ],
};

export const router = createBrowserRouter([redirectToPanelRoute, mainPanelRoute, serverRootRoutesWithInstance]);

interface RenderWithPropsProps {
    page: React.ElementType;
}

function RenderWithProps(props: RenderWithPropsProps) {
    const params = useParams<"id">();
    const Page = props.page;

    return (
        <div>
            <Page params={params} />
        </div>
    );
}
