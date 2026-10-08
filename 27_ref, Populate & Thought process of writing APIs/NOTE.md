# Episode 13 — `ref`, `populate()` & Thought Process of Writing APIs

## 1. What Problem Does `ref` Solve?

In a real application, data is often related.

For example:

```text
User
 ├── name
 ├── email
 └── posts

Post
 ├── title
 ├── content
 └── author
```

A post belongs to a particular user.

Instead of storing the complete user document inside every post, we can store the user's `_id`.

This creates a relationship between the two MongoDB documents.

---

# 2. What Is `ref` in Mongoose?

`ref` tells Mongoose **which model a referenced ObjectId belongs to**.

### Example

```js
const postSchema = new mongoose.Schema({
    title: String,

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});
```

Here:

```js
type: mongoose.Schema.Types.ObjectId
```

means the field stores a MongoDB ObjectId.

And:

```js
ref: "User"
```

means:

> This ObjectId refers to a document from the `User` model.

### Important

`ref` itself does **not** automatically fetch the user.

It only tells Mongoose what model the ObjectId refers to.

---

# 3. Example User Model

```js
const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

const User = mongoose.model("User", userSchema);
```

Suppose MongoDB contains:

```json
{
    "_id": "64abc123",
    "name": "Ramit",
    "email": "ramit@example.com"
}
```

---

# 4. Example Post Model

```js
const postSchema = new mongoose.Schema({
    title: String,
    content: String,

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Post = mongoose.model("Post", postSchema);
```

A post document might look like:

```json
{
    "_id": "65xyz789",
    "title": "Learning Node.js",
    "content": "Node.js is a JavaScript runtime.",
    "author": "64abc123"
}
```

Notice that `author` contains only the **User's `_id`**.

---

# 5. Why Not Store the Complete User?

We could theoretically store:

```json
{
    "title": "Learning Node.js",
    "author": {
        "name": "Ramit",
        "email": "ramit@example.com"
    }
}
```

But this creates problems.

If the user's email changes, we would need to update that information in every post.

Instead:

```text
Post
  ↓
author: User ObjectId
  ↓
User document
```

We store the relationship rather than duplicating the complete data.

---

# 6. What Is `populate()`?

`populate()` is a Mongoose method used to replace a referenced ObjectId with the corresponding document.

Without `populate()`:

```js
const post = await Post.findOne();

console.log(post);
```

You may get:

```json
{
    "title": "Learning Node.js",
    "author": "64abc123"
}
```

With:

```js
const post = await Post
    .findOne()
    .populate("author");
```

Mongoose can return:

```json
{
    "title": "Learning Node.js",
    "author": {
        "_id": "64abc123",
        "name": "Ramit",
        "email": "ramit@example.com"
    }
}
```

So:

```text
ref
 ↓
Defines the relationship

populate()
 ↓
Fetches the referenced document
```

---

# 7. Basic `populate()` Syntax

```js
Model.find()
    .populate("fieldName");
```

Example:

```js
Post.find()
    .populate("author");
```

The `"author"` field must contain the `ref`.

---

# 8. Populate Specific Fields

We don't always need the complete referenced document.

For example:

```js
const posts = await Post.find()
    .populate("author", "name email");
```

Now only the required user fields are populated.

Example response:

```json
{
    "title": "Learning Node.js",
    "author": {
        "_id": "64abc123",
        "name": "Ramit",
        "email": "ramit@example.com"
    }
}
```

### Why select specific fields?

It can:

* reduce unnecessary data
* improve response size
* avoid exposing sensitive fields
* make APIs cleaner

For example, we usually should **not** populate a password hash.

---

# 9. Populate Multiple References

A document can have multiple references.

Example:

```js
const postSchema = new mongoose.Schema({
    title: String,

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }
});
```

We can populate both:

```js
const posts = await Post.find()
    .populate("author")
    .populate("category");
```

---

# 10. Populate with Field Selection

```js
const posts = await Post.find()
    .populate("author", "name profilePhoto")
    .populate("category", "name");
```

This is generally better than blindly populating everything.

---

# 11. Reference Array

A document can also contain an array of references.

For example, a user can have multiple friends:

```js
const userSchema = new mongoose.Schema({
    name: String,

    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});
```

Now:

```js
const user = await User
    .findById(userId)
    .populate("friends", "name email");
```

Mongoose can populate every ObjectId inside the `friends` array.

---

# 12. Another Example — DevTinder

Suppose we have:

```text
User
ConnectionRequest
```

A connection request may contain:

```js
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    status: {
        type: String,
        enum: ["interested", "ignored", "accepted", "rejected"]
    }
});
```

Now we can retrieve the users:

```js
const requests = await ConnectionRequest.find({
    toUserId: userId
})
.populate("fromUserId", "firstName lastName photo");
```

Instead of returning:

```json
{
    "fromUserId": "64abc123"
}
```

we can return useful user information:

```json
{
    "fromUserId": {
        "_id": "64abc123",
        "firstName": "Ramit",
        "lastName": "Sonar",
        "photo": "profile.jpg"
    }
}
```

---

# 13. `ref` vs `populate()`

| `ref`                       | `populate()`                          |
| --------------------------- | ------------------------------------- |
| Defines a relationship.     | Retrieves the referenced document.    |
| Used in the schema.         | Used in queries.                      |
| Points to a Mongoose model. | Replaces ObjectId with document data. |
| Example: `ref: "User"`      | Example: `.populate("author")`        |

### Remember

```text
ref → Who does this ObjectId belong to?

populate → Give me that document.
```

---

# 14. Thought Process Before Writing an API

Before writing an API, don't immediately start writing the route.

First understand:

```text
What data do I have?
        ↓
What does the client need?
        ↓
What operation is required?
        ↓
What database query is needed?
        ↓
What validation is required?
        ↓
What response should be returned?
```

This makes API development much easier.

---

# 15. Step 1 — Understand the Requirement

Suppose the requirement is:

> "Show all connection requests received by the logged-in user."

First ask:

* Who is requesting?
* Which user should receive the requests?
* What data should be returned?
* Which collection contains the requests?
* Do we need user information from another collection?

---

# 16. Step 2 — Identify the Database Models

Suppose we have:

```text
User
ConnectionRequest
```

Connection request:

```js
{
    fromUserId,
    toUserId,
    status
}
```

The logged-in user's ID is:

```js
req.user._id
```

Therefore:

```js
toUserId = req.user._id
```

---

# 17. Step 3 — Decide the API Endpoint

A suitable endpoint could be:

```http
GET /requests/received
```

Why `GET`?

Because we are retrieving data and not creating/updating/deleting anything.

---

# 18. Step 4 — Authentication

Before retrieving private connection requests, we need to know who the user is.

Authentication middleware can verify the JWT:

```js
app.get(
    "/requests/received",
    userAuth,
    getReceivedRequests
);
```

Flow:

```text
Request
   ↓
Authentication Middleware
   ↓
Identify User
   ↓
Controller
   ↓
Database Query
   ↓
Response
```

---

# 19. Step 5 — Write the Database Query

We need requests where:

```js
toUserId === loggedInUserId
```

So:

```js
const requests = await ConnectionRequest.find({
    toUserId: req.user._id
});
```

If we also need sender information:

```js
const requests = await ConnectionRequest
    .find({
        toUserId: req.user._id
    })
    .populate("fromUserId", "firstName lastName photo");
```

---

# 20. Step 6 — Validate Input

Always think about what data comes from the client.

For example:

```js
const { email, password } = req.body;
```

We should validate:

* Is email present?
* Is email valid?
* Is password present?
* Is password valid?

Never trust client input.

Backend validation is required even if frontend validation already exists.

---

# 21. Step 7 — Handle Errors

Database operations can fail.

For example:

```js
const user = await User.findById(userId);

if (!user) {
    throw new Error("User not found");
}
```

Use your centralized error-handling system instead of repeating error-response logic everywhere.

---

# 22. Step 8 — Return a Consistent Response

A good API should return a predictable response structure.

For example:

```js
res.status(200).json({
    success: true,
    message: "Connection requests fetched successfully",
    data: requests
});
```

Clients can then consistently handle:

```text
success
message
data
```

---

# 23. Complete API Example

### Route

```js
router.get(
    "/requests/received",
    userAuth,
    getReceivedRequests
);
```

### Controller

```js
const getReceivedRequests = async (req, res) => {
    const requests = await ConnectionRequest
        .find({
            toUserId: req.user._id
        })
        .populate(
            "fromUserId",
            "firstName lastName photo"
        );

    res.status(200).json({
        success: true,
        message: "Connection requests fetched successfully",
        data: requests
    });
};
```

---

# 24. Think About API Performance

When writing an API, don't just ask:

> "Does it work?"

Also ask:

> "Does it retrieve only the data we actually need?"

For example, instead of:

```js
.populate("fromUserId");
```

consider:

```js
.populate(
    "fromUserId",
    "firstName lastName photo"
);
```

This avoids unnecessarily returning fields that the frontend doesn't need.

---

# 25. Avoid Returning Sensitive Data

Suppose the User schema contains:

```text
firstName
lastName
email
password
phone
```

If the frontend only needs:

```text
firstName
lastName
photo
```

don't return the entire user document.

Use field selection:

```js
.populate(
    "fromUserId",
    "firstName lastName photo"
);
```

This is especially important for sensitive fields such as password hashes.

---

# 26. API Design Thought Process

Before implementing any API, ask these questions:

### 1. What is the purpose?

```text
What should this API do?
```

### 2. Which HTTP method?

```text
GET
POST
PUT
PATCH
DELETE
```

### 3. What endpoint?

```text
/users
/users/:id
/requests/received
```

### 4. Is authentication required?

```text
Public API?
Private API?
Admin-only API?
```

### 5. What input is required?

```text
req.params
req.query
req.body
req.user
```

### 6. What validation is required?

```text
Required?
Format?
Allowed values?
Authorization?
```

### 7. Which database operation?

```text
find()
findOne()
findById()
create()
updateOne()
findByIdAndUpdate()
deleteOne()
```

### 8. Are related documents required?

If yes:

```js
.populate(...)
```

### 9. What data should be returned?

Return only what the client actually needs.

### 10. What can go wrong?

Think about:

* invalid input
* missing data
* unauthorized user
* resource not found
* database errors

---

# 27. API Development Flow

```text
Requirement
     ↓
Choose HTTP Method
     ↓
Design Endpoint
     ↓
Authentication
     ↓
Validate Input
     ↓
Database Query
     ↓
Populate Related Data
     ↓
Handle Errors
     ↓
Return Consistent Response
     ↓
Test API
```

---

# 28. Important API Design Principles

### Keep APIs focused

One API should have one clear responsibility.

### Don't trust the client

Always validate and authorize on the backend.

### Return only necessary data

Avoid unnecessary fields and sensitive information.

### Use proper HTTP methods

```text
GET    → Read
POST   → Create
PUT    → Replace
PATCH  → Update partially
DELETE → Delete
```

### Use meaningful endpoints

Prefer:

```http
GET /users/:id
GET /requests/received
POST /requests
```

instead of unclear endpoints such as:

```http
GET /getUserData
POST /doSomething
```

### Keep database logic understandable

Write queries that clearly represent the requirement.

---

# 29. Common Mistakes

### Mistake 1 — Thinking `ref` fetches data

```js
ref: "User"
```

doesn't fetch the user.

You need:

```js
.populate("author")
```

---

### Mistake 2 — Populating everything

Avoid:

```js
.populate("user");
```

when you only need two or three fields.

Prefer:

```js
.populate("user", "firstName photo");
```

---

### Mistake 3 — Returning sensitive information

Never accidentally return password hashes or other private fields.

---

### Mistake 4 — Writing the query before understanding the requirement

First understand:

```text
What does the API need to return?
```

Then design the query.

---

### Mistake 5 — Ignoring authorization

Authentication tells us:

> Who is the user?

Authorization tells us:

> Is this user allowed to access this resource?

Both can be important for private APIs.

---

# Key Takeaways

* `ref` creates a relationship between Mongoose documents.
* `ref` usually stores an ObjectId referencing another model.
* `populate()` retrieves the referenced document.
* `ref` belongs in the schema.
* `populate()` is used while querying.
* You can populate only selected fields.
* Avoid exposing sensitive fields.
* Related data should be fetched only when the API actually needs it.
* API design should start with understanding the requirement, not immediately writing code.
* Authentication and authorization should be considered before accessing protected data.
* Validate input on the backend.
* Return consistent and useful responses.
* Think about performance and unnecessary database work.

## Remember

```text
ref
 ↓
Defines the relationship

populate()
 ↓
Fetches the related document

API Design
 ↓
Requirement
 ↓
Endpoint
 ↓
Authentication
 ↓
Validation
 ↓
Database Query
 ↓
Populate if needed
 ↓
Error Handling
 ↓
Response
```

> **Good API development is not just about making an API work — it's about understanding what data is needed, who can access it, how to retrieve it efficiently, and how to return it safely.**
