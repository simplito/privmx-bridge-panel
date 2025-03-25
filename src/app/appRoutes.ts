import type * as ServerApiTypes from "privmx-server-api";

function getRootPath(): string {
    const path = location.pathname;
    if (path.startsWith("/d/")) {
        const instanceId = path.split("/")[2];
        return `/d/${instanceId}/panel`;
    }
    return "/panel";
}

/* eslint-disable @typescript-eslint/naming-convention */
export const appRoutes = {
    _base: () => getRootPath(),
    home: () => `${appRoutes._base()}/`,
    auth: {
        _base: () => `${appRoutes._base()}/auth`,
        login: () => `${appRoutes.auth._base()}/login`,
        logout: () => `${appRoutes.auth._base()}/logout`,
    },
    access: {
        _base: () => `${appRoutes._base()}/access`,
        list: () => `${appRoutes.access._base()}/`,
        $apiKey: (apiKeyId: ServerApiTypes.types.auth.ApiKeyId) => ({
            _base: () => `${appRoutes.access._base()}/${apiKeyId}`,
            profile: () => `${appRoutes.access.$apiKey(apiKeyId)._base()}/`,
        }),
    },
    contexts: {
        _base: () => `${appRoutes._base()}/contexts`,
        list: () => `${appRoutes.contexts._base()}/`,
        $context: (contextId: ServerApiTypes.types.context.ContextId) => ({
            _base: () => `${appRoutes.contexts._base()}/${contextId}`,
            profile: () => `${appRoutes.contexts.$context(contextId)._base()}/`,
            users: {
                _base: () => `${appRoutes.contexts.$context(contextId)._base()}/users`,
                list: () => `${appRoutes.contexts.$context(contextId).users._base()}/`,
            },
            shares: {
                _base: () => `${appRoutes.contexts.$context(contextId)._base()}/shares`,
                list: () => `${appRoutes.contexts.$context(contextId).shares._base()}/`,
            },
        }),
    },
    solutions: {
        _base: () => `${appRoutes._base()}/solutions`,
        list: () => `${appRoutes.solutions._base()}/`,
        $solution: (solutionId: ServerApiTypes.types.cloud.SolutionId) => ({
            _base: () => `${appRoutes.solutions._base()}/${solutionId}`,
            profile: () => `${appRoutes.solutions.$solution(solutionId)._base()}/`,
        }),
    },
    users: {
        _base: () => `${appRoutes._base()}/users`,
        list: () => `${appRoutes.users._base()}/`,
        $user: (userId: ServerApiTypes.types.cloud.UserId) => ({
            _base: () => `${appRoutes.users._base()}/${userId}`,
            profile: () => `${appRoutes.users.$user(userId)._base()}/`,
        }),
    },
} as const;
/* eslint-enable @typescript-eslint/naming-convention */
