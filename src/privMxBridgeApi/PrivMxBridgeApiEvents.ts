/* eslint-disable @typescript-eslint/unified-signatures */

import type * as ServerApiTypes from "privmx-server-api";
import { Logger } from "@/utils/Logger";

export interface ApiKeyCreatedEvent {
    type: "apiKeyCreated";
    apiKeyId: ServerApiTypes.types.auth.ApiKeyId;
}

export interface ApiKeyUpdatedEvent {
    type: "apiKeyUpdated";
    apiKeyId: ServerApiTypes.types.auth.ApiKeyId;
}

export interface ApiKeyDeletedEvent {
    type: "apiKeyDeleted";
    apiKeyId: ServerApiTypes.types.auth.ApiKeyId;
}

export interface ApiKeysChangedEvent {
    type: "apiKeysChanged";
}

export interface ContextCreatedEvent {
    type: "contextCreated";
    contextId: ServerApiTypes.types.context.ContextId;
}

export interface ContextUpdatedEvent {
    type: "contextUpdated";
    contextId: ServerApiTypes.types.context.ContextId;
}

export interface ContextDeletedEvent {
    type: "contextDeleted";
    contextId: ServerApiTypes.types.context.ContextId;
}

export interface ContextsChangedEvent {
    type: "contextsChanged";
}

export interface SolutionCreatedEvent {
    type: "solutionCreated";
    solutionId: ServerApiTypes.types.cloud.SolutionId;
}

export interface SolutionUpdatedEvent {
    type: "solutionUpdated";
    solutionId: ServerApiTypes.types.cloud.SolutionId;
}

export interface SolutionDeletedEvent {
    type: "solutionDeleted";
    solutionId: ServerApiTypes.types.cloud.SolutionId;
}

export interface SolutionsChangedEvent {
    type: "solutionsChanged";
}

export type PrivMxBridgeApiEvent =
    | ApiKeyCreatedEvent
    | ApiKeyUpdatedEvent
    | ApiKeyDeletedEvent
    | ApiKeysChangedEvent
    | ContextCreatedEvent
    | ContextUpdatedEvent
    | ContextDeletedEvent
    | ContextsChangedEvent
    | SolutionCreatedEvent
    | SolutionUpdatedEvent
    | SolutionDeletedEvent
    | SolutionsChangedEvent;

export class PrivMxBridgeApiEvents {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected listeners = new Map<string, Array<(event: any) => void>>();

    addEventListener(type: ApiKeyCreatedEvent["type"], listener: (event: ApiKeyCreatedEvent) => void): void;
    addEventListener(type: ApiKeyUpdatedEvent["type"], listener: (event: ApiKeyUpdatedEvent) => void): void;
    addEventListener(type: ApiKeyDeletedEvent["type"], listener: (event: ApiKeyDeletedEvent) => void): void;
    addEventListener(type: ApiKeysChangedEvent["type"], listener: (event: ApiKeysChangedEvent) => void): void;
    addEventListener(type: ContextCreatedEvent["type"], listener: (event: ContextCreatedEvent) => void): void;
    addEventListener(type: ContextUpdatedEvent["type"], listener: (event: ContextUpdatedEvent) => void): void;
    addEventListener(type: ContextDeletedEvent["type"], listener: (event: ContextDeletedEvent) => void): void;
    addEventListener(type: ContextsChangedEvent["type"], listener: (event: ContextsChangedEvent) => void): void;
    addEventListener(type: SolutionsChangedEvent["type"], listener: (event: SolutionsChangedEvent) => void): void;
    addEventListener(type: SolutionCreatedEvent["type"], listener: (event: SolutionCreatedEvent) => void): void;
    addEventListener(type: SolutionUpdatedEvent["type"], listener: (event: SolutionUpdatedEvent) => void): void;
    addEventListener(type: SolutionDeletedEvent["type"], listener: (event: SolutionDeletedEvent) => void): void;
    addEventListener<T extends { type: string }>(type: T["type"], listener: (event: T) => void): void {
        const listeners = this.listeners.get(type);
        if (listeners) {
            listeners.push(listener);
        } else {
            this.listeners.set(type, [listener]);
        }
    }

    removeEventListener(type: ApiKeyCreatedEvent["type"], listener: (event: ApiKeyCreatedEvent) => void): void;
    removeEventListener(type: ApiKeyUpdatedEvent["type"], listener: (event: ApiKeyUpdatedEvent) => void): void;
    removeEventListener(type: ApiKeyDeletedEvent["type"], listener: (event: ApiKeyDeletedEvent) => void): void;
    removeEventListener(type: ApiKeysChangedEvent["type"], listener: (event: ApiKeysChangedEvent) => void): void;
    removeEventListener(type: ContextCreatedEvent["type"], listener: (event: ContextCreatedEvent) => void): void;
    removeEventListener(type: ContextUpdatedEvent["type"], listener: (event: ContextUpdatedEvent) => void): void;
    removeEventListener(type: ContextDeletedEvent["type"], listener: (event: ContextDeletedEvent) => void): void;
    removeEventListener(type: ContextsChangedEvent["type"], listener: (event: ContextsChangedEvent) => void): void;
    removeEventListener(type: SolutionsChangedEvent["type"], listener: (event: SolutionsChangedEvent) => void): void;
    removeEventListener(type: SolutionCreatedEvent["type"], listener: (event: SolutionCreatedEvent) => void): void;
    removeEventListener(type: SolutionUpdatedEvent["type"], listener: (event: SolutionUpdatedEvent) => void): void;
    removeEventListener(type: SolutionDeletedEvent["type"], listener: (event: SolutionDeletedEvent) => void): void;
    removeEventListener<T extends { type: string }>(type: T["type"], listener: (event: T) => void): void {
        const listeners = this.listeners.get(type);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    }

    dispatchEvent(event: ApiKeyCreatedEvent): void;
    dispatchEvent(event: ApiKeyUpdatedEvent): void;
    dispatchEvent(event: ApiKeyDeletedEvent): void;
    dispatchEvent(event: ApiKeysChangedEvent): void;
    dispatchEvent(event: ContextCreatedEvent): void;
    dispatchEvent(event: ContextUpdatedEvent): void;
    dispatchEvent(event: ContextDeletedEvent): void;
    dispatchEvent(event: ContextsChangedEvent): void;
    dispatchEvent(event: SolutionsChangedEvent): void;
    dispatchEvent(event: SolutionCreatedEvent): void;
    dispatchEvent(event: SolutionUpdatedEvent): void;
    dispatchEvent(event: SolutionDeletedEvent): void;
    dispatchEvent<T extends { type: string }>(event: T): void {
        const listeners = this.listeners.get(event.type);
        if (!listeners) {
            return;
        }
        for (const listener of listeners) {
            try {
                listener(event);
            } catch (e) {
                Logger.error("Error during calling event listener", e);
            }
        }
    }
}
