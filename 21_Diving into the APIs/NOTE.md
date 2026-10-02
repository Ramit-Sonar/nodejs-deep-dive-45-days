# 📘 Episode 07 — Diving into the APIs

## 🚀 What is an API?

**API (Application Programming Interface)** allows different applications or systems to communicate with each other.

In a web application:

```text
Frontend
   ↓
 HTTP Request
   ↓
Backend API
   ↓
Database
   ↓
Backend API
   ↓
 HTTP Response
   ↓
Frontend
```

Example:

```text
GET /users
```

The frontend sends a request to the backend, and the backend returns user data.

---

# 🌐 What is a REST API?

**REST (Representational State Transfer)** is an architectural style commonly used to build web APIs.

A REST API uses:

* HTTP methods
* URLs/endpoints
* HTTP status codes
* JSON data

Example:

```text
GET    /users
POST   /users
GET    /users/123
PUT    /users/123
DELETE /users/123
```

---

# 🔥 HTTP Methods

HTTP methods describe **what operation we want to perform**.

| Method | Purpose               | Example             |
| ------ | --------------------- | ------------------- |
| GET    | Read data             | `GET /users`        |
| POST   | Create data           | `POST /users`       |
| PUT    | Replace/update data   | `PUT /users/123`    |
| PATCH  | Partially update data | `PATCH /users/123`  |
| DELETE | Delete data           | `DELETE /users/123` |

---

# 📥 GET Request

Used to **retrieve data**.

```js
app.get("/users", (req, res) => {
    res.send("Get all users");
});
```

Example:

```text
GET /users
```

Response:

```json
{
    "message": "Get all users"
}
```

---

# 📤 POST Request

Used to **create new data**.

```js
app.post("/users", (req, res) => {
    console.log(req.body);

    res.send("User created");
});
```

Example request:

```json
{
    "firstName": "Ramit",
    "lastName": "Sonar"
}
```

Usually, JSON body parsing is enabled using:

```js
app.use(express.json());
```

---

# 🔄 PUT Request

`PUT` is generally used to **replace/update an existing resource**.

```js
app.put("/users/:userId", (req, res) => {
    console.log(req.params.userId);
    console.log(req.body);

    res.send("User updated");
});
```

Example:

```text
PUT /users/123
```

---

# ✏️ PATCH Request

`PATCH` is generally used for a **partial update**.

```js
app.patch("/users/:userId", (req, res) => {
    res.send("User partially updated");
});
```

Example:

```text
PATCH /users/123
```

Only the required fields can be changed.

---

# 🗑️ DELETE Request

Used to delete a resource.

```js
app.delete("/users/:userId", (req, res) => {
    console.log(req.params.userId);

    res.send("User deleted");
});
```

Example:

```text
DELETE /users/123
```

---

# 🛣️ API Endpoint

An **endpoint** is a specific URL through which an API can be accessed.

Example:

```text
GET /users
```

Here:

```text
GET  → HTTP Method
/users → Endpoint/Path
```

Another example:

```text
GET /users/123
```

This can represent a request for a specific user.

---

# 🔢 Route Parameters

Route parameters are used to identify a specific resource.

```js
app.get("/users/:userId", (req, res) => {
    console.log(req.params.userId);

    res.send("User details");
});
```

Request:

```text
GET /users/123
```

Access the parameter:

```js
req.params.userId
```

Output:

```text
123
```

---

# 🔍 Query Parameters

Query parameters are commonly used for filtering, searching, sorting, etc.

Example:

```text
GET /users?age=20
```

Access them using:

```js
req.query.age
```

Example:

```js
app.get("/users", (req, res) => {
    console.log(req.query);

    res.send("Users");
});
```

For:

```text
/users?age=20&city=Kathmandu
```

`req.query` contains:

```js
{
    age: "20",
    city: "Kathmandu"
}
```

---

# 📦 Request Body

The request body contains data sent by the client.

Example:

```json
{
    "firstName": "Ramit",
    "lastName": "Sonar"
}
```

Access it using:

```js
req.body
```

Example:

```js
app.post("/users", (req, res) => {
    console.log(req.body);

    res.send("User received");
});
```

---

# 📤 Sending JSON Response

APIs commonly return JSON.

```js
app.get("/user", (req, res) => {
    res.json({
        firstName: "Ramit",
        lastName: "Sonar"
    });
});
```

Response:

```json
{
    "firstName": "Ramit",
    "lastName": "Sonar"
}
```

---

# 🔢 HTTP Status Codes

Status codes tell the client what happened with the request.

### Common Status Codes

| Status | Meaning               |
| ------ | --------------------- |
| `200`  | OK                    |
| `201`  | Created               |
| `400`  | Bad Request           |
| `401`  | Unauthorized          |
| `403`  | Forbidden             |
| `404`  | Not Found             |
| `500`  | Internal Server Error |

Example:

```js
res.status(201).json({
    message: "User created"
});
```

---

# 🏗️ Complete REST API Example

```js
const express = require("express");

const app = express();

const PORT = 5000;

app.use(express.json());

// GET
app.get("/users", (req, res) => {
    res.status(200).json({
        message: "Get all users"
    });
});

// GET by ID
app.get("/users/:userId", (req, res) => {
    res.status(200).json({
        message: "Get user",
        userId: req.params.userId
    });
});

// POST
app.post("/users", (req, res) => {
    res.status(201).json({
        message: "User created",
        data: req.body
    });
});

// PUT
app.put("/users/:userId", (req, res) => {
    res.status(200).json({
        message: "User updated",
        userId: req.params.userId
    });
});

// DELETE
app.delete("/users/:userId", (req, res) => {
    res.status(200).json({
        message: "User deleted",
        userId: req.params.userId
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

---

# 🔄 API Request Flow

When a frontend calls an API:

```text
Frontend
   ↓
HTTP Request
   ↓
Express Route
   ↓
Controller / Logic
   ↓
Database
   ↓
Controller / Logic
   ↓
JSON Response
   ↓
Frontend
```

Example:

```text
POST /users
       ↓
Express
       ↓
Read req.body
       ↓
Validate data
       ↓
Save to MongoDB
       ↓
Return response
```

---

# 🧠 Important Difference

### `req.params`

Used for values inside the URL path.

```text
/users/123
```

```js
req.params.userId
```

### `req.query`

Used for values after `?`.

```text
/users?age=20
```

```js
req.query.age
```

### `req.body`

Used for data sent inside the request body.

```json
{
    "name": "Ramit"
}
```

```js
req.body.name
```

---

# 🎯 Key Takeaways

* **API** allows different applications to communicate.
* REST APIs commonly use HTTP methods and JSON.
* `GET` → Read
* `POST` → Create
* `PUT` → Replace/update
* `PATCH` → Partial update
* `DELETE` → Delete
* `req.params` → URL parameters
* `req.query` → Query parameters
* `req.body` → Request body
* `res.json()` → Send JSON response
* HTTP status codes communicate the result of a request.
* REST APIs provide a structured way for frontend and backend to communicate.

## 🔑 Remember

```text
GET    → Read
POST   → Create
PUT    → Replace
PATCH  → Partial Update
DELETE → Delete
```

```text
params → /users/123
query  → /users?age=20
body   → { "name": "Ramit" }
```
