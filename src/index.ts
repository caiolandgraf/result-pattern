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

export class Ok<V = never, E = never> implements IResult<V, E> {
	public readonly isOk = true as const;
	public readonly isFail = false as const;

	public constructor(public readonly value: V) {}

	public map<NextV>(mapFn: (value: V) => NextV): Result<NextV, E> {
		return new Ok(mapFn(this.value));
	}

	public flatMap<NextV>(
		mapFn: (value: V) => Result<NextV, E>,
	): Result<NextV, E> {
		return mapFn(this.value);
	}

	public mapFails<NextE>(mapFn: (value: E) => NextE): Result<V, NextE> {
		return new Ok(this.value);
	}

	public flip(): Result<E, V> {
		return new Fail(this.value);
	}
}

export class Fail<V = never, E = never> implements IResult<V, E> {
	public readonly isOk = false as const;
	public readonly isFail = true as const;

	public constructor(public readonly value: E) {}

	public map<NextV>(mapFn: (value: V) => NextV): Result<NextV, E> {
		return new Fail(this.value);
	}

	public flatMap<NextV>(
		mapFn: (value: V) => Result<NextV, E>,
	): Result<NextV, E> {
		return new Fail(this.value);
	}

	public mapFails<NextE>(mapFn: (value: E) => NextE): Result<V, NextE> {
		return new Fail(mapFn(this.value));
	}

	public flip(): Result<E, V> {
		return new Ok(this.value);
	}
}

export namespace ResultUtils {
	type OkValues<T extends readonly Result<unknown, unknown>[]> = {
		[K in keyof T]: T[K] extends Result<infer V, unknown> ? V : never;
	};
	type FailValues<T extends readonly Result<unknown, unknown>[]> =
		T extends readonly Result<unknown, infer E>[] ? E[] : never;

	export function combine<T extends readonly Result<unknown, unknown>[]>(
		...results: T
	): Result<OkValues<T>, FailValues<T>> {
		const fails = results.filter((r): r is Fail<unknown, unknown> => r.isFail);

		if (fails.length > 0) {
			const failValues = fails.map((f) => f.value) as FailValues<T>;
			return new Fail(failValues);
		}

		const okValues = results.map((r) => r.value) as OkValues<T>;
		return new Ok(okValues);
	}
}
