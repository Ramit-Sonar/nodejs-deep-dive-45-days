# 🎬 Episode 05 — Diving Into Node.js

> **Today’s focus:** Understanding how Node.js keeps variables and functions private inside a CommonJS module.

## 🔐 How Does Module Privacy Work?

In the previous episode, I learned that modules can communicate using:

```js
module.exports
```

and:

```js
require("./path")
```

But an important question remained:

> **Why can't we directly access variables and functions from another module?**

The answer lies in how Node.js executes CommonJS modules.

---

## ⚙️ CommonJS Module Wrapper

When we use:

```js
require("./multiply.js");
```

Node.js conceptually wraps the code of that module inside a function before executing it.

```js
(function () {

    // Module code

    function calculateMultiply(a, b) {
        return a * b;
    }

    module.exports = { calculateMultiply };

}());
```

Because the code runs inside its own function scope, variables and functions declared inside the module are **private to that module by default**.

---

## 🧩 IIFE — Immediately Invoked Function Expression

An **IIFE** is a function that is created and immediately executed.

```js
(function () {

    const secret = "private";

    console.log(secret);

}());
```

The variable `secret` exists only inside that function and cannot be directly accessed from outside.

This helps understand the basic idea behind **module encapsulation**.

---

## 📦 Private vs Exported

```js
const secret = "private";

function calculateMultiply(a, b) {
    return a * b;
}

module.exports = {
    calculateMultiply
};
```

Here:

```text
secret                 → 🔒 Private
calculateMultiply()    → 🔓 Exported
```

Another module can access `calculateMultiply()` because it was intentionally exported.

---

## 🧠 Important Mental Model

```text
require("./multiply.js")
          ↓
Node.js loads the module
          ↓
Module code runs inside
its own function scope
          ↓
Private variables/functions
stay inside that module
          ↓
module.exports
exposes selected values
```

### ⭐ Key Idea

> **CommonJS modules are wrapped in a function, giving each module its own scope. This is why variables and functions are private by default, and `module.exports` is used to intentionally expose them.**
