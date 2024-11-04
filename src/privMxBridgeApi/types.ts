import type * as ServerApiTypes from "privmx-server-api";
import type { Opaque, Timestamp } from "@/types";

declare const ApiKeyId: unique symbol;
export type ApiKeyId = Opaque<string, typeof ApiKeyId>;

declare const ApiKeySecret: unique symbol;
export type ApiKeySecret = Opaque<string, typeof ApiKeySecret>;

declare const Ed25519PublicKey: unique symbol;
export type Ed25519PublicKey = Opaque<string, typeof Ed25519PublicKey>;

declare const Ed25519PrivateKey: unique symbol;
export type Ed25519PrivateKey = Opaque<string, typeof Ed25519PrivateKey>;

declare const AccessToken: unique symbol;
export type AccessToken = Opaque<string, typeof AccessToken>;

declare const RefreshToken: unique symbol;
export type RefreshToken = Opaque<string, typeof RefreshToken>;

declare const AccessTokenExpiry: unique symbol;
export type AccessTokenExpiry = Opaque<Timestamp, typeof AccessTokenExpiry>;

declare const RefreshTokenExpiry: unique symbol;
export type RefreshTokenExpiry = Opaque<Timestamp, typeof RefreshTokenExpiry>;

declare const PrivMxBridgeUrl: unique symbol;
export type PrivMxBridgeUrl = Opaque<string, typeof PrivMxBridgeUrl>;

declare const PrivMxBridgeApiUrl: unique symbol;
export type PrivMxBridgeApiUrl = Opaque<string, typeof PrivMxBridgeApiUrl>;

export interface ApiKeyPrivMxBridgeApiAuthData {
    type: "apiKey";
    apiKeyId: ApiKeyId;
    apiKeySecret: ApiKeySecret;
}

export interface ApiKeyWithEd25519PrivMxBridgeApiAuthData {
    type: "apiKeyWithEd25519";
    apiKeyId: ApiKeyId;
    apiKeySecret: ApiKeySecret;
    publicKey: Ed25519PublicKey;
    privateKey: Ed25519PrivateKey;
}

export interface AccessTokenPrivMxBridgeApiAuthData {
    type: "accessToken";
    accessToken: AccessToken;
    refreshToken: RefreshToken;
    accessTokenExpiry: AccessTokenExpiry;
    refreshTokenExpiry: RefreshTokenExpiry;
}

export type PrivMxBridgeApiAuthData = ApiKeyPrivMxBridgeApiAuthData | ApiKeyWithEd25519PrivMxBridgeApiAuthData | AccessTokenPrivMxBridgeApiAuthData;

export interface Request<T> {
    jsonrpc: "2.0";
    id: number;
    method: string;
    params: T;
}

export type Response<T> = SuccessResponse<T> | ErrorResponse;

export interface SuccessResponse<T> {
    jsonrpc: "2.0";
    id: number;
    result: T;
}

export interface ErrorResponse {
    jsonrpc: "2.0";
    id: number;
    error: ErrorData;
}

export interface ErrorData {
    code: number;
    message: string;
    data: unknown;
}

export interface ContextShareIds {
    contextId: ServerApiTypes.types.context.ContextId;
    solutionId: ServerApiTypes.types.cloud.SolutionId;
}

export interface ContextShare {
    context: ServerApiTypes.api.context.Context;
    solution: ServerApiTypes.api.solution.Solution;
}

export interface ContextUserExIds {
    contextId: ServerApiTypes.types.context.ContextId;
    solutionId: ServerApiTypes.types.cloud.SolutionId;
    userId: ServerApiTypes.types.cloud.UserId;
}

export interface ContextUserEx {
    context: ServerApiTypes.api.context.Context;
    solution: ServerApiTypes.api.solution.Solution;
    user: ServerApiTypes.api.context.ContextUser;
}

export type ApiScope = "apiKey" | "solution" | "context" | `session:${string}` | `ipAddr:${string}`;
