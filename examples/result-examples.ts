import { Fail, Ok, type Result, ResultUtils } from "@eicode/result-pattern";
import { Email } from "./validators/email";
import { StrongPassword } from "./validators/strong-password";

export function ExampleUsage() {
	// Example 1: Basic creation of results
	const okResult = new Ok(42);
	const failResult = new Fail("Something went wrong");

	console.log(
		"Ok result:",
		okResult.isOk ? "Success" : "Fail",
		okResult.unwrapOr(0),
	);
	console.log(
		"Fail result:",
		failResult.isFail ? "Fail" : "Success",
		failResult.unwrapOr("Default Error"),
	);

	// Example 2: Password validation
	const password = StrongPassword.try("123");
	console.log("Is valid password?", password.isOk);
	if (password.isFail) console.log("Errors:", password.value);

	// Example 3: Combining results
	const results = [new Ok(10), new Fail("user.not-found")];
	const result2 = ResultUtils.combine(...results);
	console.log(
		"Combination:",
		result2.isOk ? "Success" : "Fail",
		result2.unwrapOr([]),
	);

	// Example 4: Using map to transform values
	const uppercaseName = new Ok("john doe").map((name) => name.toUpperCase());
	console.log("Name in uppercase:", uppercaseName.unwrapOr(""));

	// Example 5: Using flatMap to chain operations
	const validateAndFormat = (name: string): Result<string, string> =>
		name.length < 3 ? new Fail("Name is too short") : new Ok(name.trim());

	const nameProcessing = new Ok("  John  ")
		.flatMap(validateAndFormat)
		.map((name) => name.toUpperCase());

	console.log("Processed name:", nameProcessing.unwrapOr("Invalid"));

	// Example 6: Email and password validation
	const email = Email.try("johndoe@example.com");
	const password2 = StrongPassword.try("Password@123");

	// Combining validations
	const combined = ResultUtils.combine(email, password2);
	if (combined.isOk) {
		const [validEmail, validPassword] = combined.value;
		console.log("Valid data:", validEmail.toString(), validPassword.toString());
	} else {
		console.log("Invalid data:", combined.unwrapOrGetErrors());
	}

	// Example 7: Using mapFail to transform errors
	const detailedError = new Fail("error.simple").mapFails(
		(err) => `Detailed error: ${err}`,
	);
	console.log("Transformed error:", detailedError.unwrapOr(""));

	// Example 8: Using flip to invert Ok/Fail
	const flippedOk = okResult.flip();
	const flippedFail = failResult.flip();
	console.log(
		"Flipped results:",
		flippedOk.isFail ? "Ok became Fail" : "Error",
		flippedFail.isOk ? "Fail became Ok" : "Error",
	);

	// Example 9: Handling API responses with Result pattern
	function fetchUserData(
		userId: number,
	): Result<{ name: string; age: number }, string> {
		return userId === 1
			? new Ok({ name: "Alice", age: 30 })
			: new Fail("User not found");
	}

	fetchUserData(1)
		.map((user) => console.log(`User found: ${user.name}, Age: ${user.age}`))
		.mapFails((err) => console.error(`Error fetching user: ${err}`));

	// Example 10: Form validation using Result
	function validateForm(email: string, password: string) {
		return ResultUtils.combine(Email.try(email), StrongPassword.try(password));
	}

	const formResult = validateForm("invalid-email", "WeakPass");
	console.log(
		formResult.isFail
			? `Form errors: ${formResult.value.join(", ")}`
			: `Form is valid: ${formResult.value}`,
	);

	// Example 11: Using unwrapOrElse to provide fallback values
	const retryValue = new Fail<number, string>("Server is down").unwrapOrElse(
		() => 500,
	);
	console.log("Fallback value:", retryValue);

	// Example 12: Complex transformation pipeline
	const sanitizedUsername = new Ok("  Caio  ")
		.map((name) => name.toLowerCase().trim())
		.flatMap((name) =>
			name.length > 2 ? new Ok(name) : new Fail("Too short"),
		);

	console.log(
		"Sanitized username:",
		sanitizedUsername.unwrapOr("Invalid username"),
	);

	// Example 13: Nested Result handling
	function riskyOperation(): Result<Result<number, string>, string> {
		return new Ok(new Ok(100));
	}

	console.log(
		"Flattened result:",
		riskyOperation().unwrapOr(new Fail("Operation failed")).unwrapOr(0),
	);

	// Example 14: Using and/or to combine results
	const firstCheck = new Ok<boolean, string>(true); // Ok<boolean, string>
	const secondCheck = new Fail<boolean, string>("Check failed"); // Fail<boolean, string>

	// `and` combination
	console.log(
		"Final check result:",
		firstCheck.and(secondCheck).isOk ? "Passed" : "Failed",
	);

	// `or` combination
	console.log(
		"Alternative check:",
		firstCheck.or(secondCheck).isOk ? "Passed" : "Failed",
	);
}
