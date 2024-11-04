import type { ContextApi } from "@/privMxBridgeApi/ContextApi";
import { useApi } from "./useApi";

export function useContextApi(): ContextApi {
    return useApi("context");
}
