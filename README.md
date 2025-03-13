# 🚀 **Result Pattern - A safe and elegant pattern for handling errors in TypeScript**

## 💻 **Ready to See It in Action?**

If you'd like to see a practical example of the Result Pattern implemented in a React with Next.js project (pure code without using this library), check out the [GitHub repository](https://github.com/caiolandgraf/result-pattern-react). This example showcases how this pattern can streamline error handling in real-world applications!

## 📌 **Why use the Result Pattern?**

When writing code in TypeScript, error handling can be problematic. Unlike languages like Java and C#, TypeScript **doesn't provide a way to know which errors a function might throw**, making tracking and debugging more difficult.

The **Result Pattern** solves this problem by providing a **structured pattern for returns**, ensuring that all operations have a predictable result:

✅ **Easy error tracking**  
✅ **Cleaner, more organized code (without `try/catch` everywhere)**  
✅ **Multiple error grouping, improving user experience**  
✅ **Elimination of excessive nesting (`if/else`, `try/catch` inside `try/catch`)**

---

## 🛠️ **How does it work?**

The **Result Pattern** encapsulates a **success value** or a **list of errors**, ensuring that code always has a consistent return.

```ts
const success = new Ok("All good!"); // Result<string>
console.log(success.isOk); // true
console.log(success.value); // "All good!"

const error = new Fail("An error occurred!");
console.log(error.isFail); // true
console.log(error.value); // "An error occurred!"
```

Now, instead of dealing with exceptions scattered throughout the code, we can **handle errors in a structured and predictable way**.

---

## 🔥 **Simplified error tracking**

Imagine we have a function that might fail when loading a user.

### ❌ Without Result Pattern (traditional method)

```ts
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

Problem: ❌ **We don't know which errors might be thrown without looking at the code**.

---

### ✅ With Result Pattern (structured approach)

```ts
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

✅ **Easy error tracking** – Any function that returns `Result<T, E>` **doesn't throw exceptions**, making the error flow more predictable.

---

## 📦 **Multiple error grouping**

If you need to **collect several errors from different parts of the system** before returning a final error, the **Result Pattern** makes this super easy.

```ts
const r1 = new Fail("Database error!");
const r2 = new Fail("User authentication failure!");
const r3 = new Ok(42);

const combined = ResultUtils.combine([r1, r2, r3]);

console.log(combined.isFail); // true
console.log(combined.value);
// ["Database error!", "User authentication failure!"]
```

This improves the **user experience** because they receive **all errors at once**, instead of fixing one error only to discover later that more problems exist.

---

## ✨ **Cleaner code without unnecessary nesting**

Without **Result Pattern**, asynchronous code can turn into a **`try/catch` monster**:

```ts
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

🛑 **This is horrible for maintenance!**

---

### ✅ **With Result Pattern: Zero nesting, much more readable**

```ts
const user = await Result.trySync(() => getUser());
if (user.isFail) return console.error(user.value);

const orders = await Result.trySync(() => getOrders(user.value.id));
if (orders.isFail) return console.error(orders.value);

const invoice = await Result.trySync(() => generateInvoice(orders.value));
if (invoice.isFail) return console.error(invoice.value);

console.log(invoice.value);
```

✨ **Much cleaner, easier to understand, and without unnecessary nesting!**

---

## 🎯 **Conclusion**

The **Result Pattern** **should be mandatory** in TypeScript projects because:

✅ **Makes error tracking easier**  
✅ **Eliminates unnecessary nesting**  
✅ **Allows grouping errors and providing better feedback to the user**  
✅ **Avoids unexpected exceptions, making the code predictable and reliable**

If you want **cleaner, more scalable, and easier-to-debug code**, **the Result Pattern is the solution!** 🚀

---

## 👥 **Contributors**

Special thanks to all the brilliant minds who have contributed to this project. Your expertise and dedication make this project better every day! 🌟

- [@cristoferms](https://github.com/cristoferms)

## 🌟 **Created by**

Developed with dedication and expertise by [@caiolandgraf](https://github.com/caiolandgraf), transforming complex error handling into elegant, maintainable code.
