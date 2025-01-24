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
        signIn: () => `${appRoutes.auth._base()}/signIn`,
        signOut: () => `${appRoutes.auth._base()}/signOut`,
    },
    management: {
        _base: () => `${appRoutes._base()}/management`,
        apiKeys: {
            _base: () => `${appRoutes.management._base()}/apiKeys`,
            list: () => `${appRoutes.management.apiKeys._base()}/`,
            $apiKey: (apiKeyId: ServerApiTypes.types.auth.ApiKeyId) => ({
                _base: () => `${appRoutes.management.apiKeys._base()}/${apiKeyId}`,
                profile: () => `${appRoutes.management.apiKeys.$apiKey(apiKeyId)._base()}/`,
            }),
        },
    },
    solutions: {
        _base: () => `${appRoutes._base()}/solutions`,
        list: () => `${appRoutes.solutions._base()}/`,
        $solution: (solutionId: ServerApiTypes.types.cloud.SolutionId) => ({
            _base: () => `${appRoutes.solutions._base()}/${solutionId}`,
            profile: () => `${appRoutes.solutions.$solution(solutionId)._base()}/`,
            contexts: {
                _base: () => `${appRoutes.solutions.$solution(solutionId)._base()}/contexts`,
                list: () => `${appRoutes.solutions.$solution(solutionId).contexts._base()}/`,
                $context: (contextId: ServerApiTypes.types.context.ContextId) => ({
                    _base: () => `${appRoutes.solutions.$solution(solutionId).contexts._base()}/${contextId}`,
                    profile: () => `${appRoutes.solutions.$solution(solutionId).contexts.$context(contextId)._base()}/`,
                    users: {
                        _base: () => `${appRoutes.solutions.$solution(solutionId).contexts.$context(contextId)._base()}/users`,
                        list: () => `${appRoutes.solutions.$solution(solutionId).contexts.$context(contextId).users._base()}/`,
                        $user: (userId: ServerApiTypes.types.cloud.UserId) => ({
                            _base: () =>
                                `${appRoutes.solutions.$solution(solutionId).contexts.$context(contextId).users._base()}/${encodeURIComponent(userId)}`,
                            profile: () => `${appRoutes.solutions.$solution(solutionId).contexts.$context(contextId).users.$user(userId)._base()}/`,
                        }),
                    },
                    shares: {
                        _base: () => `${appRoutes.solutions.$solution(solutionId).contexts.$context(contextId)._base()}/shares`,
                        list: () => `${appRoutes.solutions.$solution(solutionId).contexts.$context(contextId).shares._base()}/`,
                        $share: (shareSolutionId: ServerApiTypes.types.cloud.SolutionId) => ({
                            _base: () => `${appRoutes.solutions.$solution(solutionId).contexts.$context(contextId).shares._base()}/${shareSolutionId}`,
                            profile: () => `${appRoutes.solutions.$solution(solutionId).contexts.$context(contextId).shares.$share(shareSolutionId)._base()}/`,
                        }),
                    },
                }),
            },
        }),
    },
} as const;
/* eslint-enable @typescript-eslint/naming-convention */
