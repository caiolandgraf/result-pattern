# 🚀 **Result Pattern - A Safe and Elegant Way to Handle Errors in TypeScript**

Managing errors in TypeScript can be tricky, but the **Result Pattern** provides a structured and predictable way to handle failures without relying on `try/catch` everywhere. Say goodbye to unpredictable exceptions and embrace cleaner, more maintainable code!

---

## 💻 **Installation**

Install the package with your favorite package manager:

```shellscript
# npm
npm install @eicode/result-pattern

# yarn
yarn add @eicode/result-pattern

# pnpm
pnpm add @eicode/result-pattern
```

---

## 🔍 **See It in Action**

Want to see how the **Result Pattern** works in a real-world scenario? Check out this **React + Next.js example** (pure code, no library required) in the [GitHub repository](https://github.com/caiolandgraf/result-pattern-react). 🚀

---

## 📌 **Why Use the Result Pattern?**

In TypeScript, tracking errors can be challenging because functions can throw errors unexpectedly. Unlike languages such as Java or C#, TypeScript lacks built-in error type declarations.

The **Result Pattern** solves this by ensuring that **all operations return a structured result**, making your code **safer and more predictable**:

✅ **Easier error tracking**
✅ **Cleaner, more readable code (no more scattered `try/catch`)**
✅ **Error grouping for better user experience**
✅ **No more deep nesting (`if/else`, `try/catch` within `try/catch`)**

---

## 🛠️ **How It Works**

The **Result Pattern** wraps a function's outcome in a **success (Ok)** or **failure (Fail)** result, ensuring that all returns follow a consistent structure.

```typescript
const success = new Ok("All good!"); // Result<string>
console.log(success.isOk); // true
console.log(success.value); // "All good!"

const error = new Fail("Something went wrong!");
console.log(error.isFail); // true
console.log(error.value); // "Something went wrong!"
```

Now, instead of worrying about unexpected exceptions, you can **handle errors in a structured way**. 🎯

---

## 🔥 **Better Error Tracking**

Let's compare traditional error handling with the **Result Pattern**.

### ❌ Traditional Approach (Unstructured Errors)

```typescript
function getUser(id: number): User {
  if (id <= 0) throw new Error("Invalid ID!");
  return { id, name: "Caio" };
}

try {
  const user = getUser(-1);
  console.log(user);
} catch (e) {
  console.error("Error:", e.message);
}
```

**Problems:**

- ❌ Errors are unpredictable without checking the implementation.
- ❌ Scattered `try/catch` makes error handling inconsistent.

---

### ✅ Using the Result Pattern (Predictable Errors)

```typescript
function getUser(id: number): Result<User, string> {
  if (id <= 0) return new Fail("Invalid ID!");
  return new Ok({ id, name: "Caio" });
}

const result = getUser(-1);

if (result.isFail) {
  console.error("Error:", result.value); // "Error: Invalid ID!"
} else {
  console.log(result.value);
}
```

✅ **No unexpected exceptions!** The function always returns a structured result.

---

## 📦 **Grouping Multiple Errors**

Need to collect multiple errors before returning a response? The **Result Pattern** makes it easy! 🔥

```typescript
const r1 = new Fail("Database error!");
const r2 = new Fail("User authentication failed!");
const r3 = new Ok(42);

const combined = ResultUtils.combine(r1, r2, r3);

console.log(combined.isFail); // true
console.log(combined.value);
// ["Database error!", "User authentication failed!"]
```

📢 **Better user experience**: instead of failing one step at a time, users see **all issues at once**.

---

## 🎮 **Powerful Pattern Matching**

The `match` method provides an elegant way to handle both success and failure cases with a clean syntax:

```typescript
const result = getUser(userId);

// Handle both cases with a single method call
const greeting = result.match({
  ok: (user) => `Hello, ${user.name}!`,
  fail: (error) => `Error: ${error}`,
});

console.log(greeting);
// Either "Hello, Caio!" or "Error: Invalid ID!"
```

This eliminates the need for conditional statements and makes your code more expressive.

---

## 🔄 **Flexible Value Access**

The library provides multiple ways to access values:

```typescript
// Extract value safely
const value = result.unwrapOr("Default value");

// Extract with custom fallback function
const computed = result.unwrapOrElse(() => calculateDefault());

// Get value with custom error
const critical = result.expect("Critical operation failed!");

// Get either the value or the error
const valueOrError = result.valueOrError();
```

---

## ✨ **Eliminate Deep Nesting**

### ❌ Without Result Pattern (Nesting Nightmare)

```typescript
try {
  const user = await getUser();
  try {
    const orders = await getOrders(user.id);
    try {
      const invoice = await generateInvoice(orders);
      console.log(invoice);
    } catch (e) {
      console.error("Error generating invoice:", e.message);
    }
  } catch (e) {
    console.error("Error fetching orders:", e.message);
  }
} catch (e) {
  console.error("Error fetching user:", e.message);
}
```

🛑 **This is impossible to maintain!**

---

### ✅ With Result Pattern: Simple, Clean, and Readable

```typescript
const user = await Result.trySync(() => getUser());
if (user.isFail) return console.error(user.valueOrError());

const orders = await Result.trySync(() => getOrders(user.value.id));
if (orders.isFail) return console.error(orders.valueOrError());

const invoice = await Result.trySync(() => generateInvoice(orders.value));
if (invoice.isFail) return console.error(invoice.valueOrError());

console.log(invoice.value);
```

✨ **No unnecessary nesting, much easier to understand!**

---

## 🔄 **Complete API**

The Result Pattern provides a comprehensive API for working with results:

```typescript
// Creating results
const ok = new Ok(42);
const fail = new Fail("Error message");

// Transforming values
const doubled = ok.map((x) => x * 2); // Ok(84)
const uppercased = fail.mapFails((e) => e.toUpperCase()); // Fail("ERROR MESSAGE")

// Chaining operations
const validated = ok.flatMap((x) => (x > 0 ? new Ok(x) : new Fail("Negative")));

// Extracting values
const value = ok.unwrap(); // 42 (throws if Fail)
const safeValue = fail.unwrapOr("default"); // "default"
const computed = fail.unwrapOrElse(() => calculateDefault());

// Combining results
const combined = ok.and(anotherResult); // Returns anotherResult
const alternative = fail.or(backupResult); // Returns backupResult

// Pattern matching
const result = anyResult.match({
  ok: (v) => `Success: ${v}`,
  fail: (e) => `Error: ${e}`,
});

// Flipping Ok/Fail states
const flipped = ok.flip(); // Converts Ok to Fail and vice versa

// Getting values or errors
const result = anyResult.valueOrError(); // Returns value if Ok, error if Fail
```

---

## 🎯 **Conclusion**

The **Result Pattern** **should be standard practice** in TypeScript projects because:

✅ **Simplifies error tracking**
✅ **Eliminates unnecessary nesting**
✅ **Allows structured error grouping**
✅ **Makes code predictable and robust**
✅ **Provides flexible error handling with `valueOrError()` and pattern matching**

If you value **clean, scalable, and maintainable code**, **the Result Pattern is the way to go!** 🚀

---

## 👥 **Contributors**

Special thanks to all contributors who make this project better every day! 🌟

- [@cristoferms](https://github.com/cristoferms)
- [@JuniorBecari10](https://github.com/JuniorBecari10)
- [@oShatra](https://github.com/oShatra)

## 🌟 **Created by**

Developed with passion by [@caiolandgraf](https://github.com/caiolandgraf), making error handling **simple, structured, and efficient**. 💡
