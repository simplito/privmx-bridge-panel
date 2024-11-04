/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any */

import { useEffect } from "react";
import type { PrivMxBridgeApiEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { usePrivMxBridgeApiEvents } from "./usePrivMxBridgeApiEvents";

export function usePrivMxBridgeApiEventListener<TEvent extends PrivMxBridgeApiEvent>(eventType: TEvent["type"], handler: (event: TEvent) => unknown): void {
    const privMxBridgeApiEvents = usePrivMxBridgeApiEvents();
    useEffect(() => {
        privMxBridgeApiEvents.addEventListener(eventType as any, handler as any);
        return () => {
            privMxBridgeApiEvents.removeEventListener(eventType as any, handler as any);
        };
    }, [eventType, handler, privMxBridgeApiEvents]);
}
