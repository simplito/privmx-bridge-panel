import type * as ServerApiTypes from "privmx-server-api";

export const contextScopes = ["private", "public"] as const;

export type ContextScope = (typeof contextScopes)[number];

// Ensure that options constant exactly matches the ServerApiTypes.api.context.ContextScope.
type OptionValue = (typeof contextScopes)[number];
type Scope = ServerApiTypes.types.context.ContextScope;
type A = OptionValue extends Scope ? true : false;
type B = Scope extends OptionValue ? true : false;
type AssertTrue<T extends true> = T;
type IsAssignableA = AssertTrue<A>;
type IsAssignableB = AssertTrue<B>;
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const _assertionResultA: IsAssignableA; // Prevents TS "unused" error
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const _assertionResultB: IsAssignableB; // Prevents TS "unused" error
