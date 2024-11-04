export type Opaque<TPrimary, TUnique extends symbol> = TPrimary & { [P in TUnique]: never };

declare const Timestamp: unique symbol;
export type Timestamp = Opaque<number, typeof Timestamp>;

export type GetExtraKeys<TBase, TTarget> = Exclude<keyof TTarget, keyof TBase>;

export type AssertIsNever<T extends never> = T extends never ? true : false;
