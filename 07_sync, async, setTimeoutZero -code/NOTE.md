# 🎬 Episode 07 — Sync, Async & `setTimeout(0)`

> **Focus:** Practically understanding synchronous execution, asynchronous execution, blocking the main thread, libuv offloading, and `setTimeout(0)` through code experiments.

---

# 1️⃣ Synchronous Code

### 📄 `sync.js`

```js
console.log("Hello World");

const a = 10;
const b = 20;

function multiplyFn(x, y) {
    const result = a * b;
    return result;
}

var c = multiplyFn(a, b);

console.log("multiplication result is : ", c);
```

### ▶️ Output

```text
Hello World
multiplication result is :  200
```

### 🔄 Execution Flow

```text
console.log("Hello World")
          ↓
       a = 10
          ↓
       b = 20
          ↓
   multiplyFn(a, b)
          ↓
      result = 200
          ↓
       return
          ↓
    console.log(c)
```

### 🧠 What I Observed

* JavaScript executes the statements **sequentially**.
* The next statement waits for the current statement to finish.
* `multiplyFn()` finishes before the final `console.log()` executes.
* This is **synchronous execution**.

> **Key observation:** Synchronous code follows the execution order from top to bottom.

---

# 2️⃣ Asynchronous Code

### 📄 `async.js`

```js
const fs = require("fs");
const https = require("https");

console.log("Hello world");

var a = 10;
var b = 20;

// Synchronous → blocks the main thread
fs.readFileSync("./file.txt", "utf8");

console.log("This will execute only after file read");

https.get("https://dummyjson.com/products", (res) => {
    console.log("Fetched Data Successfully from api");
});

setTimeout(() => {
    console.log("setTimeout called after 5 second");
}, 5000);

// Async Function
fs.readFile("./file.txt", "utf8", (err, data) => {
    console.log("File Data :", data);
});

function multiplyFn(x, y) {
    const result = a * b;
    return result;
}

var c = multiplyFn(a, b);

console.log("multiplication result is : ", c);
```

## 🔴 `readFileSync()` — Blocking

```js
fs.readFileSync("./file.txt", "utf8");
```

This is a **synchronous** file-reading operation.

```text
V8 / Main Thread
      ↓
 readFileSync()
      ↓
   WAIT 🛑
      ↓
 File Reading
      ↓
 Continue JavaScript
```

The main JavaScript execution is blocked until the file-reading operation finishes.

> ❌ Synchronous I/O can block the main thread, so it is generally avoided for normal server request handling.

---

## 🟢 `readFile()` — Asynchronous

```js
fs.readFile("./file.txt", "utf8", (err, data) => {
    console.log("File Data :", data);
});
```

Instead of waiting for the file operation to finish, Node.js can continue executing other JavaScript.

Conceptually:

```text
JavaScript
    ↓
fs.readFile()
    ↓
Async handling
    ↓
JavaScript continues
    ↓
File operation completes
    ↓
Callback executes later
```

---

## 🌐 API Request

```js
https.get("https://dummyjson.com/products", (res) => {
    console.log("Fetched Data Successfully from api");
});
```

The API request is asynchronous, so JavaScript does not simply stop and wait for the network response.

---

## 🧠 What I Observed

This example demonstrates that Node.js can have **both synchronous and asynchronous operations** in the same program.

```text
             Node.js
                │
        ┌───────┴───────┐
        ↓               ↓
   V8 / Main Thread    Async Work
        │               │
   Sync JavaScript      ↓
        │            libuv / OS
        │               │
        └─────── ← Result / Callback
```

### Important Observation

The synchronous `readFileSync()` blocks JavaScript execution.

The asynchronous `readFile()` and network request allow JavaScript execution to continue and complete their work later.

> **Key idea:** Node.js does not make JavaScript itself asynchronous. Node.js provides mechanisms that allow asynchronous operations to happen outside the main JavaScript execution flow.

---

# 3️⃣ Blocking the Main Thread with `crypto`

### 📄 `blocking.js`

```js
const crypto = require("crypto");

console.log("Hello World");

const a = 10;
const b = 20;

// PBKDF2 = Password-Based Key Derivation Function 2

// Synchronous → blocks the main thread
crypto.pbkdf2Sync(
    "anypassword",
    "salt",
    5000000,
    50,
    "sha512"
);

console.log("First key is Generated");

setTimeout(() => {
    console.log("call me right now !!!!");
}, 0);

// Async Function
crypto.pbkdf2(
    "anypassword",
    "salt",
    500000,
    50,
    "sha512",
    (err, key) => {
        console.log("second key is generated", key);
    }
);

function multiplyFn(x, y) {
    const result = a * b;
    return result;
}

var c = multiplyFn(a, b);

console.log("multiplication result is : ", c);
```

---

## 🔴 `pbkdf2Sync()`

```js
crypto.pbkdf2Sync(
    "anypassword",
    "salt",
    5000000,
    50,
    "sha512"
);
```

`pbkdf2Sync()` is synchronous.

It blocks the main JavaScript thread until the key-generation operation finishes.

```text
JavaScript
    ↓
pbkdf2Sync()
    ↓
   BLOCK 🛑
    ↓
Key Generation
    ↓
Continue JavaScript
```

---

## 🟢 `pbkdf2()`

```js
crypto.pbkdf2(
    "anypassword",
    "salt",
    500000,
    50,
    "sha512",
    (err, key) => {
        console.log("second key is generated", key);
    }
);
```

The asynchronous version does not block the main JavaScript execution in the same way.

For operations such as this crypto work, Node.js can use **libuv's worker pool** to perform the work away from the main JavaScript thread.

```text
Main JavaScript Thread
        │
        ↓
  crypto.pbkdf2()
        │
        ↓
   libuv Worker
      Pool
        │
        ↓
  Key Generation
        │
        ↓
    Callback
```

---

## 🔍 `pbkdf2()` Parameters

```js
crypto.pbkdf2(
    password,
    salt,
    iterations,
    keylen,
    digest,
    callback
);
```

| Parameter    | Meaning                                           |
| ------------ | ------------------------------------------------- |
| `password`   | Password/input value                              |
| `salt`       | Salt used during key derivation                   |
| `iterations` | Number of derivation iterations                   |
| `keylen`     | Length of generated key                           |
| `digest`     | Hash algorithm, e.g. `sha512`                     |
| `callback`   | Function called when the async operation finishes |

Example:

```js
crypto.pbkdf2(
    "anypassword", // password
    "salt",        // salt
    500000,        // iterations
    50,            // key length
    "sha512",      // digest
    callback       // callback
);
```

### 📝 Important Observation

```text
pbkdf2Sync()  → Synchronous → Blocks main thread
pbkdf2()      → Asynchronous → Uses async mechanism / worker pool
```

---

# 4️⃣ `setTimeout(0)`

### 📄 `setTimeoutZero.js`

```js
console.log("Hello World");

const a = 10;
const b = 20;

setTimeout(() => {
    console.log("call me right now");
}, 0);

setTimeout(() => {
    console.log("setTimeout called after 5 second");
}, 5000);

function multiplyFn(x, y) {
    const result = a * b;
    return result;
}

var c = multiplyFn(a, b);

console.log("multiplication result is : ", c);
```

---

## ⏱️ Does `setTimeout(0)` Execute Immediately?

**No.**

```js
setTimeout(() => {
    console.log("call me right now");
}, 0);
```

`0` does **not** mean:

> "Execute immediately."

It means the timer has a **minimum delay of approximately 0 ms**.

The callback can run only when the JavaScript call stack is empty and the event-loop scheduling allows it to run.

### Example

```text
console.log("Hello World")
          ↓
    setTimeout(0)
          ↓
   Timer is scheduled
          ↓
More synchronous code executes
          ↓
     Call Stack Empty
          ↓
 Event Loop can process it
          ↓
   Callback executes
```

So:

```text
setTimeout(0)
      ≠
execute immediately
```

> **Key idea:** `setTimeout(0)` means **"run this callback as soon as possible after the timer becomes eligible and the current JavaScript work has finished"**, not exactly after 0 ms.

---

# 🧪 What I Observed from the Experiments

| Experiment       | What I learned                                                                      |
| ---------------- | ----------------------------------------------------------------------------------- |
| `sync.js`        | Synchronous code executes sequentially                                              |
| `readFileSync()` | Synchronous I/O blocks the main thread                                              |
| `readFile()`     | Asynchronous file operation allows JavaScript to continue                           |
| `https.get()`    | Network operation is asynchronous                                                   |
| `pbkdf2Sync()`   | Synchronous crypto work blocks the main thread                                      |
| `pbkdf2()`       | Async crypto work can be handled using Node's asynchronous mechanisms / worker pool |
| `setTimeout(0)`  | `0 ms` does not mean immediate execution                                            |
| `setTimeout(0)`  | Callback runs only after current synchronous work finishes and scheduling allows it |

---

# 🧠 Episode 07 Mental Model

```text
                 Node.js
                    │
          ┌─────────┴─────────┐
          ↓                   ↓
     Main JS Thread        Async Work
          │                   │
          ↓                   ↓
       V8 Engine            libuv
          │               ┌───┴────┐
          │               ↓        ↓
     Sync Code         OS /    Worker Pool
                       Network
                          │
                          ↓
                       Callback
                          │
                          ↓
                    JavaScript
```

> **The practical experiments showed how synchronous operations can block the main JavaScript thread, while asynchronous operations allow Node.js to continue executing JavaScript and handle the result later.**

---

# 🎯 Episode 07 Complete

### Topics Practically Explored

* ✅ Synchronous execution
* ✅ Asynchronous execution
* ✅ Blocking the main thread
* ✅ `fs.readFileSync()`
* ✅ `fs.readFile()`
* ✅ Asynchronous API request
* ✅ `crypto.pbkdf2Sync()`
* ✅ `crypto.pbkdf2()`
* ✅ PBKDF2 parameters
* ✅ libuv worker pool
* ✅ `setTimeout(0)`
* ✅ Why `setTimeout(0)` does not mean immediate execution
* ✅ Observing execution order through code experiments

➡️ **Next:** Continue deeper into the **Event Loop and how asynchronous callbacks return to JavaScript.**
