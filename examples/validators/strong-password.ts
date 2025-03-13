import { Fail, Ok, type Result } from "@eicode/result-pattern";

export class StrongPassword {
	private constructor(public readonly value: string) {}

	static try(value: string): Result<StrongPassword, string[]> {
		if (!value) {
			return new Fail(["Password is required"]);
		}

		if (value.length < 8) {
			return new Fail(["Password must have at least 8 characters"]);
		}

		const hasUpperCase = /[A-Z]/.test(value);
		const hasLowerCase = /[a-z]/.test(value);
		const hasNumbers = /\d/.test(value);
		const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);

		const errors: string[] = [];
		if (!hasUpperCase)
			errors.push("Password must contain at least one uppercase letter");
		if (!hasLowerCase)
			errors.push("Password must contain at least one lowercase letter");
		if (!hasNumbers) errors.push("Password must contain at least one number");
		if (!hasSpecialChar)
			errors.push("Password must contain at least one special character");

		if (errors.length > 0) {
			return new Fail(errors);
		}

		return new Ok(new StrongPassword(value));
	}

	toString(): string {
		return this.value;
	}
}
