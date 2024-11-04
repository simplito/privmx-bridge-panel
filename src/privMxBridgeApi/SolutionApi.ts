import type * as ServerApiTypes from "privmx-server-api";
import type { AssertIsNever, GetExtraKeys } from "@/types";
import { BaseApi } from "./BaseApi";

export class SolutionApi extends BaseApi implements ServerApiTypes.api.solution.ISolutionApi {
    async createSolution(model: ServerApiTypes.api.solution.CreateSolutionModel): Promise<ServerApiTypes.api.solution.CreateSolutionResult> {
        return await this.call({
            partialMethodName: "createSolution",
            params: model,
            onSuccess: (result) => {
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "solutionCreated",
                    solutionId: result.solutionId,
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "solutionsChanged",
                });
            },
        });
    }

    async deleteSolution(model: ServerApiTypes.api.solution.DeleteSolutionModel): Promise<ServerApiTypes.types.core.OK> {
        return await this.call({
            partialMethodName: "deleteSolution",
            params: model,
            onSuccess: () => {
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "solutionDeleted",
                    solutionId: model.id,
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "solutionsChanged",
                });
            },
        });
    }

    async getSolution(model: ServerApiTypes.api.solution.GetSolutionModel): Promise<ServerApiTypes.api.solution.GetSolutionResult> {
        return await this.call({
            partialMethodName: "getSolution",
            params: model,
        });
    }

    async listSolutions(): Promise<ServerApiTypes.api.solution.ListSolutionsResult> {
        return await this.call({
            partialMethodName: "listSolutions",
            params: {},
        });
    }

    async updateSolution(model: ServerApiTypes.api.solution.UpdateSolutionModel): Promise<ServerApiTypes.types.core.OK> {
        return await this.call({
            partialMethodName: "updateSolution",
            params: model,
            onSuccess: () => {
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "solutionUpdated",
                    solutionId: model.id,
                });
                this.options.privMxBridgeApiEvents?.dispatchEvent({
                    type: "solutionsChanged",
                });
            },
        });
    }

    protected override getApiName(): string {
        return "solution";
    }
}

// Ensure that the SolutionApi class doesn't have any extra methods over the ISolutionApi interface and the BaseApi class.
// This can happen when the API is updated and the SolutionApi class is not, because extra methods would not be caught by the compiler.
// This could lead to developers calling non-existing API methods.
type ExtraKeys = GetExtraKeys<BaseApi & ServerApiTypes.api.solution.ISolutionApi, SolutionApi>;
type AssertionResult = AssertIsNever<ExtraKeys>;
declare const _assertionResult: AssertionResult; // Prevents TS/eslint "unused" error
