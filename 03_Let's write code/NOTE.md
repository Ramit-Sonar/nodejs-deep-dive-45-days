# 🎬 Episode 03 — Let's Write Code

> **Running JavaScript with Node.js, exploring the Node REPL, and understanding the global object**

In this episode, I finally started writing and executing JavaScript using Node.js.

Instead of only learning about Node.js theoretically, I used the Node.js runtime directly and explored how JavaScript behaves outside the browser.

This episode introduced me to:

* Installing Node.js and npm
* Node.js REPL
* Running JavaScript from the terminal
* Writing Node.js programs in VS Code
* The Node.js `global` object
* `global` vs `this`
* Browser `window` vs Node.js `global`
* `globalThis` as a common global-object reference

---

# 🟢 1. Installing Node.js

The first step was installing **Node.js**.

When Node.js is installed, **npm (Node Package Manager)** is also normally installed along with it.

After installation, we can verify both from the terminal:

```bash
node -v
npm -v
```

For example:

```text
Node.js → v22.x.x
npm     → 10.x.x
```

The important relationship is:

```text
Node.js
   │
   └── comes with
          ↓
         npm
```

### What are they?

**Node.js**
→ JavaScript runtime environment.

**npm**
→ Package manager used to install and manage JavaScript packages.

---

# ⚡ 2. The Node.js REPL

One of the quickest ways to start experimenting with Node.js is the **Node.js REPL**.

### REPL means:

> **Read → Eval → Print → Loop**

It provides an interactive environment where we can enter JavaScript code and immediately see the result.

Start it by typing:

```bash
node
```

You will see something similar to:

```text
Welcome to Node.js
Type ".help" for more information.
>
```

Now we can write JavaScript directly:

```js
> 10 + 20
30
```

Another example:

```js
> const name = "Ramit"
> name
'Ramit'
```

We can also execute JavaScript:

```js
> console.log("Hello Node.js")
Hello Node.js
```

---

# 🧠 Why Is REPL Useful?

The Node.js REPL is excellent for **quick experimentation**.

Instead of creating a file every time, we can immediately test an idea.

For example:

```js
> typeof "hello"
'string'

> 5 + 10
15

> Math.max(10, 50)
50
```

This makes REPL a very useful learning tool.

### But there is a problem...

After writing larger amounts of code, the REPL starts becoming uncomfortable.

Imagine trying to write:

```text
50 lines
100 lines
200 lines
```

inside the REPL.

It becomes difficult to:

* Organize code
* Edit code
* Save code
* Reuse code
* Manage multiple files
* Build larger applications

So we move from experimentation to a proper code editor.

---

# 💻 3. Writing Node.js Code in VS Code

For larger programs, we can use **VS Code**.

Create a file:

```text
app.js
```

Then write:

```js
console.log("Hello from Node.js");
```

Now we can execute the file using:

```bash
node app.js
```

The Node.js runtime reads the JavaScript file and executes it.

```text
app.js
   ↓
node app.js
   ↓
Node.js Runtime
   ↓
JavaScript executes
   ↓
Output
```

---

# 🖥️ 4. Terminal Inside VS Code vs External Terminal

We can execute Node.js programs using:

### External terminal

```bash
node app.js
```

### VS Code integrated terminal

```bash
node app.js
```

Both are essentially using the same underlying command-line environment.

The VS Code terminal is simply an **integrated terminal** inside the editor.

So:

```text
VS Code Terminal
        │
        └── runs → node app.js
                         │
                         ↓
                    Node.js
```

There is no separate version of Node.js specifically for the VS Code terminal.

---

# 🌍 5. The Global Object

Now we reach one of the most interesting concepts.

Every JavaScript environment provides some way to access values and APIs that are globally available.

But the global environment is **not exactly the same in every JavaScript runtime**.

In Node.js, the global object is:

```js
global
```

Try:

```js
console.log(global);
```

You'll see a large object containing many globally available properties and APIs.

---

# ⚙️ 6. Is `global` Part of V8?

This is an important distinction.

The Node.js `global` object should not be thought of as simply a feature of the V8 engine.

Node.js provides its own runtime environment around V8.

Conceptually:

```text
             Node.js
        ┌─────────────────┐
        │                 │
        │      V8         │
        │                 │
        │ JavaScript      │
        │    Engine       │
        │                 │
        ├─────────────────┤
        │ Node.js APIs    │
        │                 │
        │ global          │
        │ fs              │
        │ http             │
        │ process          │
        │ timers           │
        │ streams          │
        └─────────────────┘
```

So Node.js extends the capabilities available to JavaScript.

---

# ⏱️ 7. Node.js Global APIs

Node.js provides globally accessible APIs such as:

```js
setTimeout()
setInterval()
setImmediate()
```

For example:

```js
setTimeout(() => {
    console.log("Hello");
}, 2000);
```

Here JavaScript is using functionality provided by the Node.js runtime.

This reinforces an important idea from Episode 02:

> **V8 executes JavaScript, while the host runtime provides additional capabilities.**

---

# 🌐 8. Browser Global Object

The browser has a different environment.

In a browser, the global object is commonly accessed through:

```js
window
```

For example:

```js
window === this
```

In the browser's global execution context, this can evaluate to:

```text
true
```

The browser also exposes references such as:

```js
window
self
frames
```

which refer to the relevant global/window object in normal browser contexts.

---

# 🟢 9. Node.js `global` vs `this`

This is where Node.js behaves differently.

In a Node.js CommonJS module:

```js
console.log(global);
console.log(this);
```

These do **not** refer to the same object.

Conceptually:

```text
Node.js

global
  ↓
Node.js global object

this
  ↓
module-related context
```

At the top level of a CommonJS module, `this` is associated with the module's `exports` object rather than being the Node.js global object.

For example:

```js
console.log(this === global);
```

will give:

```text
false
```

This is an important difference from the browser's global context.

---

# 🤔 Why Isn't Node.js the Same as the Browser?

This creates an important question:

> **If both the browser and Node.js run JavaScript, why don't they have the same global object?**

Because **JavaScript itself does not define one universal host environment**.

ECMAScript defines the language.

The environment that hosts JavaScript can provide additional APIs and behavior.

So:

```text
             ECMAScript
                  │
          defines JavaScript
                  │
        ┌─────────┴─────────┐
        ↓                   ↓
     Browser              Node.js
        │                   │
        ↓                   ↓
     window              global
        │                   │
        ↓                   ↓
   Browser APIs        Node.js APIs
```

The language is JavaScript, but the **host environment is different**.

---

# 🌍 10. `globalThis` — A Common Global Reference

Having different global-object names across environments can be confusing.

For example:

```text
Browser → window
Node.js → global
```

So JavaScript introduced a standardized way to access the global object:

```js
globalThis
```

The idea is:

> **`globalThis` provides a standard way to access the global object across JavaScript environments.**

For example:

### Browser

```js
globalThis === window
```

### Node.js

```js
globalThis === global
```

This gives developers a more environment-independent way to refer to the global object.

---

# 🧩 Browser vs Node.js

A simplified comparison:

| Concept                   | Browser                            | Node.js      |
| ------------------------- | ---------------------------------- | ------------ |
| JavaScript engine         | V8 / SpiderMonkey / JavaScriptCore | V8           |
| Global object             | `window`                           | `global`     |
| Standard global reference | `globalThis`                       | `globalThis` |
| DOM                       | ✅                                  | ❌            |
| Browser APIs              | ✅                                  | ❌            |
| Node.js APIs              | ❌                                  | ✅            |
| Server-side capabilities  | Limited by browser security model  | ✅            |
| File-system access        | Restricted                         | ✅            |

The exact available APIs depend on the environment, but the important idea is:

> **JavaScript is the language; the runtime provides the environment in which that language operates.**

---

# 🧠 The Big Concept From This Episode

This episode helped connect several concepts from the previous episode.

We can now think about JavaScript execution like this:

```text
                   JavaScript
                       │
                       ↓
                ECMAScript Rules
                       │
                       ↓
                 JavaScript Engine
                       │
                       ↓
                      V8
                       │
                       ↓
                ┌──────────────┐
                │   Node.js    │
                │   Runtime    │
                ├──────────────┤
                │ Node APIs    │
                │ global       │
                │ fs           │
                │ http         │
                │ timers       │
                │ streams      │
                └──────────────┘
                       │
                       ↓
               Operating System
```

This is why saying:

> **"Node.js is JavaScript"**

isn't quite accurate.

A better explanation is:

> **Node.js is a runtime environment that uses the V8 JavaScript engine to execute JavaScript and provides additional APIs and capabilities outside the browser.**

---

# 🔥 One Important Question

At this point, another interesting question appears:

### If `setTimeout()` is available in Node.js, does V8 provide it?

Not exactly.

This is a question worth investigating further because it leads toward one of the most important Node.js concepts:

> **Which things come from V8, and which things come from Node.js?**

That question will eventually lead us toward:

```text
V8
 ↓
Node.js
 ↓
libuv
 ↓
Operating System
 ↓
Event Loop
 ↓
Asynchronous I/O
```

Understanding this boundary is essential for understanding Node.js **under the hood**.

---

# 🎯 Key Takeaways

### 🟢 Node.js

> A JavaScript runtime environment that uses V8 and provides additional APIs for running JavaScript outside the browser.

### ⚡ REPL

> **Read → Eval → Print → Loop**

An interactive environment for quickly experimenting with JavaScript.

### ⚙️ V8

> A JavaScript engine responsible for executing JavaScript.

### 🌍 `global`

> Node.js's global object in the Node.js environment.

### 🌐 `window`

> The browser's global/window object in the browser environment.

### 🔗 `globalThis`

> A standardized way to access the global object across JavaScript environments.

### 🧠 Most Important Idea

> **JavaScript is the language. V8 is an engine that executes it. Node.js is a runtime environment that embeds V8 and provides additional capabilities.**

---

# 📝 What I Learned

* 📦 Installing Node.js and npm
* ⚡ Node.js REPL
* 🔤 Meaning of REPL
* 💻 Running `app.js`
* 🖥️ Using the terminal
* 🌍 Node.js global object
* ⏱️ Global timer APIs
* 🌐 Browser `window`
* 🟢 Node.js `global`
* ⚖️ `global` vs `this`
* 🔗 `globalThis`
* ⚙️ V8 vs Node.js responsibilities
* 🌍 Differences between browser and Node.js environments
* 🧠 JavaScript runtime vs JavaScript engine

---

# 🚀 Progress

**Episode 00 — Welcome to Node.js** ✅
**Episode 01 — Introduction to Node.js** ✅
**Episode 02 — JavaScript on the Server** ✅
**Episode 03 — Let's Write Code** ✅

### Next → Episode 04 🚀
