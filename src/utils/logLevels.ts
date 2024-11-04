export const logLevels = ["log", "warn", "error"] as const;
export type LogLevel = (typeof logLevels)[number];
