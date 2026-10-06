# Episode 11 — Diving into the APIs and Express Router

## 1. What Is Express Router?

`express.Router()` is used to create **modular route handlers** in Express.js. It allows us to separate routes into different files instead of defining every API endpoint in `app.js`.

**Why do we need it?**

When an application grows, keeping all API routes in one file makes the code difficult to maintain. Express Router helps organize routes by feature.

For example:

* `userRoutes.js` → User-related APIs
* `productRoutes.js` → Product-related APIs
* `orderRoutes.js` → Order-related APIs

## 2. Without Express Router

```js
const express = require("express");
const app = express();

app.get("/users", (req, res) => {
    res.send("Get all users");
});

app.post("/users", (req, res) => {
    res.send("Create a user");
});

app.get("/products", (req, res) => {
    res.send("Get all products");
});

app.listen(3000);
```

**Problem:** As the number of APIs increases, `app.js` becomes large and difficult to manage.

## 3. Create Routes Using Express Router

### Step 1: Create `routes/userRoutes.js`

```js
const express = require("express");

// Create a separate router for user-related APIs
const userRouter = express.Router();

// Handle GET requests to /users
userRouter.get("/", (req, res) => {
    res.send("Get all users");
});

// Handle POST requests to /users
userRouter.post("/", (req, res) => {
    res.send("Create a user");
});

module.exports = userRouter;
```

### Step 2: Import the Router into `app.js`

```js
const express = require("express");
const userRouter = require("./routes/userRoutes");

const app = express();

// Connect user routes to the /users path
app.use("/users", userRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
```

Now the following APIs work:

| HTTP Method | Endpoint | Purpose       |
| ----------- | -------- | ------------- |
| GET         | `/users` | Get all users |
| POST        | `/users` | Create a user |

**How does the path work?**

`app.use("/users", userRouter)` adds the `/users` prefix to routes defined inside `userRouter`.

For example, `userRouter.get("/profile", ...)` becomes `GET /users/profile`.

## 4. Organizing Multiple Routers

A clean project structure can look like this:

```text
project/
├── src/
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── productRoutes.js
│   ├── app.js
│   └── server.js
└── package.json
```

**`routes/productRoutes.js`**

```js
const express = require("express");

const productRouter = express.Router();

productRouter.get("/", (req, res) => {
    res.send("Get all products");
});

productRouter.post("/", (req, res) => {
    res.send("Create a product");
});

module.exports = productRouter;
```

**Register both routers in `app.js`:**

```js
const express = require("express");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");

const app = express();

app.use(express.json());

// Register modular routes
app.use("/users", userRouter);
app.use("/products", productRouter);

module.exports = app;
```

Now:

* `GET /users` → Get all users
* `POST /users` → Create a user
* `GET /products` → Get all products
* `POST /products` → Create a product

## 5. Express Router with Route Parameters

Route parameters work inside routers just as they do in Express applications.

```js
userRouter.get("/:id", (req, res) => {
    const userId = req.params.id;

    res.send(`User ID: ${userId}`);
});
```

For a request to `GET /users/123`, `req.params.id` contains `"123"`.

## 6. Express Router with Middleware

We can apply middleware to every route in a router using `router.use()`.

```js
const userRouter = express.Router();

// Middleware runs before the router's matching routes
userRouter.use((req, res, next) => {
    console.log("User route accessed");
    next();
});

userRouter.get("/", (req, res) => {
    res.send("Get all users");
});
```

**Why is this useful?**

Router-level middleware can help with authentication, logging, and other checks that apply to a group of routes.

Remember: middleware must call `next()` to continue the request flow when it does not send a response.

## 7. `app.use()` vs `router.use()`

| `app.use()`                                      | `router.use()`                                   |
| ------------------------------------------------ | ------------------------------------------------ |
| Registers middleware on the Express application. | Registers middleware on a specific router.       |
| Can apply to many application routes.            | Applies within that router's mounted route path. |
| Example: `app.use("/users", userRouter)`         | Example: `userRouter.use(authMiddleware)`        |

## 8. `app` vs `express.Router()`

| Express App                                | Express Router                              |
| ------------------------------------------ | ------------------------------------------- |
| Created using `express()`.                 | Created using `express.Router()`.           |
| Represents the main application.           | Represents a modular group of routes.       |
| Can listen on a port using `app.listen()`. | Does not independently listen on a port.    |
| Mounts routers and middleware.             | Defines routes and router-level middleware. |

## 9. How Request Routing Works

```text
Client Request
      ↓
Express Application (app.js)
      ↓
Match the mounted path
      ↓
Express Router
      ↓
Matching route handler
      ↓
Send Response
```

For example, a request to `GET /products` reaches the router mounted at `/products`, then matches `productRouter.get("/")`.

## 10. Why Express Router Is Important

* **Modularity:** Keep different features in separate files.
* **Maintainability:** Make routes easier to find and update.
* **Scalability:** Add new API groups without overcrowding `app.js`.
* **Reusability:** Apply middleware to a group of related routes.
* **Readability:** Make the overall application structure easier to understand.

## Key Takeaways

* `express.Router()` creates a modular routing system.
* Define routes using `router.get()`, `router.post()`, `router.patch()`, `router.put()`, and `router.delete()`.
* Export the router and import it into the main application.
* Use `app.use("/prefix", router)` to mount a router under a URL prefix.
* Use `router.use()` to apply middleware within a router.
* Express Router organizes routes; it does not replace the main Express application.

### Remember

**`app.js` connects the route modules, while each router manages the routes for a particular feature.**
