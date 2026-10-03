# 📘 Episode 08 — Data Sanitization & Schema Validations

## 🚀 What is Data Validation?

**Validation** means checking whether the incoming data follows the rules we expect before processing or storing it.

Example:

```text
User Input
    ↓
Validation
    ↓
Valid? ─── No ──→ Reject Request
    ↓ Yes
Process Data
    ↓
Database
```

Example:

```js
{
    email: "ramit@gmail.com",
    age: 20
}
```

We can validate:

* Is email provided?
* Is email in the correct format?
* Is age a number?
* Is age within the allowed range?
* Are required fields present?

---

# 🧹 What is Data Sanitization?

**Data sanitization** means cleaning or transforming input data before using it.

Example:

```text
"   Ramit   "
       ↓
"Ramit"
```

Sanitization can help:

* Remove unnecessary spaces
* Normalize input
* Prevent dangerous input from being processed incorrectly
* Keep stored data consistent

### Validation vs Sanitization

| Validation                   | Sanitization            |
| ---------------------------- | ----------------------- |
| Checks whether data is valid | Cleans/transforms data  |
| Accepts or rejects input     | Modifies input          |
| Example: email format        | Example: trim spaces    |
| `"abc"` → invalid email      | `" Ramit "` → `"Ramit"` |

---

# 🔐 Why Validate User Input?

Never blindly trust data coming from the client.

```text
Frontend
   ↓
User Input
   ↓
Backend Validation
   ↓
Sanitization
   ↓
Database
```

Even if validation exists on the frontend, **backend validation is still required** because users can send requests directly to the API.

---

# 🛡️ Common Security Problems

Poor input handling can contribute to vulnerabilities such as:

* Injection attacks
* XSS (Cross-Site Scripting)
* Invalid or corrupted data
* Unexpected application behavior

---

# 💉 Injection Attacks

Injection occurs when untrusted input is interpreted as part of a command or query.

For example, SQL injection can occur when an application directly builds SQL queries using user input.

### Unsafe Concept

```text
User Input
    ↓
Directly added to query
    ↓
Database interprets input
```

### Better Approach

```text
User Input
    ↓
Validate + Sanitize
    ↓
Safe database operation
```

> MongoDB applications can also have injection-related risks, so user input should never be blindly trusted.

---

# 🖥️ XSS — Cross-Site Scripting

**XSS** occurs when an attacker manages to inject malicious script content into a web application and that content is later executed in another user's browser.

Example of dangerous input:

```html
<script>
    alert("Hacked");
</script>
```

Applications should properly validate, sanitize, encode, and handle untrusted content according to where it will be used.

---

# 🧱 Mongoose Schema Validation

Mongoose allows us to define validation rules directly in the schema.

Example:

```js
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },

    emailId: {
        type: String,
        required: true,
        unique: true
    },

    age: {
        type: Number,
        min: 18,
        max: 100
    }
});
```

Here Mongoose validates the data before saving it.

---

# 🔹 `required`

Makes a field mandatory.

```js
firstName: {
    type: String,
    required: true
}
```

Without `firstName`, validation fails.

---

# 🔹 `minLength`

Defines the minimum number of characters.

```js
firstName: {
    type: String,
    minLength: 4
}
```

Example:

```text
"Ram"   → ❌
"Ramit" → ✅
```

---

# 🔹 `maxLength`

Defines the maximum number of characters.

```js
firstName: {
    type: String,
    maxLength: 50
}
```

---

# 🔹 Number Validation

```js
age: {
    type: Number,
    min: 18,
    max: 100
}
```

Example:

```text
17 → ❌
20 → ✅
101 → ❌
```

---

# 🔹 `enum`

Restricts a field to specific values.

```js
gender: {
    type: String,
    enum: ["male", "female", "other"]
}
```

Only these values are accepted.

---

# 🔹 `match`

Can be used to validate a string against a regular expression.

Example:

```js
emailId: {
    type: String,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}
```

This provides basic email-format validation.

---

# 🔹 `trim`

Removes whitespace from the beginning and end of a string.

```js
firstName: {
    type: String,
    trim: true
}
```

Input:

```text
"   Ramit   "
```

Stored value:

```text
"Ramit"
```

---

# 🔹 `lowercase`

Converts a string to lowercase.

```js
emailId: {
    type: String,
    lowercase: true
}
```

Input:

```text
Ramit@GMAIL.COM
```

Becomes:

```text
ramit@gmail.com
```

---

# 🔥 Complete Schema Example

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    age: {
        type: Number,
        min: 18,
        max: 100
    },

    gender: {
        type: String,
        enum: ["male", "female", "other"]
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
```

---

# 🌐 API Input Validation

Database validation is important, but APIs should also validate incoming requests **before performing business logic**.

Example:

```js
app.post("/user", (req, res) => {
    const { firstName, emailId } = req.body;

    if (!firstName || !emailId) {
        return res.status(400).json({
            message: "Required fields are missing"
        });
    }

    res.status(201).json({
        message: "User data is valid"
    });
});
```

### Flow

```text
Client Request
      ↓
Read req.body
      ↓
Validate Input
      ↓
Invalid ──→ 400 Response
      ↓ Valid
Business Logic
      ↓
Database Validation
      ↓
MongoDB
```

---

# 🧩 Two Layers of Validation

A good backend can validate data at multiple layers.

```text
             API Request
                  ↓
        ┌──────────────────┐
        │ API Validation   │
        └──────────────────┘
                  ↓
        ┌──────────────────┐
        │ Business Logic   │
        └──────────────────┘
                  ↓
        ┌──────────────────┐
        │ Mongoose Schema  │
        │   Validation     │
        └──────────────────┘
                  ↓
              MongoDB
```

### API Validation

Checks whether the request is acceptable before processing.

### Schema Validation

Provides a database/model-level safety layer and keeps stored data consistent.

---

# ⚠️ Never Trust Frontend Validation Alone

Frontend validation:

```text
User
 ↓
Frontend Validation
 ↓
Backend
```

is useful for user experience, but it is **not a security boundary**.

A user can bypass the frontend and directly call:

```text
POST /api/users
```

Therefore:

```text
Frontend Validation → UX
Backend Validation  → Security + Data Integrity
```

---

# 🧼 Sanitization Example

Simple manual sanitization:

```js
const name = req.body.firstName?.trim();
```

Now:

```text
"   Ramit   "
```

becomes:

```text
"Ramit"
```

You can also use schema options such as:

```js
trim: true
```

to consistently clean string values.

---

# 🚨 Handling Validation Errors

Mongoose can throw a validation error when invalid data is saved.

Example:

```js
try {
    const user = await User.create(req.body);

    res.status(201).json(user);
} catch (error) {
    res.status(400).json({
        message: error.message
    });
}
```

For a production application, error handling should usually return a clean, controlled message rather than exposing unnecessary internal details.

---

# 🧠 Validation vs Sanitization vs Authentication

These concepts are different:

```text
Validation
→ Is the data acceptable?

Sanitization
→ Can we clean/normalize the data?

Authentication
→ Who is the user?
```

Example:

```text
POST /user
     ↓
Validate input
     ↓
Sanitize input
     ↓
Authenticate if required
     ↓
Business Logic
     ↓
Database
```

---

# 🎯 Key Takeaways

* Never trust user input.
* **Validation** checks whether data follows expected rules.
* **Sanitization** cleans or transforms input.
* Backend validation is essential even when frontend validation exists.
* Mongoose provides schema validation.
* Common Mongoose validation options:

  * `required`
  * `minLength`
  * `maxLength`
  * `min`
  * `max`
  * `enum`
  * `match`
  * `trim`
  * `lowercase`
* API input should be validated before business logic.
* Proper input handling helps reduce security risks such as injection and XSS.
* Validation and sanitization help maintain **secure, consistent, and reliable data**.

## 🔑 Remember

```text
Validation  → Check
Sanitization → Clean
Authentication → Identify
Authorization → Allow / Deny
```

```text
Client
  ↓
Validate
  ↓
Sanitize
  ↓
Business Logic
  ↓
Schema Validation
  ↓
Database
```
