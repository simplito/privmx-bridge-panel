import { Logger } from "@/utils/Logger";
import { ApiCryptoUtils } from "./ApiCryptoUtils";
import { NoPrivMxBridgeApiAuthDataError } from "./errors/NoPrivMxBridgeApiAuthDataError";
import { RequestError } from "./errors/RequestError";
import type { PrivMxBridgeApiEvents } from "./PrivMxBridgeApiEvents";
import type * as types from "./types";

type FetchFn = typeof fetch;

export interface BaseApiOptions {
    getPrivMxBridgeUrl: () => types.PrivMxBridgeUrl | Promise<types.PrivMxBridgeUrl>;
    getPrivMxBridgeApiAuthData: () => types.PrivMxBridgeApiAuthData | Promise<types.PrivMxBridgeApiAuthData | null> | null;
    getCustomFetchFunction?: () => FetchFn | undefined | Promise<FetchFn | undefined>;
    privMxBridgeApiEvents?: PrivMxBridgeApiEvents | undefined;
}

interface ApiCallParams<TParams, TResult> {
    partialMethodName: string;
    params: TParams;
    onSuccess?: (result: TResult) => void | Promise<void>;
    noAuth?: boolean | undefined;
}

export abstract class BaseApi {
    static readonly apiKeyAuthType: "basic" | "hmacSha256" = "basic";

    constructor(protected options: BaseApiOptions) {}

    protected abstract getApiName(): string;

    setPrivMxBridgeApiAuthData(authData: types.PrivMxBridgeApiAuthData | null): void {
        this.options.getPrivMxBridgeApiAuthData = () => authData;
    }

    setPrivMxBridgeApiEvents(privMxBridgeApiEvents: PrivMxBridgeApiEvents): void {
        this.options.privMxBridgeApiEvents = privMxBridgeApiEvents;
    }

    protected async getApiUrl(): Promise<types.PrivMxBridgeApiUrl> {
        let url = await this.options.getPrivMxBridgeUrl();
        if (!url.endsWith("/")) {
            url = `${url}/` as types.PrivMxBridgeUrl;
        }
        const apiUrl = `${url}api` as types.PrivMxBridgeApiUrl;
        return apiUrl;
    }

    protected async call<TParams, TResult>(apiCallParams: ApiCallParams<TParams, TResult>): Promise<TResult> {
        const { partialMethodName, params } = apiCallParams;
        const requestPayloadObj: types.Request<TParams> = {
            jsonrpc: "2.0",
            id: 0,
            method: `${this.getApiName()}/${partialMethodName}`,
            params: params,
        };
        const requestPayloadStr = JSON.stringify(requestPayloadObj);
        let result: types.Response<TResult>;
        const fetchFn = (await this.options.getCustomFetchFunction?.()) ?? fetch;
        const rawResult = await fetchFn(await this.getApiUrl(), {
            cache: "no-cache",
            method: "POST",
            mode: "cors",
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "Content-Type": "application/json",
                ...(apiCallParams.noAuth === true ? {} : await this.getAuthHeaders(requestPayloadStr)),
            },
            body: requestPayloadStr,
        });
        try {
            result = (await rawResult.json()) as types.Response<TResult>;
        } catch (err) {
            throw new RequestError({
                code: -1,
                message: "Invalid response from server",
                data: err,
            });
        }
        if ("error" in result) {
            Logger.error("Request error", result.error);
            throw new RequestError(result.error);
        }
        if (apiCallParams.onSuccess) {
            try {
                await apiCallParams.onSuccess(result.result);
            } catch (err) {
                Logger.error("Error during calling onSuccess callback", err);
            }
        }
        return result.result;
    }

    protected async getAuthHeaders(requestPayload: string): Promise<Record<string, string>> {
        const authData = await this.options.getPrivMxBridgeApiAuthData();
        if (authData === null) {
            throw new NoPrivMxBridgeApiAuthDataError();
        }

        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: await this.buildAccessSig(authData, requestPayload),
        };
    }

    protected async buildAccessSig(authData: types.PrivMxBridgeApiAuthData, requestPayload: string): Promise<string> {
        if (authData.type === "accessToken") {
            return `Bearer ${authData.accessToken}`;
        }
        if (BaseApi.apiKeyAuthType === "basic" && authData.type === "apiKey") {
            const str = `${authData.apiKeyId}:${authData.apiKeySecret}`;
            return `Basic ${btoa(str)}`;
        }

        const timestamp = Date.now();
        const nonce = ApiCryptoUtils.generateNonce();
        const requestData = `POST\n/api\n${requestPayload}\n`;
        const dataToSign = `${timestamp};${nonce};${requestData}`;

        let signature: string;
        if (authData.type === "apiKey") {
            signature = (await ApiCryptoUtils.hmacSha256(authData.apiKeySecret, dataToSign)).subarray(0, 20).toString("base64");
        } else {
            // authData.type === "apiKeyWithEd25519"
            signature = (await ApiCryptoUtils.sign(authData.privateKey, dataToSign)).toString("base64");
        }

        return `pmx-hmac-sha256 ${authData.apiKeyId};1;${timestamp};${nonce};${signature}`;
    }
}
