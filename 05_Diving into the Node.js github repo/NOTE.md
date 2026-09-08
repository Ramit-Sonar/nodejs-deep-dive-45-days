# 🎬 Episode 05 — Diving Into Node.js

> **Focus:** Understanding what happens behind the scenes when Node.js uses `require()` and how modules remain private.

---

## 🔐 1. Module Privacy

In the previous episode, I learned how modules communicate:

```js
module.exports = { calculateMultiply };
```

and:

```js
const { calculateMultiply } = require("./multiply.js");
```

But in this episode, I wanted to understand:

> **How are variables and functions of one module kept private from another module?**

The answer is related to the **function wrapper** used by Node.js for CommonJS modules.

---

## ⚙️ 2. CommonJS Module Wrapper

When Node.js loads a CommonJS module, it wraps the module code inside a function.

Conceptually, it looks like:

```js
(function (exports, require, module, __filename, __dirname) {

    // Module code runs here

    function calculateMultiply(a, b) {
        const result = a * b;
        console.log(result);
    }

    module.exports = { calculateMultiply };

})();
```

This wrapper gives the module its **own function scope**.

That's why code inside one module is not directly accessible from another module.

---

## 🧩 3. IIFE

The wrapper is conceptually similar to an **IIFE**.

**IIFE = Immediately Invoked Function Expression**

Example:

```js
(function () {

    const secret = "private";

    console.log(secret);

})();
```

The function is created and immediately executed.

The variable `secret` exists inside that function's scope and cannot be directly accessed from outside.

This helped me understand the basic idea of **module privacy and encapsulation**.

---

## 📦 4. Why Can We Use `require` and `module`?

We never create these ourselves:

```js
require()
module
__filename
__dirname
```

Node.js provides them through the CommonJS function wrapper.

Conceptually:

```js
(function (exports, require, module, __filename, __dirname) {

    // Our module code

})();
```

So inside a CommonJS module, we can write:

```js
require("./path");

module.exports = {};

console.log(__filename);
console.log(__dirname);
```

because Node.js provides these values to the module.

---

## 🔍 5. What Happens Behind `require()`?

When we write:

```js
const { calculateMultiply } = require("./multiply.js");
```

Node.js goes through an internal process.

```text
require("./multiply.js")
          ↓
   1. Resolve module
          ↓
   2. Load module
          ↓
   3. Wrap module code
          ↓
   4. Evaluate / execute code
          ↓
   5. Cache the module
          ↓
   Return module.exports
```

### 1. Resolving

Node.js determines **which module/file** the path refers to.

### 2. Loading

Node.js loads the module's code.

### 3. Wrapping

The CommonJS module code is placed inside the function wrapper.

### 4. Evaluation

The wrapped code is executed.

For example:

```js
module.exports = { calculateMultiply };
```

defines what the module provides.

### 5. Caching

Node.js caches the loaded module.

If another file requires the same module again, Node.js can use the **cached module** instead of executing that module again from scratch.

---

## 🧪 6. What I Explored in the Node.js Source Code

For this episode, I went beyond simply using:

```js
require()
```

I explored the **Node.js GitHub repository** to understand how these things are actually implemented.

I looked at the Node.js source code to understand concepts such as:

* How `require()` is implemented.
* How the CommonJS module system works internally.
* How Node.js wraps module code inside a function.
* How `module` and `exports` are provided.
* How modules are loaded and evaluated.
* How module caching works.

This helped me connect the code I normally write with what Node.js is doing **behind the scenes**.

---

## 🧠 My Mental Model

When I write:

```js
const { calculateMultiply } = require("./multiply.js");
```

I can now visualize:

```text
          require("./multiply.js")
                    ↓
              Resolve module
                    ↓
               Load module
                    ↓
          Wrap module in function
                    ↓
              Execute code
                    ↓
            module.exports
                    ↓
                Cache
                    ↓
          Return exported value
```

### ⭐ Main Idea

> **CommonJS modules are executed inside a Node.js-provided function wrapper. This gives each module its own scope, while `module.exports` provides a controlled way to expose code to other modules. `require()` loads and returns those exports, with Node.js caching the module for later use.**
