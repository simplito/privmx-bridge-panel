import type { AuthData } from "@/contexts/AuthDataContext";
import type { BaseApi } from "@/privMxBridgeApi/BaseApi";
import { ContextApi } from "@/privMxBridgeApi/ContextApi";
import { ManagerApi } from "@/privMxBridgeApi/ManagerApi";
import type { PrivMxBridgeApiEvents } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { SolutionApi } from "@/privMxBridgeApi/SolutionApi";
import type { PrivMxBridgeApiAuthData, PrivMxBridgeUrl } from "@/privMxBridgeApi/types";
import { Env } from "@/utils/Env";
import { useAuthData } from "./useAuthData";
import { usePrivMxBridgeApiEvents } from "./usePrivMxBridgeApiEvents";

interface ApiState<T extends BaseApi> {
    api: T;
    privMxBridgeUrl: PrivMxBridgeUrl;
    privMxBridgeApiAuthData: PrivMxBridgeApiAuthData | null;
    privMxBridgeApiEvents: PrivMxBridgeApiEvents;
}

interface ApiStates {
    context: ApiState<ContextApi> | null;
    manager: ApiState<ManagerApi> | null;
    solution: ApiState<SolutionApi> | null;
}

type ApiName = keyof ApiStates;

// Use a single instance of each Api for now, can be changed later if needed
const apiStates: ApiStates = {
    context: null,
    manager: null,
    solution: null,
};

const apiClasses = {
    context: ContextApi,
    manager: ManagerApi,
    solution: SolutionApi,
};

type ApiClasses = typeof apiClasses;

export function useApi<TApiName extends ApiName>(apiName: TApiName): InstanceType<ApiClasses[TApiName]> {
    const { authData } = useAuthData();
    const privMxBridgeApiEvents = usePrivMxBridgeApiEvents();

    return getApi(apiName, authData, privMxBridgeApiEvents);
}

export function getApi<TApiName extends ApiName>(
    apiName: TApiName,
    authData: AuthData,
    privMxBridgeApiEvents: PrivMxBridgeApiEvents,
): InstanceType<ApiClasses[TApiName]> {
    type ApiClassType = ApiClasses[TApiName];
    type ApiClassInstanceType = InstanceType<ApiClasses[TApiName]>;

    let apiState = apiStates[apiName] as ApiState<ApiClassInstanceType> | null;
    if (apiState !== null) {
        if (apiState.privMxBridgeApiAuthData !== authData.privMxBridgeApiAuthData) {
            apiState.api.setPrivMxBridgeApiAuthData(authData.privMxBridgeApiAuthData);
            apiState.privMxBridgeApiAuthData = authData.privMxBridgeApiAuthData;
        }
        if (apiState.privMxBridgeApiEvents !== privMxBridgeApiEvents) {
            apiState.api.setPrivMxBridgeApiEvents(privMxBridgeApiEvents);
            apiState.privMxBridgeApiEvents = privMxBridgeApiEvents;
        }
        return apiState.api;
    }

    const ApiClass = apiClasses[apiName] as ApiClassType;
    apiState = {
        api: new ApiClass({
            getPrivMxBridgeUrl: () => Env.privMxBridgeUrl,
            getPrivMxBridgeApiAuthData: () => authData.privMxBridgeApiAuthData,
            privMxBridgeApiEvents: privMxBridgeApiEvents,
        }) as ApiClassInstanceType,
        privMxBridgeUrl: Env.privMxBridgeUrl,
        privMxBridgeApiAuthData: authData.privMxBridgeApiAuthData,
        privMxBridgeApiEvents: privMxBridgeApiEvents,
    };
    apiStates[apiName] = apiState as (typeof apiStates)[TApiName];

    return apiState.api;
}
