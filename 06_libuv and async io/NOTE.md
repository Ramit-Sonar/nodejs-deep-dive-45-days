# 🎬 Episode 06 — libuv & I/O

> **Starting Point:** Node.js has an **event-driven architecture** capable of **asynchronous I/O**.

---

## 🔄 Synchronous vs Asynchronous

| Synchronous                          | Asynchronous                                        |
| ------------------------------------ | --------------------------------------------------- |
| Tasks execute one after another      | Tasks can continue without waiting                  |
| Next task waits for the current task | Program can continue while a task is being handled  |
| Blocking                             | Non-blocking                                        |
| Example: normal JavaScript execution | Example: file reading, database, API request, timer |

### 🖼️ Synchronous Programming

![Synchronous Programming](./images/synchronous.jpeg)

### 🖼️ Asynchronous Programming

![Asynchronous Programming](./images/asynchronous.jpeg)

---

## 🟨 How Synchronous JavaScript Executes

JavaScript execution is **synchronous by default**.

JavaScript code is executed by the **V8 engine**.

```js
console.log("First");
console.log("Second");
console.log("Third");
```

Execution:

```text
First
  ↓
Second
  ↓
Third
```

### V8 Engine

```text
JavaScript Code
      ↓
  V8 Engine
      │
  ┌───┴────────────┐
  ↓                ↓
Call Stack    Garbage Collector
  │
  ↓
Executes JavaScript
```

### 🖼️ V8 Synchronous Execution

![How Synchronous JavaScript Executes](./images/v8-sync-execution.jpeg)

---

## ⚡ Why Does JavaScript Need Node.js?

V8 can execute JavaScript, but JavaScript applications also need to perform operations such as:

* 📁 Reading files
* 🗄️ Database operations
* 🌐 API/network requests
* ⏱️ Timers

The **V8 engine alone cannot provide all these runtime capabilities**.

This is where **Node.js** comes in.

---

# 🚀 Node.js + V8 + libuv

Node.js provides the runtime environment around V8.

One important component that gives Node.js asynchronous I/O capabilities is **libuv**.

### 🧠 What is libuv?

**libuv is a cross-platform library used by Node.js for asynchronous I/O and event-loop infrastructure.**

It helps Node.js communicate with the **Operating System (OS)** and handle asynchronous operations.

---

## 🔗 Node.js, V8, libuv & OS

```text
              Node.js
        ┌─────────────────┐
        │                 │
        │   V8 Engine     │
        │   JS Execution  │
        │                 │
        │       ↕         │
        │      libuv      │
        │                 │
        └────────┬────────┘
                 ↕
        Operating System
```

### 🖼️ Node.js + V8 + libuv + OS

![Node.js V8 libuv OS](./images/nodejs-v8-libuv-os.jpeg)

---

# 🔄 How Asynchronous Work Happens

When JavaScript encounters an asynchronous operation, Node.js can offload the operation from the JavaScript execution flow.

```text
JavaScript Code
      ↓
   V8 Engine
      ↓
Async Operation
      ↓
    libuv
      ↓
Operating System
      ↓
    Result
      ↓
    libuv
      ↓
 V8 / JavaScript
```

### 🖼️ Asynchronous Task Workflow

![How Asynchronous Task Runs](./images/async-task-workflow.jpeg)

---

## 🧠 Mental Model

```text
JavaScript
    ↓
   V8
    ↓
 Node.js
    ↓
  libuv
    ↓
Operating System
    ↓
 Result
    ↓
JavaScript
```

> **V8 executes JavaScript. Node.js provides the runtime environment, while libuv is a key part of Node.js's asynchronous I/O infrastructure.**

---

## ❓ Next Question

If JavaScript execution is synchronous, **how does libuv actually handle asynchronous operations?**

➡️ Next: **libuv → I/O → Event Loop → asynchronous execution**
