import { Fail, Ok, type Result } from "@eicode/result-pattern";

export class Email {
	private constructor(public readonly value: string) {}

	static try(value: string): Result<Email, string> {
		if (!value) {
			return new Fail("Email é obrigatório");
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) {
			return new Fail("Email inválido");
		}

		return new Ok(new Email(value));
	}

	toString(): string {
		return this.value;
	}
}
