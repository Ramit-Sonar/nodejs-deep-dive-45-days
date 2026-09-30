# 📘 Episode 05 — Middlewares & Error Handlers

## 🚀 What is Middleware?

A **middleware** is a function that runs between the **client request** and the **final response**.

### Basic Flow

```text
Client Request
      ↓
  Middleware
      ↓
Route Handler
      ↓
   Response
```

Middleware can:

* Modify `req` or `res`
* Perform authentication
* Log requests
* Validate data
* Execute common logic
* Stop a request
* Pass control to the next middleware

---

## 🔹 Basic Middleware

```js
const express = require("express");

const app = express();

app.use((req, res, next) => {
    console.log("Middleware executed");
    next();
});

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(5000);
```

### `next()`

`next()` passes the request to the **next middleware or route handler**.

```text
Request
  ↓
Middleware
  ↓ next()
Route Handler
  ↓
Response
```

If `next()` is not called and no response is sent, the request can remain hanging.

---

# 🔹 Middleware Types

### 1. Application-Level Middleware

Runs for requests that match its path.

```js
app.use((req, res, next) => {
    console.log("Application middleware");
    next();
});
```

---

### 2. Path-Specific Middleware

Runs only for a specific path.

```js
app.use("/user", (req, res, next) => {
    console.log("User middleware");
    next();
});

app.get("/user", (req, res) => {
    res.send("User data");
});
```

---

### 3. Multiple Middlewares

We can use multiple middleware functions.

```js
app.use((req, res, next) => {
    console.log("Middleware 1");
    next();
});

app.use((req, res, next) => {
    console.log("Middleware 2");
    next();
});

app.get("/", (req, res) => {
    res.send("Home Page");
});
```

### Execution Order

```text
Request
   ↓
Middleware 1
   ↓
Middleware 2
   ↓
Route Handler
   ↓
Response
```

**Middleware executes in the order it is registered.**

---

# 🔐 Authentication Middleware

Middleware is commonly used to protect routes.

```js
const auth = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send("Unauthorized");
    }

    next();
};

app.get("/profile", auth, (req, res) => {
    res.send("Profile data");
});
```

### Flow

```text
GET /profile
     ↓
   auth
     ↓
Token exists?
  ↙       ↘
No         Yes
↓           ↓
401       next()
            ↓
       Profile Route
```

---

# 📝 Logging Middleware

Middleware can be used to log incoming requests.

```js
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});
```

Example output:

```text
GET /
GET /user
POST /login
```

This is useful for **debugging and monitoring**.

---

# 📦 Built-in Middleware

Express provides some useful built-in middleware.

### `express.json()`

Used to parse incoming JSON request bodies.

```js
app.use(express.json());
```

Now JSON data sent from the client can be accessed through:

```js
req.body
```

Example:

```js
app.post("/user", (req, res) => {
    console.log(req.body);
    res.send("User received");
});
```

---

# ⚠️ Error Handling

Errors can happen because of:

* Invalid user input
* Database errors
* Authentication failures
* Server errors
* Unexpected exceptions

Instead of handling every error separately, Express provides **error-handling middleware**.

---

# 🚨 Error-Handling Middleware

Error middleware has **4 parameters**:

```js
(err, req, res, next)
```

Example:

```js
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).send("Something went wrong");
});
```

### Important

The error-handling middleware should normally be placed **after the routes and other middleware**.

```text
Request
   ↓
Middleware
   ↓
Routes
   ↓
Error occurs
   ↓
Error Handler
   ↓
Response
```

---

# 🔥 Passing Error Using `next()`

We can pass an error to the error handler using:

```js
next(error);
```

Example:

```js
app.get("/user", (req, res, next) => {
    try {
        throw new Error("Something went wrong");
    } catch (error) {
        next(error);
    }
});
```

Error handler:

```js
app.use((err, req, res, next) => {
    console.error(err.message);

    res.status(500).send("Internal Server Error");
});
```

### Flow

```text
Route
 ↓
Error occurs
 ↓
next(error)
 ↓
Error Handler
 ↓
Error Response
```

---

# 🧠 Important Difference

### Normal Middleware

```js
(req, res, next)
```

### Error Middleware

```js
(err, req, res, next)
```

The **four parameters** tell Express that this middleware is an error handler.

---

# 🛡️ Why Use Error Handlers?

Without centralized error handling:

```text
Route 1 → own error handling
Route 2 → own error handling
Route 3 → own error handling
Route 4 → own error handling
```

This can create duplicate code.

With centralized error handling:

```text
Route 1 ─┐
Route 2 ─┤
Route 3 ─┼──→ Central Error Handler
Route 4 ─┘
```

Benefits:

* Less duplicate code
* Consistent error responses
* Easier debugging
* Better API structure
* Better user experience

---

# 🏗️ Complete Example

```js
const express = require("express");

const app = express();

const PORT = 5000;

// Parse JSON
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// Authentication middleware
const auth = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send("Unauthorized");
    }

    next();
};

// Route
app.get("/profile", auth, (req, res) => {
    res.send("Profile data");
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).send("Something went wrong");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

---

# 🎯 Key Takeaways

* **Middleware** runs between the request and response.
* `next()` passes control to the next middleware.
* Middleware can be used for **authentication, logging, validation, etc.**
* `express.json()` parses JSON request bodies.
* Middleware execution depends on the **order in which it is registered**.
* Error-handling middleware uses **4 parameters**:

  ```js
  (err, req, res, next)
  ```
* Use `next(error)` to forward an error to the error handler.
* Centralized error handling keeps backend code **clean and maintainable**.
