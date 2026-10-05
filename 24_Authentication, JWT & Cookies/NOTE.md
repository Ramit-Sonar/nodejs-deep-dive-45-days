# 📘 Episode 10 — Authentication, JWT & Cookies

## 🔐 What is Authentication?

**Authentication** means verifying **who the user is**.

For example, when a user logs in:

```text
Email + Password
       ↓
   Verify User
       ↓
Authentication Successful
       ↓
Create Session / Token
       ↓
Access Protected Routes
```

### Authentication vs Authorization

| Authentication            | Authorization             |
| ------------------------- | ------------------------- |
| Who are you?              | What can you access?      |
| Verifies identity         | Checks permissions        |
| Login                     | Access control            |
| Example: email + password | Example: Admin-only route |

---

# 🎟️ What is JWT?

**JWT (JSON Web Token)** is a compact token used to securely represent information between a client and server.

JWT is commonly used for **authentication and authorization**.

Example:

```text
User Login
    ↓
Backend verifies credentials
    ↓
Generate JWT
    ↓
Send JWT to Client
    ↓
Client sends JWT with future requests
    ↓
Backend verifies JWT
    ↓
Allow / Reject Request
```

---

# 🧩 Structure of a JWT

A JWT has three parts:

```text
Header.Payload.Signature
```

Example:

```text
xxxxx.yyyyy.zzzzz
```

### 1. Header

Contains information about the token, such as the signing algorithm.

### 2. Payload

Contains claims/information about the user.

Example:

```js
{
    userId: "123",
    role: "student"
}
```

### 3. Signature

Used to verify that the token was created by a trusted server and has not been modified.

```text
Header
   +
Payload
   +
Secret
   ↓
Signature
```

> The JWT payload is **encoded, not encrypted**. Do not store passwords or other sensitive secrets inside it.

---

# 📦 Installing jsonwebtoken

Install the package:

```bash
npm install jsonwebtoken
```

Import it:

```js
const jwt = require("jsonwebtoken");
```

For ES Modules:

```js
import jwt from "jsonwebtoken";
```

---

# 🔑 Creating a JWT

After successful login:

```js
const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
);
```

### `jwt.sign()`

```js
jwt.sign(payload, secret, options);
```

| Part        | Meaning                       |
| ----------- | ----------------------------- |
| `payload`   | Data/claims stored in token   |
| `secret`    | Secret used to sign the token |
| `expiresIn` | Token expiration time         |

---

# 🔐 JWT Secret

Never hard-code the secret in your source code.

### ❌ Bad

```js
const token = jwt.sign(
    { userId: user._id },
    "mysecret123"
);
```

### ✅ Better

`.env`

```env
JWT_SECRET=your-strong-secret
```

Then:

```js
jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET
);
```

The `.env` file should not be committed to GitHub.

---

# 🍪 What are Cookies?

A **cookie** is a small piece of data stored by the browser and associated with a website.

Cookies can be used to store authentication tokens.

Example:

```text
Browser
   ↓
Cookie
   ↓
JWT Token
```

The browser can automatically send the cookie with requests to the appropriate server.

---

# 📦 Using Cookies in Express

Install `cookie-parser`:

```bash
npm install cookie-parser
```

Use it:

```js
const cookieParser = require("cookie-parser");

app.use(cookieParser());
```

For ES Modules:

```js
import cookieParser from "cookie-parser";

app.use(cookieParser());
```

---

# 🍪 Setting a Cookie

After successful login:

```js
res.cookie("token", token);
```

Complete example:

```js
app.post("/login", async (req, res) => {
    // Verify email and password...

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token);

    res.send("Login successful");
});
```

---

# 🔒 Secure Cookie Options

For production applications, authentication cookies should be configured carefully.

```js
res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
});
```

### `httpOnly`

```js
httpOnly: true
```

Prevents JavaScript running in the browser from directly reading the cookie.

This helps reduce the impact of token theft through certain XSS attacks.

### `secure`

```js
secure: true
```

Cookie is sent only over HTTPS.

During local HTTP development, you may need:

```js
secure: false
```

### `sameSite`

Controls when cookies are sent in cross-site requests.

Example:

```js
sameSite: "strict"
```

provides stronger cross-site request protection, although the appropriate setting depends on your frontend/backend architecture.

---

# 📥 Reading Cookies

With `cookie-parser`:

```js
const cookies = req.cookies;

const { token } = cookies;
```

Or directly:

```js
const token = req.cookies.token;
```

If the cookie does not exist:

```js
if (!token) {
    return res.status(401).send("Authentication required");
}
```

---

# ✅ Verifying JWT

We use:

```js
jwt.verify()
```

Example:

```js
const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
);
```

If the token is valid:

```js
decoded
```

contains the payload.

Example:

```js
{
    userId: "123",
    iat: 1234567890,
    exp: 1234654290
}
```

---

# 🛡️ Authentication Middleware

Instead of checking the token in every route, create middleware.

```js
const userAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).send("Authentication required");
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).send("Invalid or expired token");
    }
};
```

Now protect a route:

```js
app.get("/profile", userAuth, (req, res) => {
    res.send("Profile page");
});
```

---

# 🔄 Authentication Flow

```text
                 SIGNUP
                    ↓
             Create Account
                    ↓
             Hash Password
                    ↓
               MongoDB
```

```text
                  LOGIN
                    ↓
            Email + Password
                    ↓
            Find User
                    ↓
         bcrypt.compare()
                    ↓
               Valid?
              ↙       ↘
            No         Yes
            ↓           ↓
          Reject    Create JWT
                        ↓
                 Set Cookie
                        ↓
                     Client
```

For a protected request:

```text
Client Request
      ↓
Cookie automatically sent
      ↓
Authentication Middleware
      ↓
Read JWT
      ↓
jwt.verify()
      ↓
Valid?
   ↙      ↘
 No        Yes
 ↓          ↓
401       next()
            ↓
      Protected Route
```

---

# 🧠 Why Use Middleware?

Without middleware:

```js
app.get("/profile", ...);
app.get("/messages", ...);
app.get("/orders", ...);
app.get("/settings", ...);
```

We would repeatedly write authentication logic.

Instead:

```js
app.get("/profile", userAuth, ...);
app.get("/messages", userAuth, ...);
app.get("/orders", userAuth, ...);
app.get("/settings", userAuth, ...);
```

This keeps authentication logic centralized and reusable.

---

# 🚪 Logout

Logout can be implemented by clearing the authentication cookie.

```js
app.post("/logout", (req, res) => {
    res.clearCookie("token");

    res.send("Logged out successfully");
});
```

The browser removes the cookie, so future requests no longer contain that token.

---

# ⏳ Token Expiration

JWTs should generally have an expiration time.

```js
const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
);
```

After expiration:

```text
JWT
 ↓
Expired
 ↓
jwt.verify()
 ↓
Error
 ↓
401 Unauthorized
```

---

# ⚠️ Common JWT Errors

### Missing Token

```js
if (!token) {
    return res.status(401).send("Authentication required");
}
```

### Invalid Token

```js
jwt.verify(token, process.env.JWT_SECRET);
```

may throw an error if the token is invalid.

### Expired Token

An expired JWT also causes verification to fail.

Always handle verification inside appropriate error handling.

---

# 🔐 Authentication vs JWT

JWT is **a mechanism/token format used to implement authentication**.

They are not the same thing.

```text
Authentication
     ↓
Identity verification
     ↓
JWT can be used
     ↓
Token represents authenticated session
```

Other authentication mechanisms also exist, such as server-side sessions.

---

# 🆚 Cookies vs JWT

Cookies and JWT solve different problems.

### JWT

A **token format** containing signed claims.

### Cookie

A **browser storage/transport mechanism** that can carry data such as a JWT.

Therefore:

```text
JWT = Token
Cookie = Where/how browser stores and sends it
```

A JWT can be stored somewhere other than a cookie, and cookies can store data other than JWTs.

---

# 🔒 Recommended Authentication Pattern

For a browser-based web application:

```text
Login
  ↓
Verify Password
  ↓
Generate JWT
  ↓
Store JWT in HttpOnly Cookie
  ↓
Browser sends Cookie
  ↓
Auth Middleware
  ↓
Verify JWT
  ↓
Access Protected Route
```

Avoid storing sensitive authentication tokens in places accessible to JavaScript unless you have a specific reason and understand the security trade-offs.

---

# 🏗️ Complete Example

```js
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());
app.use(cookieParser());

const userAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).send("Authentication required");
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).send("Invalid or expired token");
    }
};

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // Find user from database
        const user = await User.findOne({ emailId });

        if (!user) {
            return res.status(401).send("Invalid credentials");
        }

        // Compare password with stored hash
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).send("Invalid credentials");
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Store JWT in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.send("Login successful");
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

app.get("/profile", userAuth, async (req, res) => {
    const user = await User.findById(req.user.userId);

    res.json(user);
});

app.post("/logout", (req, res) => {
    res.clearCookie("token");

    res.send("Logout successful");
});
```

---

# 🎯 Key Takeaways

* **Authentication** verifies the identity of a user.
* **JWT** is a signed token commonly used for authentication.
* `jwt.sign()` creates a JWT.
* `jwt.verify()` validates a JWT.
* **Cookies** can store and automatically send authentication tokens.
* `httpOnly` prevents JavaScript from directly accessing the cookie.
* `secure` ensures the cookie is sent over HTTPS.
* `sameSite` helps control cross-site cookie sending.
* Authentication logic is best placed in reusable middleware.
* Always handle missing, invalid, and expired tokens.
* JWT payloads are **encoded, not encrypted**.
* Never store passwords inside JWT payloads.
* Keep JWT secrets in environment variables.
* Use short-lived access tokens and an appropriate refresh-token strategy when long-lived sessions are required.

## 🔑 Remember

```text
Authentication → Who are you?

JWT            → Signed token

Cookie         → Browser storage/transport

jwt.sign()     → Create JWT

jwt.verify()   → Verify JWT

bcrypt.compare()
               → Verify password

Middleware     → Protect routes
```

### Complete Flow

```text
Login
 ↓
Find User
 ↓
bcrypt.compare()
 ↓
Generate JWT
 ↓
Set HttpOnly Cookie
 ↓
Client Requests Protected Route
 ↓
Auth Middleware
 ↓
Read Cookie
 ↓
jwt.verify()
 ↓
Allow / Reject
```
