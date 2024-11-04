import type { SolutionApi } from "@/privMxBridgeApi/SolutionApi";
import { useApi } from "./useApi";

export function useSolutionApi(): SolutionApi {
    return useApi("solution");
}
