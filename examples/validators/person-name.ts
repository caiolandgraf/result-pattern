import { Fail, Ok, type Result } from "@eicode/result-pattern";

export class PersonName {
	private constructor(public readonly value: string) {}

	static try(value: string): Result<PersonName, string> {
		if (!value) {
			return new Fail("Name is required");
		}

		if (value.length < 3) {
			return new Fail("Name must have at least 3 characters");
		}

		if (value.length > 100) {
			return new Fail("Name must have at most 100 characters");
		}

		// Verifica se contém apenas letras, espaços e alguns caracteres especiais comuns em nomes
		const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
		if (!nameRegex.test(value)) {
			return new Fail("Name contains invalid characters");
		}

		return new Ok(new PersonName(value));
	}

	toString(): string {
		return this.value;
	}
}
