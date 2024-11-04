import { VarNotSetError } from "./errors/VarNotSetError";

export function assertVarIsSet<TValue>(varValue: TValue, varName: string): asserts varValue is NonNullable<TValue> {
    if (varValue === undefined || varValue === null) {
        throw new VarNotSetError(varName);
    }
}
