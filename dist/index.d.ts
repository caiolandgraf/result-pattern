export type Result<V, E> = Ok<V, E> | Fail<V, E>;
interface IResult<V, E> {
    readonly isOk: boolean;
    readonly isFail: boolean;
    readonly value: V | E;
    map<NextV>(mapFn: (value: V) => NextV): Result<NextV, E>;
    flatMap<NextV>(mapFn: (value: V) => Result<NextV, E>): Result<NextV, E>;
    mapFails<NextE>(mapFn: (value: E) => NextE): Result<V, NextE>;
    flip(): Result<E, V>;
}
export declare class Ok<V = never, E = never> implements IResult<V, E> {
    readonly value: V;
    readonly isOk: true;
    readonly isFail: false;
    constructor(value: V);
    map<NextV>(mapFn: (value: V) => NextV): Result<NextV, E>;
    flatMap<NextV>(mapFn: (value: V) => Result<NextV, E>): Result<NextV, E>;
    mapFails<NextE>(mapFn: (value: E) => NextE): Result<V, NextE>;
    flip(): Result<E, V>;
}
export declare class Fail<V = never, E = never> implements IResult<V, E> {
    readonly value: E;
    readonly isOk: false;
    readonly isFail: true;
    constructor(value: E);
    map<NextV>(mapFn: (value: V) => NextV): Result<NextV, E>;
    flatMap<NextV>(mapFn: (value: V) => Result<NextV, E>): Result<NextV, E>;
    mapFails<NextE>(mapFn: (value: E) => NextE): Result<V, NextE>;
    flip(): Result<E, V>;
}
export declare namespace ResultUtils {
    type OkValues<T extends readonly Result<unknown, unknown>[]> = {
        [K in keyof T]: T[K] extends Result<infer V, unknown> ? V : never;
    };
    type FailValues<T extends readonly Result<unknown, unknown>[]> = T extends readonly Result<unknown, infer E>[] ? E[] : never;
    export function combine<T extends readonly Result<unknown, unknown>[]>(...results: T): Result<OkValues<T>, FailValues<T>>;
    export {};
}
export {};
//# sourceMappingURL=index.d.ts.map