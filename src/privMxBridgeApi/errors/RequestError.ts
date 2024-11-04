import type * as types from "../types";

export class RequestError extends Error {
    constructor(public errorData: types.ErrorData) {
        super(`Request error: [${errorData.code}] ${errorData.message}`);
    }
}
