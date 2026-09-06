# 🎬 Episode 05 — Diving Into Node.js

> **Today’s focus:** Understanding how Node.js CommonJS modules work behind the scenes.

## 🔐 1. How Does Module Privacy Work?

In the previous episode, I learned how modules communicate:

```js
module.exports
```

is used to **export** something from a module, and:

```js
require("./path")
```

is used to **import/use** it in another module.

But an important question remained:

> **Where do `module` and `require()` come from?**

---

## ⚙️ 2. CommonJS Module Wrapper

When Node.js runs a CommonJS module, it **wraps the module code inside a function**.

Conceptually:

```js
(function (exports, require, module, __filename, __dirname) {

    // Module code

});
```

Node.js passes these values as **parameters** to the wrapper function.

That's why we can directly use:

```js
require("./multiply.js");

module.exports = {};
```

even though we never created `require` or `module` ourselves.

### 🧠 Key Idea

> **`require`, `module`, `exports`, `__filename`, and `__dirname` are available in CommonJS because Node.js provides them to the module through its function wrapper.**

---

# 🔍 3. What Happens Behind `require("./path")`?

When we write:

```js
const { calculateMultiply } = require("./multiply.js");
```

Node.js goes through several important steps.

```text
require("./multiply.js")
          ↓
1. Resolving
          ↓
2. Loading
          ↓
3. Wrapping
          ↓
4. Evaluation
          ↓
5. Caching
```

---

## 1️⃣ Resolving the Module

Node.js first determines **which module/file** we are asking for.

For example:

```js
require("./multiply.js");
```

Node.js resolves the path and finds the required module.

---

## 2️⃣ Loading the Module

After resolving the module, Node.js loads its content into memory.

For example:

```js
// multiply.js

function calculateMultiply(a, b) {
    return a * b;
}

module.exports = { calculateMultiply };
```

---

## 3️⃣ Wrapping the Module

Node.js wraps the loaded CommonJS code inside its function wrapper:

```js
(function (exports, require, module, __filename, __dirname) {

    function calculateMultiply(a, b) {
        return a * b;
    }

    module.exports = { calculateMultiply };

});
```

This gives the module its own scope and also provides things like `require` and `module`.

---

## 4️⃣ Evaluation

Node.js executes the wrapped module code.

When:

```js
module.exports = { calculateMultiply };
```

runs, that exported value becomes the result that `require()` provides to the calling module.

So:

```js
const result = require("./multiply.js");
```

conceptually gives:

```js
result = {
    calculateMultiply
};
```

---

# 🗃️ 5. Caching — A Very Important Part

After Node.js loads and evaluates a CommonJS module, it **caches the module**.

This becomes very important when multiple files require the same module.

Suppose:

```text
app.js
 ├── require("./user.js")
 └── require("./payment.js")

payment.js
 └── require("./user.js")
```

`user.js` is required more than once.

Node.js does **not execute `user.js` from the beginning every time**.

Instead:

```text
First require("./user.js")
          ↓
Resolve
          ↓
Load
          ↓
Wrap
          ↓
Evaluate
          ↓
Cache module
```

Later:

```text
Another require("./user.js")
          ↓
Check cache
          ↓
Module already exists
          ↓
Return cached exports
```

### 🧠 Why Is Caching Important?

Without caching, the same module could be repeatedly loaded and executed whenever different files require it.

Caching allows Node.js to reuse the already-loaded module.

> **A CommonJS module is normally evaluated once per process, then subsequent `require()` calls return the cached module exports.**

---

# 🔄 Complete Mental Model

When I write:

```js
require("./multiply.js");
```

I should think:

```text
        require("./multiply.js")
                  ↓
          1. Resolve module
                  ↓
           2. Load module
                  ↓
        3. Wrap in function
                  ↓
          4. Evaluate code
                  ↓
      module.exports is produced
                  ↓
           5. Cache module
                  ↓
        Return cached exports
        on future requires
```

---

## ⭐ What I Learned So Far

* Node.js wraps CommonJS module code inside a function.
* `require` and `module` are available because Node.js passes them to this wrapper.
* The wrapper gives each module its own scope.
* `require()` goes through **resolving → loading → wrapping → evaluation → caching**.
* `module.exports` determines what the module provides to the code that requires it.
* **Caching is important:** once a CommonJS module has been loaded and evaluated, later `require()` calls normally reuse the cached module instead of executing it again.
