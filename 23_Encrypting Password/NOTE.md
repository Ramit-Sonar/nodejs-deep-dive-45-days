# 📘 Episode 09 — Encrypting Passwords

## 🔐 Why Should We Protect Passwords?

Passwords are sensitive information and should **never be stored as plain text** in the database.

### ❌ Unsafe

```text
Database

email: ramit@gmail.com
password: Ramit@123
```

If the database is compromised, the actual passwords are exposed.

### ✅ Safe

```text
Database

email: ramit@gmail.com
password: $2b$10$....
```

The database stores a **password hash**, not the original password.

---

# 🔑 Hashing vs Encryption

Password protection usually uses **hashing**, not encryption.

### Encryption

* Data can be encrypted and later decrypted.
* Uses an encryption key.
* Example: encrypted files/messages.

```text
Plain Text
    ↓
Encryption + Key
    ↓
Encrypted Data
    ↓
Decryption + Key
    ↓
Plain Text
```

### Hashing

* One-way transformation.
* Normally cannot be reversed to get the original password.
* Used for password storage.

```text
Password
    ↓
Hashing Algorithm
    ↓
Password Hash
```

### Important

> We **hash passwords**, rather than encrypting them for database storage.

---

# 🧂 What is a Salt?

A **salt** is a random value added to a password before hashing.

It helps ensure that the same password does not always produce the same hash.

For example:

```text
Password: Ramit@123

Password + Random Salt
        ↓
      Hash
        ↓
   Stored Hash
```

Modern password-hashing libraries such as **bcrypt** handle salt generation and inclusion in the stored hash.

---

# 🛠️ bcrypt

`bcrypt` is a password-hashing library commonly used in Node.js applications.

Install it:

```bash
npm install bcrypt
```

Import it:

```js
const bcrypt = require("bcrypt");
```

---

# 🔒 Hashing Password During Signup

When a user signs up, **do not store the original password**.

### ❌ Wrong

```js
const user = new User({
    emailId: req.body.emailId,
    password: req.body.password
});

await user.save();
```

This stores the plain password.

### ✅ Correct

```js
const hashedPassword = await bcrypt.hash(req.body.password, 10);

const user = new User({
    emailId: req.body.emailId,
    password: hashedPassword
});

await user.save();
```

Now the database stores the hash.

---

# 🔢 What Does `10` Mean?

```js
bcrypt.hash(password, 10);
```

The `10` is the **cost factor / salt rounds** used by bcrypt.

A higher cost generally means more computational work and therefore slower hashing.

Example:

```js
await bcrypt.hash(password, 10);
```

For a real application, choose the cost according to current security guidance and your server's performance.

---

# 🔍 Password Verification During Login

When the user logs in, we receive:

```text
Email
Password
```

The entered password is **not hashed manually and compared as plain strings**.

Instead, bcrypt compares the entered password with the stored hash.

```js
const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
);
```

### Flow

```text
Login Password
      ↓
bcrypt.compare()
      ↓
Stored Password Hash
      ↓
Match?
   ↙      ↘
 Yes       No
  ↓         ↓
Login     Reject
```

---

# 📝 Complete Signup Example

```js
const bcrypt = require("bcrypt");

app.post("/signup", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            emailId,
            password: hashedPassword
        });

        await user.save();

        res.status(201).send("User created successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
});
```

---

# 🔑 Complete Login Example

```js
app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).send("Invalid password");
        }

        res.send("Login successful");
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});
```

---

# 🔄 Signup vs Login

### Signup

```text
Plain Password
      ↓
bcrypt.hash()
      ↓
Hash
      ↓
MongoDB
```

### Login

```text
Plain Password
      ↓
bcrypt.compare()
      ↓
Stored Hash
      ↓
Match?
```

---

# ❌ Don't Hash Again During Login

A common mistake is:

```js
const hashedPassword = await bcrypt.hash(password, 10);
```

and then:

```js
hashedPassword === user.password
```

This is **not the correct way** to verify a bcrypt password.

Why?

Because bcrypt uses a salt, so hashing the same password again can produce a different hash.

Use:

```js
bcrypt.compare(plainPassword, storedHash);
```

---

# 🧂 Why the Same Password Can Have Different Hashes

Suppose two users use:

```text
Ramit@123
```

Their hashes can still be different because bcrypt uses different salts.

```text
Ramit@123
   ↓
bcrypt
   ↓
Hash A

Ramit@123
   ↓
bcrypt
   ↓
Hash B
```

This is expected and provides protection against precomputed password attacks.

---

# 🛡️ Never Return Password Hashes

Even though the password is hashed, you generally should **not send the hash back to the client**.

### ❌ Avoid

```js
res.json(user);
```

if `user` contains the password hash and your response is intended to expose user data.

### ✅ Better

```js
res.json({
    firstName: user.firstName,
    lastName: user.lastName,
    emailId: user.emailId
});
```

You can also configure your schema so the password is excluded by default:

```js
password: {
    type: String,
    required: true,
    select: false
}
```

Then explicitly select it when authentication needs it:

```js
const user = await User.findOne({ emailId }).select("+password");
```

---

# 🚨 Important Security Rules

### 1. Never store plain passwords

```text
❌ password: "Ramit@123"
```

Store:

```text
✅ password: "$2b$10$..."
```

### 2. Never log passwords

Avoid:

```js
console.log(req.body.password);
```

### 3. Never send passwords in API responses

Do not return the password or password hash to the frontend.

### 4. Use HTTPS in production

Passwords should be transmitted over an encrypted connection.

```text
Frontend
   ↓ HTTPS
Backend
```

### 5. Use a strong password policy

Validate password requirements such as minimum length before hashing.

---

# 🧠 Hashing Flow

```text
             SIGNUP
                ↓
        User enters password
                ↓
          Validate input
                ↓
         bcrypt.hash()
                ↓
          Password Hash
                ↓
             MongoDB
```

```text
              LOGIN
                ↓
        User enters password
                ↓
       Find user by email
                ↓
       bcrypt.compare()
                ↓
        Password matches?
           ↙          ↘
         Yes           No
          ↓             ↓
       Login         Reject
```

---

# 🎯 Key Takeaways

* Never store passwords as plain text.
* Passwords should generally be **hashed**, not encrypted.
* `bcrypt` is commonly used for password hashing in Node.js.
* `bcrypt.hash()` is used when creating/updating a password.
* `bcrypt.compare()` is used during login.
* The salt makes identical passwords produce different hashes.
* Never hash the login password again and compare hashes manually.
* Never return or log password hashes unnecessarily.
* Password hashing protects stored credentials, but secure transport such as **HTTPS** is also required.

## 🔑 Remember

```text
Signup:
Password → bcrypt.hash() → Hash → Database

Login:
Password + Stored Hash → bcrypt.compare() → true / false
```

### Most Important Code

```js
// Signup
const hashedPassword = await bcrypt.hash(password, 10);

// Login
const isValid = await bcrypt.compare(password, hashedPassword);
```
