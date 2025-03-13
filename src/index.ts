export type Result<V = unknown, E = unknown> = Ok<V, E> | Fail<V, E>;

/**
 * Interface representing a result that can be either successful (Ok) or failed (Fail).
 */
interface IResult<V, E> {
	readonly isOk: boolean;
	readonly isFail: boolean;

	/**
	 * Transforms the value if the result is Ok.
	 * It maps a `Result<V, E>` into `Result<NextV, E>`.
	 */
	map<NextV>(mapFn: (value: V) => NextV): Result<NextV, E>;

	/**
	 * Transforms the value into another Result if the result is Ok.
	 * It maps a `Result<V, E>` into `Result<NextV, E>`.
	 */
	flatMap<NextV>(mapFn: (value: V) => Result<NextV, E>): Result<NextV, E>;

	/**
	 * Transforms the error if the result is Fail.
	 * It maps a `Result<V, E>` into `Result<V, NextE>`.
	 */
	mapFails<NextE>(mapFn: (value: E) => NextE): Result<V, NextE>;

	/**
	 * Swaps the Ok value with the Fail value, transforming a `Result<V, E>` into a `Result<E, V>`.
	 */
	flip(): Result<E, V>;

	/**
	 * Extracts the Ok value or throws an error if it's a Fail.
	 */
	unwrap(): V;

	/**
	 * Returns the Ok value or the provided default value if it's a Fail.
	 */
	unwrapOr(defaultValue: V): V;

	/**
	 * Returns the Ok value or calls the provided function to generate a default value if it's a Fail.
	 */
	unwrapOrElse(fn: () => V): V;

	/**
	 * Extracts the Ok value or throws an error with a custom message if it's a Fail.
	 */
	expect(message: string): V;

	/**
	 * Returns the provided result if this is Ok; otherwise, returns Fail.
	 */
	and<NextV>(result: Result<NextV, E>): Result<NextV, E>;

	/**
	 * Returns the return value of `fn` if this is Ok; otherwise, returns Fail.
	 */
	andThen<NextV>(fn: () => Result<NextV, E>): Result<NextV, E>;

	/**
	 * Returns this result if it is Ok; otherwise, returns the provided result.
	 */
	or(result: Result<V, E>): Result<V, E>;

	/**
	 * Returns this result if it is Ok; otherwise, returns the return value of the provided function.
	 */
	orElse(fn: () => Result<V, E>): Result<V, E>;

	/**
	 * Returns the Ok value if successful, or the error value if it's a Fail.
	 * This allows accessing the error values directly without type constraints.
	 */
	valueOrError(): V | E;

	/**
	 * Pattern matching for Result types. Provides a more elegant way to handle both cases.
	 */
	match<R>(patterns: { ok: (value: V) => R; fail: (error: E) => R }): R;
}

/**
 * Represents a successful result.
 */
export class Ok<V = unknown, E = unknown> implements IResult<V, E> {
	public readonly isOk = true as const;
	public readonly isFail = false as const;

	public constructor(public readonly value: V) {}

	// ✅ Transforms the value if the result is Ok
	public map<NextV>(mapFn: (value: V) => NextV): Result<NextV, E> {
		return new Ok(mapFn(this.value));
	}

	// ✅ Transforms the value into another Result if the result is Ok
	public flatMap<NextV>(
		mapFn: (value: V) => Result<NextV, E>,
	): Result<NextV, E> {
		return mapFn(this.value);
	}

	// ✅ Returns Ok without modifying the value
	public mapFails<NextE>(_: (value: E) => NextE): Result<V, NextE> {
		return new Ok<V, NextE>(this.value);
	}

	// ✅ Converts Ok to Fail
	public flip(): Result<E, V> {
		return new Fail<E, V>(this.value);
	}

	// ✅ Extracts the Ok value
	public unwrap(): V {
		return this.value;
	}

	// ✅ Extracts the Ok value, ignoring the default value
	public unwrapOr(_defaultValue: V): V {
		return this.value;
	}

	// ✅ Extracts the Ok value, ignoring the function
	public unwrapOrElse(_fn: () => V): V {
		return this.value;
	}

	// ✅ Extracts the Ok value, ignoring the message
	public expect(_: string): V {
		return this.value;
	}

	// ✅ Returns the provided result
	public and<NextV>(result: Result<NextV, E>): Result<NextV, E> {
		return result;
	}

	// ✅ Returns the return value of the provided function
	public andThen<NextV>(fn: () => Result<NextV, E>): Result<NextV, E> {
		return fn();
	}

	// ✅ Returns this result as it is Ok
	public or(_: Result<V, E>): Result<V, E> {
		return this;
	}

	// ✅ Returns this result as it is Ok
	public orElse(_: () => Result<V, E>): Result<V, E> {
		return this;
	}

	// ✅ Returns the Ok value
	public valueOrError(): V {
		return this.value;
	}

	// ✅ Pattern matching for Result types
	public match<R>(patterns: { ok: (value: V) => R; fail: (error: E) => R }): R {
		return patterns.ok(this.value);
	}
}

/**
 * Represents a failed result.
 */
export class Fail<V = unknown, E = unknown> implements IResult<V, E> {
	public readonly isOk = false as const;
	public readonly isFail = true as const;

	public constructor(public readonly value: E) {}

	// ✅ Always returns Fail
	public map<NextV>(_: (value: V) => NextV): Result<NextV, E> {
		return new Fail<NextV, E>(this.value);
	}

	// ✅ Always returns Fail
	public flatMap<NextV>(_: (value: V) => Result<NextV, E>): Result<NextV, E> {
		return new Fail<NextV, E>(this.value);
	}

	// ✅ Transforms the error value if the result is Fail
	public mapFails<NextE>(mapFn: (value: E) => NextE): Result<V, NextE> {
		return new Fail<V, NextE>(mapFn(this.value));
	}

	// ✅ Converts Fail to Ok
	public flip(): Result<E, V> {
		return new Ok<E, V>(this.value);
	}

	// ✅ Throws an error when trying to unwrap a Fail
	public unwrap(): V {
		throw new Error("Tried to unwrap a Fail result");
	}

	// ✅ Returns the provided default value
	public unwrapOr(defaultValue: V): V {
		return defaultValue;
	}

	// ✅ Calls the provided function to generate a default value
	public unwrapOrElse(fn: () => V): V {
		return fn();
	}

	// ✅ Throws an error with the provided message
	public expect(message: string): V {
		throw new Error(message);
	}

	// ✅ Always returns Fail
	public and<NextV>(_: Result<NextV, E>): Result<NextV, E> {
		return new Fail<NextV, E>(this.value);
	}

	// ✅ Always returns Fail
	public andThen<NextV>(_: () => Result<NextV, E>): Result<NextV, E> {
		return new Fail<NextV, E>(this.value);
	}
	// ✅ Returns another Result if this is a Fail
	public or(result: Result<V, E>): Result<V, E> {
		return result;
	}

	// ✅ Returns the return value of the provided function if this is a Fail
	public orElse(fn: () => Result<V, E>): Result<V, E> {
		return fn();
	}

	// ✅ Returns the error value
	public valueOrError(): E {
		return this.value;
	}

	// ✅ Pattern matching for Result types
	public match<R>(patterns: { ok: (value: V) => R; fail: (error: E) => R }): R {
		return patterns.fail(this.value);
	}
}

/**
 * Utility functions for working with results.
 */
export namespace ResultUtils {
	type OkValues<T extends readonly Result[]> = {
		[K in keyof T]: T[K] extends Result<infer V, unknown> ? V : never;
	};

	type FailValues<T extends readonly Result[]> = {
		[K in keyof T]: T[K] extends Result<unknown, infer E> ? E : never;
	}[number][];

	/**
	 * Combines multiple results into a single result.
	 * If any result is Fail, returns a Fail containing all error values.
	 * Otherwise, returns an Ok containing all success values.
	 */
	export function combine<T extends readonly Result[]>(
		...results: T
	): Result<OkValues<T>, FailValues<T>> {
		const fails = results.filter((r) => r instanceof Fail) as Fail[];

		if (fails.length > 0) {
			const failValues = fails.map((f) => f.value) as FailValues<T>;
			return new Fail(failValues);
		}

		const okValues = results.map((r) => r.unwrapOr(null)) as OkValues<T>;
		return new Ok(okValues);
	}
}
