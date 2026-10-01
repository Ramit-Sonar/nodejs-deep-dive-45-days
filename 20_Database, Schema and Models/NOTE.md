# 📘 Episode 06 — Database, Schema & Models | Mongoose

## 🚀 What is Mongoose?

**Mongoose** is an ODM (**Object Data Modeling**) library for Node.js and MongoDB.

It helps us:

* Connect Node.js applications with MongoDB
* Define the structure of data
* Validate data
* Create models
* Perform database operations easily

```text
Node.js / Express
       ↓
    Mongoose
       ↓
    MongoDB
```

---

# 🗄️ MongoDB

MongoDB is a **NoSQL document database**.

Instead of storing data in rows and columns like SQL databases, MongoDB stores data as **documents** inside **collections**.

### SQL vs MongoDB

```text
SQL                  MongoDB
────────────────────────────────
Database          →  Database
Table             →  Collection
Row               →  Document
Column            →  Field
```

Example MongoDB document:

```js
{
    firstName: "Ramit",
    lastName: "Sonar",
    age: 20
}
```

---

# 🔗 Connecting MongoDB with Mongoose

Install Mongoose:

```bash
npm install mongoose
```

Import it:

```js
const mongoose = require("mongoose");
```

Connect to MongoDB:

```js
mongoose.connect("mongodb://localhost:27017/devTinder");
```

For MongoDB Atlas:

```js
mongoose.connect(process.env.MONGODB_URI);
```

Using an environment variable is better because the database URL should not be exposed directly in the source code.

---

# 🧱 What is a Schema?

A **Schema** defines the structure and rules of documents in a MongoDB collection.

Example:

```js
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    age: {
        type: Number
    }
});
```

The schema tells Mongoose:

```text
firstName → String → Required
lastName  → String → Required
age       → Number
```

---

# 🏗️ What is a Model?

A **Model** is created from a schema.

It provides an interface to interact with the MongoDB collection.

```js
const User = mongoose.model("User", userSchema);
```

Now `User` can be used to perform database operations.

```text
Schema
  ↓
Model
  ↓
MongoDB Collection
```

---

# 🔥 Schema vs Model

| Schema                          | Model                            |
| ------------------------------- | -------------------------------- |
| Defines data structure          | Interacts with database          |
| Defines fields and rules        | Performs CRUD operations         |
| Blueprint of documents          | Interface for collection         |
| Created using `mongoose.Schema` | Created using `mongoose.model()` |

### Simple Analogy

```text
Schema = Blueprint of a house
Model  = Builder that works with the blueprint
MongoDB = Place where the houses are stored
```

---

# 📝 Schema Validation

Mongoose allows us to define validation rules.

### Required

```js
firstName: {
    type: String,
    required: true
}
```

The field must be provided.

### Minimum Length

```js
firstName: {
    type: String,
    minLength: 4
}
```

### Maximum Length

```js
firstName: {
    type: String,
    maxLength: 50
}
```

### Default Value

```js
isActive: {
    type: Boolean,
    default: true
}
```

### Unique

```js
emailId: {
    type: String,
    unique: true
}
```

`unique: true` creates a unique index so duplicate values are not allowed by the database index.

---

# 📦 Creating a User

After creating the model:

```js
const User = mongoose.model("User", userSchema);
```

We can create a document:

```js
const user = new User({
    firstName: "Ramit",
    lastName: "Sonar",
    age: 20
});
```

Save it:

```js
await user.save();
```

### Flow

```text
JavaScript Object
       ↓
     Model
       ↓
    Mongoose
       ↓
    MongoDB
       ↓
   Document
```

---

# 🔍 Finding Data

Find all users:

```js
const users = await User.find();
```

Find one user:

```js
const user = await User.findOne({
    emailId: "ramit@gmail.com"
});
```

Find by ID:

```js
const user = await User.findById(userId);
```

---

# ✏️ Updating Data

Example:

```js
await User.findByIdAndUpdate(
    userId,
    {
        firstName: "Ramit"
    }
);
```

Mongoose sends the update operation to MongoDB.

---

# 🗑️ Deleting Data

Delete one user:

```js
await User.findByIdAndDelete(userId);
```

Or:

```js
await User.deleteOne({
    emailId: "ramit@gmail.com"
});
```

---

# 🔄 CRUD Operations

CRUD means:

```text
C → Create
R → Read
U → Update
D → Delete
```

### Mongoose Examples

```js
// Create
await User.create({
    firstName: "Ramit",
    lastName: "Sonar"
});

// Read
await User.find();

// Update
await User.findByIdAndUpdate(userId, {
    firstName: "Ramit"
});

// Delete
await User.findByIdAndDelete(userId);
```

---

# 📁 Typical Model Structure

A backend project can organize models separately.

```text
src/
├── models/
│   └── user.js
├── routes/
├── controllers/
├── app.js
└── index.js
```

Example `user.js`:

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },

    lastName: {
        type: String,
        required: true
    },

    emailId: {
        type: String,
        required: true,
        unique: true
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
```

---

# 🧠 Important Concepts

### Collection Naming

When we create:

```js
mongoose.model("User", userSchema);
```

Mongoose generally maps the model name to a pluralized collection name.

```text
User → users
```

So MongoDB will typically contain:

```text
devTinder
   └── users
```

---

# ⚡ Why Use Mongoose?

Without Mongoose, we would interact with MongoDB more directly.

Mongoose gives us:

* Schema structure
* Data validation
* Models
* Middleware/hooks
* Query methods
* Easier database interaction
* Cleaner project structure

---

# 🎯 Key Takeaways

* **MongoDB** is a NoSQL document database.
* **Mongoose** is an ODM for MongoDB and Node.js.
* **Schema** defines the structure and validation rules of documents.
* **Model** is created from a schema and is used to interact with a collection.
* MongoDB stores data as **documents** inside **collections**.
* Mongoose supports CRUD operations.
* Schema validation helps maintain consistent data.
* Keep database credentials inside `.env`.
* A common flow is:

```text
Request
   ↓
Express Route
   ↓
Controller
   ↓
Mongoose Model
   ↓
MongoDB
   ↓
Response
```

## 🔑 Remember

```text
Schema  → Structure
Model   → Database Interaction
MongoDB → Stores Documents
```
