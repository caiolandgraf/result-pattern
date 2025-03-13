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
		console.log("Valid data:", validEmail.toString(), validPassword.toString());
	} else {
		console.log("Invalid data:", combined.value);
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

	// Example 9: Handling API responses with Result pattern
	function fetchUserData(
		userId: number,
	): Result<{ name: string; age: number }, string> {
		if (userId === 1) {
			return new Ok({ name: "Alice", age: 30 });
		}
		return new Fail("User not found");
	}

	const userResponse = fetchUserData(1);
	userResponse
		.map((user) => console.log(`User found: ${user.name}, Age: ${user.age}`))
		.mapFails((err) => console.error(`Error fetching user: ${err}`));

	// Example 10: Form validation using Result
	function validateForm(email: string, password: string) {
		const emailResult = Email.try(email);
		const passwordResult = StrongPassword.try(password);

		const validation = ResultUtils.combine(emailResult, passwordResult);
		return validation;
	}

	const formResult = validateForm("invalid-email", "WeakPass");
	if (formResult.isFail) {
		console.error("Form errors:", formResult.value);
	} else {
		console.log("Form is valid:", formResult.value);
	}

	// Example 11: Using unwrapOrElse to provide fallback values
	const serverResponse = new Fail<number, string>("Server is down");
	const retryValue = serverResponse.unwrapOrElse(() => 500);
	console.log("Fallback value:", retryValue);

	// Example 12: Complex transformation pipeline
	const processUsername = (username: string): Result<string, string> => {
		if (!username) return new Fail("Username is empty");
		return new Ok(username.trim());
	};

	const sanitizedUsername = processUsername("  Caio  ")
		.map((name) => name.toLowerCase())
		.flatMap((name) =>
			name.length > 2 ? new Ok(name) : new Fail("Too short"),
		);

	console.log("Sanitized username:", sanitizedUsername.value);

	// Example 13: Nested Result handling
	function riskyOperation(): Result<Result<number, string>, string> {
		return new Ok(new Ok(100));
	}

	const nestedResult = riskyOperation().flatMap((r) => r);
	console.log("Flattened result:", nestedResult.unwrapOr(0));

	// Example 14: Using and/or to combine results
	const firstCheck = new Ok<boolean, string>(true);
	const secondCheck = new Fail<boolean, string>("Check failed");

	const finalCheck = firstCheck.and(secondCheck);
	console.log("Final check result:", finalCheck.isOk ? "Passed" : "Failed");

	const alternativeCheck = firstCheck.or(secondCheck);
	console.log(
		"Alternative check:",
		alternativeCheck.isOk ? "Passed" : "Failed",
	);
}
