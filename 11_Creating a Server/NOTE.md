# Node.js HTTP Server

A simple **Node.js HTTP server** built using Node.js's built-in `http` module.
This project demonstrates **routing, HTTP methods, URL parsing, query parameters, and JSON API responses** without using Express.js.

## 📌 Concepts Covered

* Creating an HTTP server using `http.createServer()`
* Handling HTTP methods (`GET`)
* Routing using URL paths
* Parsing URLs and query parameters
* Sending plain-text responses
* Sending JSON responses
* HTTP status codes (`200`, `404`)
* Setting response headers
* Starting a server with `server.listen()`

## 📁 Project Structure

```text
node-http-server/
│
├── server.js
└── README.md
```

## 🚀 How to Run

Make sure Node.js is installed.

```bash
node server.js
```

You should see:

```text
Server running on http://localhost:3000
```

Open the server in your browser:

```text
http://localhost:3000
```

## 🛣️ Available Routes

| Method | Route              | Description        |
| ------ | ------------------ | ------------------ |
| GET    | `/`                | Home page          |
| GET    | `/about`           | About page         |
| GET    | `/user?name=Ramit` | Displays user name |
| GET    | `/api`             | Returns JSON data  |
| Any    | Invalid route      | Returns 404        |

### 1. Home Route

```text
GET /
```

Response:

```text
Welcome to Node.js Server!
```

### 2. About Route

```text
GET /about
```

Response:

```text
This is the About page.
```

### 3. User Route with Query Parameter

```text
GET /user?name=Ramit
```

Response:

```text
Hello, Ramit!
```

If no name is provided:

```text
GET /user
```

Response:

```text
Hello, Guest!
```

The query parameter is accessed using:

```js
query.name
```

### 4. API Route

```text
GET /api
```

Response:

```json
{
  "message": "API is working!",
  "status": "success",
  "server": "Node.js"
}
```

The JavaScript object is converted into JSON using:

```js
JSON.stringify(data)
```

## 🔍 URL Parsing

The `url` module is used to separate the URL path and query parameters:

```js
const parsedUrl = url.parse(req.url, true);

const path = parsedUrl.pathname;
const query = parsedUrl.query;
```

For example:

```text
/user?name=Ramit
```

is parsed as:

```text
pathname → /user
query    → { name: "Ramit" }
```

## 📡 HTTP Status Codes

The server uses HTTP status codes to indicate the result of a request:

```js
res.writeHead(200);
```

`200` means the request was successful.

For an unknown route:

```js
res.writeHead(404);
```

`404` means the requested resource was not found.

## 📦 Response Headers

The default response type is set using:

```js
res.setHeader("Content-Type", "text/plain");
```

For the API response, it is changed to JSON:

```js
res.writeHead(200, {
  "Content-Type": "application/json",
});
```

## 🧠 Request Flow

```text
Client / Browser
       ↓
HTTP Request
       ↓
Node.js HTTP Server
       ↓
Parse URL
       ↓
Check Method + Path
       ↓
Match Route
       ↓
Send Response
       ↓
Client / Browser
```

## 🔑 Important Code

Create the server:

```js
const http = require("http");

const server = http.createServer((req, res) => {
    // Handle request
});
```

Start the server:

```js
server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
```

## ⚠️ Note

This project uses Node.js's **built-in `http` module**, so no external packages or Express.js are required.

It is useful for understanding how HTTP servers and basic routing work internally before moving to **Express.js**.

## 👨‍💻 Author

**Ramit Sonar**

Computer Engineering Student | Full-Stack MERN Developer
