import type * as ServerApiTypes from "privmx-server-api";
import type { AssertIsNever, GetExtraKeys } from "@/types";
import { BaseApi } from "./BaseApi";

export class ManagerApi extends BaseApi implements ServerApiTypes.api.manager.IManagerApi {
    async auth(model: ServerApiTypes.api.manager.AuthModel): Promise<ServerApiTypes.api.manager.AuthResult> {
        return await this.call({
            partialMethodName: "auth",
            params: model,
            noAuth: true,
        });
    }

    async bindAccessToken(model: ServerApiTypes.api.manager.BindAccessTokenModel): Promise<ServerApiTypes.types.core.OK> {
        return await this.call({
            partialMethodName: "bindAccessToken",
            params: model,
        });
    }

    async createApiKey(model: ServerApiTypes.api.manager.CreateApiKeyModel): Promise<ServerApiTypes.api.manager.CreateApiKeyResult> {
        return await this.call({
            partialMethodName: "createApiKey",
            params: model,
            onSuccess: (result) => {
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "apiKeyCreated",
                    apiKeyId: result.id,
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "apiKeysChanged",
                });
            },
        });
    }

    async deleteApiKey(model: ServerApiTypes.api.manager.DeleteApiKeyModel): Promise<ServerApiTypes.types.core.OK> {
        return await this.call({
            partialMethodName: "deleteApiKey",
            params: model,
            onSuccess: () => {
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "apiKeyDeleted",
                    apiKeyId: model.id,
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "apiKeysChanged",
                });
            },
        });
    }

    async getApiKey(model: ServerApiTypes.api.manager.GetApiKeyModel): Promise<ServerApiTypes.api.manager.GetApiKeyResult> {
        return await this.call({
            partialMethodName: "getApiKey",
            params: model,
        });
    }

    async listApiKeys(): Promise<ServerApiTypes.api.manager.ListApiKeysResult> {
        return await this.call({
            partialMethodName: "listApiKeys",
            params: {},
        });
    }

    async subscribeToChannel(model: ServerApiTypes.api.manager.SubscribeToChannelModel): Promise<ServerApiTypes.types.core.OK> {
        return await this.call({
            partialMethodName: "subscribeToChannel",
            params: model,
        });
    }

    async unsubscribeFromChannel(model: ServerApiTypes.api.manager.UnsubscribeFromChannelModel): Promise<ServerApiTypes.types.core.OK> {
        return await this.call({
            partialMethodName: "unsubscribeFromChannel",
            params: model,
        });
    }

    async updateApiKey(model: ServerApiTypes.api.manager.UpdateApiKeyModel): Promise<ServerApiTypes.types.core.OK> {
        return await this.call({
            partialMethodName: "updateApiKey",
            params: model,
            onSuccess: () => {
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "apiKeyUpdated",
                    apiKeyId: model.id,
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "apiKeysChanged",
                });
            },
        });
    }

    protected override getApiName(): string {
        return "manager";
    }
}

// Ensure that the ManagerApi class doesn't have any extra methods over the IManagerApi interface and the BaseApi class.
// This can happen when the API is updated and the ManagerApi class is not, because extra methods would not be caught by the compiler.
// This could lead to developers calling non-existing API methods.
type ExtraKeys = GetExtraKeys<BaseApi & ServerApiTypes.api.manager.IManagerApi, ManagerApi>;
type AssertionResult = AssertIsNever<ExtraKeys>;
declare const _assertionResult: AssertionResult; // Prevents TS/eslint "unused" error
