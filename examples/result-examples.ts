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
		console.log("Invalid data:", combined.valueOrError());
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

	// Example 9: Using valueOrError for direct access to values or errors
	const successResult = new Ok("Success data");
	const errorResult = new Fail("Error message");

	console.log("Success value:", successResult.valueOrError()); // "Success data"
	console.log("Error value:", errorResult.valueOrError()); // "Error message"

	// Example 10: Using match for elegant pattern matching
	const userResult = new Ok({ name: "Alice", age: 30 });

	const greeting = userResult.match({
		ok: (user) => `Hello, ${user.name}! You are ${user.age} years old.`,
		fail: (error) => `Could not greet user: ${error}`,
	});

	console.log("Greeting:", greeting); // "Hello, Alice! You are 30 years old."

	// Example 11: Using andThen for operation chaining
	function fetchUserProfile(
		userId: number,
	): Result<{ id: number; name: string }, string> {
		return userId > 0
			? new Ok({ id: userId, name: `User ${userId}` })
			: new Fail("Invalid user ID");
	}

	function fetchUserPreferences(user: { id: number; name: string }): Result<
		{ theme: string },
		string
	> {
		return new Ok({ theme: "dark" });
	}

	const userWithPrefs = fetchUserProfile(123).andThen(() =>
		fetchUserPreferences({ id: 123, name: "Alice" }),
	);

	console.log("User preferences:", userWithPrefs.valueOrError());

	// Example 12: Using orElse for fallback strategies
	function getPrimaryUser(id: number): Result<{ name: string }, string> {
		return new Fail("Primary database offline");
	}

	function getBackupUser(id: number): Result<{ name: string }, string> {
		return new Ok({ name: "Backup User" });
	}

	const userData = getPrimaryUser(42).orElse(() => getBackupUser(42));

	console.log("User data from fallback:", userData.valueOrError());

	// Example 13: Complex form validation with pattern matching
	function validateRegistrationForm(email: string, password: string) {
		const emailResult = Email.try(email);
		const passwordResult = StrongPassword.try(password);

		return ResultUtils.combine(emailResult, passwordResult).match({
			ok: ([validEmail, validPassword]) => ({
				success: true,
				user: {
					email: validEmail.toString(),
					passwordStrength: "Strong",
				},
			}),
			fail: (errors) => ({
				success: false,
				errors: errors,
				user: {
					email: "",
					passwordStrength: "",
				},
			}),
		});
	}

	const formValidation = validateRegistrationForm("invalid-email", "weak");
	console.log("Form validation result:", formValidation);

	// Example 14: Chaining multiple operations with andThen and match
	function processUserRegistration(email: string, password: string) {
		return Email.try(email)
			.flatMap((validEmail) => {
				// Check if email already exists
				const emailExists = false; // Simulate database check
				return emailExists
					? new Fail<Email, string>("Email already registered")
					: new Ok<Email, string>(validEmail);
			})
			.andThen(() =>
				StrongPassword.try(password).mapFails((errors) => errors.join(", ")),
			)
			.andThen(() => {
				// Create user in database (simulated)
				return new Ok("user_123"); // Return user ID
			})
			.andThen(() => {
				// Send welcome email (simulated)
				const emailSent = true;
				return emailSent
					? new Ok("Welcome email sent")
					: new Fail("Failed to send welcome email");
			})
			.match({
				ok: (message) => ({
					success: true,
					message: `Registration successful: ${message}`,
				}),
				fail: (error) => ({
					success: false,
					message: `Registration failed: ${error}`,
				}),
			});
	}

	const registrationResult = processUserRegistration(
		"valid@email.com",
		"StrongPass123!",
	);
	console.log("Registration process result:", registrationResult);
}
