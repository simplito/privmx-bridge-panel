/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/naming-convention */
import { Navigate, type RouteObject, createBrowserRouter, useParams } from "react-router-dom";
import Home_Page from "./[locale]/page";
import Auth_Login_Page from "./[locale]/auth/login/page";
import Auth_Logout_Page from "./[locale]/auth/logout/page";
import Error_General_Page from "./[locale]/error";
import Error_NotFound_Page from "./[locale]/not-found";
import Access_Page from "./[locale]/access/page";
import Access_Profile_Page from "./[locale]/access/[accessId]/page";
import Contexts_Page from "./[locale]/contexts/page";
import Contexts_Profile_Page from "./[locale]/contexts/[contextId]/page";
import Contexts_Users_Page from "./[locale]/contexts/[contextId]/users/page";
import Contexts_Users_Profile_Page from "./[locale]/contexts/[contextId]/users/[userId]/page";
import Contexts_Shares_Page from "./[locale]/contexts/[contextId]/shares/page";
import Solutions_Page from "./[locale]/solutions/page";
import Solutions_Profile_Page from "./[locale]/solutions/[solutionId]/page";
import RootLayout from "./layout";

const error404Route: RouteObject = {
    path: "*",
    element: <Error_NotFound_Page />,
};

const redirectToPanelRoute: RouteObject = {
    path: "",
    element: <Navigate to="/panel" />,
};

const mainPanelRoute: RouteObject = {
    path: "panel",
    element: <RootLayout />,
    errorElement: <Error_General_Page />,
    children: [
        { index: true, element: <RenderWithProps page={Home_Page} />, errorElement: <Error_General_Page /> },
        error404Route,
        {
            path: "auth",
            errorElement: <Error_General_Page />,
            children: [
                {
                    path: "login",
                    element: <RenderWithProps page={Auth_Login_Page} />,
                },
                {
                    path: "logout",
                    element: <RenderWithProps page={Auth_Logout_Page} />,
                },
            ],
        },
        {
            path: "access",
            errorElement: <Error_General_Page />,
            children: [
                {
                    path: "",
                    element: <RenderWithProps page={Access_Page} />,
                },

                {
                    path: ":accessId",
                    element: <RenderWithProps page={Access_Profile_Page} />,
                },
            ],
        },
        {
            path: "contexts",
            errorElement: <Error_General_Page />,
            children: [
                {
                    path: "",
                    element: <RenderWithProps page={Contexts_Page} />,
                },
                {
                    path: ":contextId",
                    children: [
                        {
                            path: "",
                            element: <RenderWithProps page={Contexts_Profile_Page} />,
                        },
                        {
                            path: "users",
                            children: [
                                {
                                    path: "",
                                    element: <RenderWithProps page={Contexts_Users_Page} />,
                                },
                                {
                                    path: ":contextUserId",
                                    children: [
                                        {
                                            path: "",
                                            element: <RenderWithProps page={Contexts_Users_Profile_Page} />,
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            path: "shares",
                            children: [
                                {
                                    path: "",
                                    element: <RenderWithProps page={Contexts_Shares_Page} />,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            path: "solutions",
            errorElement: <Error_General_Page />,
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
                    ],
                },
            ],
        },
        // {
        //     path: "users",
        //     errorElement: <Error_General_Page />,
        //     children: [
        //         {
        //             path: "",
        //             element: <RenderWithProps page={Users_Page} />,
        //         },
        //         {
        //             path: ":userId",
        //             children: [
        //                 {
        //                     path: "",
        //                     element: <RenderWithProps page={Users_Profile_Page} />,
        //                 },
        //             ],
        //         },
        //     ],
        // },
    ],
};

const instanceRootRoutes: RouteObject[] = [redirectToPanelRoute, error404Route, mainPanelRoute];

const serverRootRoutesWithInstance: RouteObject = {
    path: "d",
    children: [
        {
            path: ":instanceId",
            children: instanceRootRoutes,
        },
    ],
};

export const router = createBrowserRouter([redirectToPanelRoute, error404Route, mainPanelRoute, serverRootRoutesWithInstance]);

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
