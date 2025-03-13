import { Fail, Ok, type Result, ResultUtils } from "@eicode/result-pattern";
import { Email } from "./validators/email";
import { StrongPassword } from "./validators/strong-password";

export function ExampleUsage() {
	// Example 1: Basic creation of results
	const okResult = new Ok<number, string>(42);
	const failResult = new Fail<number, string>("Something went wrong");

	console.log("Ok result:", okResult.isOk ? "Success" : "Fail", okResult.value);
	console.log(
		"Fail result:",
		failResult.isFail ? "Fail" : "Success",
		failResult.value,
	);

	// Example 2: Password validation
	const password = StrongPassword.try("123");
	console.log("Is valid password?", password.isOk);
	if (password.isFail) {
		console.log("Errors:", password.value);
	}

	// Example 3: Combining results
	const results = [
		new Ok<number, string>(10),
		new Fail<number, string>("user.not-found"),
	];
	const result2 = ResultUtils.combine(...results);
	console.log("Combination:", result2.isOk ? "Success" : "Fail");

	// Example 4: Using map to transform values
	const nameResult = new Ok<string, string>("john doe");
	const uppercaseName = nameResult.map((name) => name.toUpperCase());
	console.log("Name in uppercase:", uppercaseName.value);

	// Example 5: Using flatMap to chain operations
	const validateAndFormat = (name: string): Result<string, string> => {
		if (name.length < 3) return new Fail("Name is too short");
		return new Ok(name.trim());
	};

	const nameProcessing = new Ok<string, string>("  John  ")
		.flatMap(validateAndFormat)
		.map((name) => name.toUpperCase());

	console.log("Processed name:", nameProcessing.value);

	// Example 6: Email and password validation
	const email = Email.try("johndoe@example.com");
	const password2 = StrongPassword.try("Password@123");

	// Combining validations
	const combined = ResultUtils.combine(email, password2);
	if (combined.isOk) {
		const [validEmail, validPassword] = combined.value;
		console.log(
			"Invalid data:",
			validEmail.toString(),
			validPassword.toString(),
		);
	}

	// Example 7: Using mapFail to transform errors
	const errorResult = new Fail<number, string>("error.simple");
	const detailedError = errorResult.mapFails((err) => `Detailed error: ${err}`);
	console.log("Transformed error:", detailedError.value);

	// Example 8: Using flip to invert Ok/Fail
	const flippedOk = okResult.flip(); // Now is Fail
	const flippedFail = failResult.flip(); // Now is Ok
	console.log(
		"Flipped results:",
		flippedOk.isFail ? "Ok became Fail" : "Error",
		flippedFail.isOk ? "Fail became Ok" : "Error",
	);
}
