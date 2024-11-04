import type * as ServerApiTypes from "privmx-server-api";
import type { AssertIsNever, GetExtraKeys } from "@/types";
import { BaseApi } from "./BaseApi";

export class ContextApi extends BaseApi implements ServerApiTypes.api.context.IContextApi {
    async addSolutionToContext(model: ServerApiTypes.api.context.AddSolutionToContextModel): Promise<ServerApiTypes.types.core.OK> {
        return await this.call({
            partialMethodName: "addSolutionToContext",
            params: model,
            onSuccess: () => {
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "contextUpdated",
                    contextId: model.contextId,
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "contextsChanged",
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "solutionUpdated",
                    solutionId: model.solutionId,
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "solutionsChanged",
                });
            },
        });
    }

    async addUserToContext(model: ServerApiTypes.api.context.AddUserToContextModel): Promise<ServerApiTypes.types.core.OK> {
        return await this.call({
            partialMethodName: "addUserToContext",
            params: model,
            onSuccess: () => {
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "contextUpdated",
                    contextId: model.contextId,
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "contextsChanged",
                });
            },
        });
    }

    async createContext(model: ServerApiTypes.api.context.CreateContextModel): Promise<ServerApiTypes.api.context.CreateContextResult> {
        return await this.call({
            partialMethodName: "createContext",
            params: model,
            onSuccess: (result) => {
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "contextCreated",
                    contextId: result.contextId,
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "contextsChanged",
                });
            },
        });
    }

    async deleteContext(model: ServerApiTypes.api.context.DeleteContextModel): Promise<ServerApiTypes.types.core.OK> {
        return await this.call({
            partialMethodName: "deleteContext",
            params: model,
            onSuccess: () => {
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "contextDeleted",
                    contextId: model.contextId,
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "contextsChanged",
                });
            },
        });
    }

    async getContext(model: ServerApiTypes.api.context.GetContextModel): Promise<ServerApiTypes.api.context.GetContextResult> {
        return await this.call({
            partialMethodName: "getContext",
            params: model,
        });
    }

    async getUserFromContext(model: ServerApiTypes.api.context.GetUserFromContextModel): Promise<ServerApiTypes.api.context.GetUserFromContextResult> {
        return await this.call({
            partialMethodName: "getUserFromContext",
            params: model,
        });
    }

    async getUserFromContextByPubKey(
        model: ServerApiTypes.api.context.GetUserFromContextByPubKeyModel,
    ): Promise<ServerApiTypes.api.context.GetUserFromContextResult> {
        return await this.call({
            partialMethodName: "getUserFromContextByPubKey",
            params: model,
        });
    }

    async listContexts(model: ServerApiTypes.api.context.ListContextsModel): Promise<ServerApiTypes.api.context.ListContextsResult> {
        return await this.call({
            partialMethodName: "listContexts",
            params: model,
        });
    }

    async listContextsOfSolution(model: ServerApiTypes.api.context.ListContextsOfSolutionModel): Promise<ServerApiTypes.api.context.ListContextsResult> {
        return await this.call({
            partialMethodName: "listContextsOfSolution",
            params: model,
        });
    }

    async listUsersFromContext(model: ServerApiTypes.api.context.ListUsersFromContextModel): Promise<ServerApiTypes.api.context.ListUsersFromContextResult> {
        return await this.call({
            partialMethodName: "listUsersFromContext",
            params: model,
        });
    }

    async removeSolutionFromContext(model: ServerApiTypes.api.context.RemoveSolutionFromContextModel): Promise<ServerApiTypes.types.core.OK> {
        return await this.call({
            partialMethodName: "removeSolutionFromContext",
            params: model,
            onSuccess: () => {
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "contextUpdated",
                    contextId: model.contextId,
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "contextsChanged",
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "solutionUpdated",
                    solutionId: model.solutionId,
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "solutionsChanged",
                });
            },
        });
    }

    async removeUserFromContext(model: ServerApiTypes.api.context.RemoveUserFromContextModel): Promise<ServerApiTypes.types.core.OK> {
        return await this.call({
            partialMethodName: "removeUserFromContext",
            params: model,
            onSuccess: () => {
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "contextUpdated",
                    contextId: model.contextId,
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "contextsChanged",
                });
            },
        });
    }

    async removeUserFromContextByPubKey(model: ServerApiTypes.api.context.RemoveUserFromContextByPubKeyModel): Promise<ServerApiTypes.types.core.OK> {
        return await this.call({
            partialMethodName: "removeUserFromContextByPubKey",
            params: model,
            onSuccess: () => {
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "contextUpdated",
                    contextId: model.contextId,
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "contextsChanged",
                });
            },
        });
    }

    async setUserAcl(model: ServerApiTypes.api.context.SetUserAclModel): Promise<ServerApiTypes.types.core.OK> {
        return await this.call({
            partialMethodName: "setUserAcl",
            params: model,
            onSuccess: () => {
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "contextUpdated",
                    contextId: model.contextId,
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "contextsChanged",
                });
            },
        });
    }

    async updateContext(model: ServerApiTypes.api.context.UpdateContextModel): Promise<ServerApiTypes.types.core.OK> {
        return await this.call({
            partialMethodName: "updateContext",
            params: model,
            onSuccess: () => {
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "contextUpdated",
                    contextId: model.contextId,
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "contextsChanged",
                });
            },
        });
    }

    protected override getApiName(): string {
        return "context";
    }
}

// Ensure that the ContextApi class doesn't have any extra methods over the IContextApi interface and the BaseApi class.
// This can happen when the API is updated and the ContextApi class is not, because extra methods would not be caught by the compiler.
// This could lead to developers calling non-existing API methods.
type ExtraKeys = GetExtraKeys<BaseApi & ServerApiTypes.api.context.IContextApi, ContextApi>;
type AssertionResult = AssertIsNever<ExtraKeys>;
declare const _assertionResult: AssertionResult; // Prevents TS/eslint "unused" error
