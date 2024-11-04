export class MissingEnvVarError extends Error {
    constructor(envVarName: string) {
        super(`Missing environment variable: ${envVarName}`);
    }
}
