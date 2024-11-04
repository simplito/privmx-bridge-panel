import type { ManagerApi } from "@/privMxBridgeApi/ManagerApi";
import { useApi } from "./useApi";

export function useManagerApi(): ManagerApi {
    return useApi("manager");
}
