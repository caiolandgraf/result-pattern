import { Fail, Ok, type Result } from "@eicode/result-pattern";

export class PersonName {
	private constructor(public readonly name: string) {}

	static try(name: string): Result<PersonName, string> {
		if (name && name.length > 0) {
			return new Ok(new PersonName(name));
		}

		return new Fail("person.name-invalid");
	}
}
