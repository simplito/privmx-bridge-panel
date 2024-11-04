export class VarNotSetError extends Error {
    constructor(varName: string) {
        super(`Variable not set: ${varName}`);
    }
}
