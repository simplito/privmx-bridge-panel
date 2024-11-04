import { PrivMxBridgeApiEvents } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";

// Use a single instance of PrivMxBridgeApiEvents for now, can be changed later if needed
const privMxBridgeApiEvents = new PrivMxBridgeApiEvents();

export function usePrivMxBridgeApiEvents(): PrivMxBridgeApiEvents {
    return privMxBridgeApiEvents;
}

export function getPrivMxBridgeApiEvents(): PrivMxBridgeApiEvents {
    return privMxBridgeApiEvents;
}
