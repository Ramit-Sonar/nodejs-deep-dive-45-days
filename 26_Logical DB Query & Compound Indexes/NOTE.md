# Episode 12 — Logical DB Queries & Compound Indexes

## 1. What Are Logical Queries?

Logical queries allow us to combine multiple conditions when searching for documents in MongoDB.

For example:

> Find users who are **male AND older than 18**.

MongoDB provides logical operators such as:

* `$and`
* `$or`
* `$not`
* `$nor`

These are useful when a query requires multiple conditions.

---

## 2. `$and` Operator

`$and` returns documents where **all conditions are true**.

### Syntax

```js
Model.find({
    $and: [
        { age: { $gt: 18 } },
        { gender: "male" }
    ]
});
```

This means:

```text
age > 18
AND
gender = male
```

### Example

```js
const users = await User.find({
    $and: [
        { age: { $gte: 18 } },
        { isActive: true }
    ]
});
```

Finds users who are:

* 18 or older
* AND active

### Important

In many cases, `$and` is not necessary because MongoDB automatically treats multiple fields as an **AND** condition.

Instead of:

```js
User.find({
    $and: [
        { age: { $gte: 18 } },
        { isActive: true }
    ]
});
```

We can simply write:

```js
User.find({
    age: { $gte: 18 },
    isActive: true
});
```

Both mean:

```text
age >= 18 AND isActive = true
```

---

## 3. `$or` Operator

`$or` returns documents where **at least one condition is true**.

### Syntax

```js
Model.find({
    $or: [
        { age: { $lt: 18 } },
        { role: "admin" }
    ]
});
```

This means:

```text
age < 18
OR
role = admin
```

### Example

```js
const users = await User.find({
    $or: [
        { role: "admin" },
        { role: "moderator" }
    ]
});
```

This finds users whose role is either:

* `admin`
* OR `moderator`

---

## 4. `$not` Operator

`$not` reverses the result of a condition.

### Example

```js
User.find({
    age: {
        $not: { $gt: 30 }
    }
});
```

This means:

```text
age is NOT greater than 30
```

So users with `age <= 30` can match.

### Important

`$not` is generally used with another query operator.

For example:

```js
{ age: { $not: { $gt: 30 } } }
```

---

## 5. `$nor` Operator

`$nor` returns documents where **none of the specified conditions are true**.

```js
User.find({
    $nor: [
        { role: "admin" },
        { isBlocked: true }
    ]
});
```

This means:

```text
NOT admin
AND
NOT blocked
```

---

# 6. Combining Logical Operators

Logical operators can be combined to create complex queries.

### Example

Find users who are:

* active
* AND either developers or designers

```js
User.find({
    isActive: true,
    $or: [
        { profession: "developer" },
        { profession: "designer" }
    ]
});
```

The query means:

```text
isActive = true
AND
(profession = developer OR profession = designer)
```

---

# 7. What Is an Index?

An **index** is a special data structure MongoDB creates to make searching documents faster.

Without an index, MongoDB may need to check many documents one by one.

```text
Without Index

Query
  ↓
Document 1 → Check
Document 2 → Check
Document 3 → Check
Document 4 → Check
...
Document 1,000,000 → Check
```

With a suitable index:

```text
Query
  ↓
Index
  ↓
Find matching documents faster
```

### Real-world example

Think about a book.

Without an index:

> Search every page to find "MongoDB".

With an index:

> Go directly to the relevant page.

MongoDB indexes work similarly.

---

# 8. Why Do We Need Indexes?

Indexes can significantly improve query performance, especially when a collection contains a large number of documents.

For example:

```js
User.find({ email: "ramit@gmail.com" });
```

If MongoDB has an index on `email`, it can find the matching document much more efficiently.

### But indexes have a cost

Indexes are not always free.

They:

* consume additional storage
* require maintenance when documents are inserted/updated/deleted
* can slow down writes if too many indexes are created

Therefore:

> Don't create indexes blindly. Create indexes based on actual query patterns.

---

# 9. Creating an Index in Mongoose

You can create an index in a Mongoose schema.

```js
const userSchema = new mongoose.Schema({
    email: String,
    age: Number
});

userSchema.index({ email: 1 });
```

`1` means **ascending order**.

`-1` means **descending order**.

```js
userSchema.index({ age: -1 });
```

---

# 10. What Is a Compound Index?

A **compound index** is an index created using **multiple fields**.

For example:

```js
userSchema.index({
    age: 1,
    gender: 1
});
```

This creates an index containing both:

```text
age + gender
```

### Why?

Suppose our application frequently runs:

```js
User.find({
    age: 20,
    gender: "male"
});
```

A compound index can help MongoDB efficiently handle this query.

---

# 11. Compound Index Syntax

```js
schema.index({
    field1: 1,
    field2: 1
});
```

Example:

```js
userSchema.index({
    age: 1,
    gender: 1
});
```

Here:

* `age: 1` → ascending
* `gender: 1` → ascending

---

# 12. Order Matters in Compound Indexes

The order of fields in a compound index is important.

Suppose we have:

```js
userSchema.index({
    age: 1,
    gender: 1
});
```

The index is ordered as:

```text
age → gender
```

MongoDB can efficiently use this index for queries involving:

```js
{ age: 20 }
```

and:

```js
{ age: 20, gender: "male" }
```

But a query only on:

```js
{ gender: "male" }
```

may not be able to use this compound index as efficiently.

This is related to the **ESR (Equality, Sort, Range)** guideline and the **prefix rule** for compound indexes.

---

# 13. Example — Search + Sort

Suppose our application frequently runs:

```js
User.find({
    age: 20,
    gender: "male"
}).sort({
    createdAt: -1
});
```

We may design an index around the actual query pattern:

```js
userSchema.index({
    age: 1,
    gender: 1,
    createdAt: -1
});
```

This allows MongoDB to use one index for the relevant filtering and sorting pattern.

**Important:** The correct index depends on the application's actual query workload. There is no single compound-index order that is best for every query.

---

# 14. Compound Index Example

### Schema

```js
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    gender: String
});

userSchema.index({
    age: 1,
    gender: 1
});
```

### Query

```js
const users = await User.find({
    age: 20,
    gender: "male"
});
```

MongoDB can use the compound index:

```text
age + gender
```

instead of relying only on a collection scan.

---

# 15. Checking Query Performance with `explain()`

MongoDB provides `explain()` to understand how a query is executed.

Example:

```js
db.users.find({
    age: 20,
    gender: "male"
}).explain("executionStats");
```

This can provide information such as:

* how the query was executed
* whether an index was used
* how many documents were examined
* how many documents were returned

### Important fields

```text
totalDocsExamined
totalKeysExamined
nReturned
```

If a query examines a very large number of documents to return only a few results, the query/index design may need improvement.

---

# 16. Collection Scan vs Index Scan

### Collection Scan

```text
COLLSCAN
```

MongoDB scans documents in the collection to find matching documents.

```text
Query
 ↓
Collection
 ↓
Document 1
Document 2
Document 3
...
```

### Index Scan

```text
IXSCAN
```

MongoDB uses an index to locate relevant documents.

```text
Query
 ↓
Index
 ↓
Matching documents
```

For selective queries on large collections, an appropriate index can greatly reduce the work MongoDB needs to do.

---

# 17. Unique Index

Indexes can also enforce uniqueness.

Example:

```js
userSchema.index(
    { email: 1 },
    { unique: true }
);
```

Now two users cannot have the same email.

Mongoose also commonly uses:

```js
email: {
    type: String,
    unique: true
}
```

Remember:

> `unique: true` creates a unique index; it is not normal Mongoose validation.

---

# 18. Logical Query + Index Example

Suppose we have:

```js
const userSchema = new mongoose.Schema({
    age: Number,
    gender: String,
    isActive: Boolean
});
```

And frequently query:

```js
User.find({
    isActive: true,
    $or: [
        { gender: "male" },
        { gender: "female" }
    ]
});
```

We should first understand the actual query workload before deciding which index is useful.

**Important:**

> An index should be designed based on the application's common queries, not simply because a field exists.

---

# 19. When Should We Create an Index?

Create an index when:

* a field is frequently searched
* a field is frequently used for sorting
* multiple fields are frequently queried together
* uniqueness needs to be enforced
* query performance becomes a bottleneck

Avoid creating indexes for every field because indexes also consume resources and increase write overhead.

---

# 20. Logical Operators Quick Reference

| Operator | Meaning                               |
| -------- | ------------------------------------- |
| `$and`   | All conditions must be true           |
| `$or`    | At least one condition must be true   |
| `$not`   | Negates a condition                   |
| `$nor`   | None of the conditions should be true |

---

# 21. Index Quick Reference

| Concept            | Meaning                                 |
| ------------------ | --------------------------------------- |
| Index              | Data structure used to speed up queries |
| Single-field index | Index on one field                      |
| Compound index     | Index on multiple fields                |
| `1`                | Ascending                               |
| `-1`               | Descending                              |
| `unique`           | Prevents duplicate indexed values       |
| `COLLSCAN`         | Collection scan                         |
| `IXSCAN`           | Index scan                              |
| `explain()`        | Helps analyze query execution           |

---

# 22. Important Difference

### Logical Query

Controls **which documents should match**.

```js
User.find({
    $or: [
        { age: 18 },
        { age: 19 }
    ]
});
```

### Index

Controls **how MongoDB can find those documents efficiently**.

```js
userSchema.index({
    age: 1
});
```

So:

```text
Logical Query → What data do I want?

Index → How can MongoDB find it efficiently?
```

---

# 23. Complete Example

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: String,
    age: Number,
    gender: String,
    isActive: Boolean
});

// Compound index
userSchema.index({
    age: 1,
    gender: 1
});

const User = mongoose.model("User", userSchema);

async function getUsers() {
    const users = await User.find({
        isActive: true,
        $or: [
            { gender: "male" },
            { gender: "female" }
        ],
        age: { $gte: 18 }
    });

    return users;
}
```

---

# Key Takeaways

* MongoDB provides logical operators to build complex queries.
* `$and` means **all conditions must match**.
* `$or` means **at least one condition must match**.
* `$not` reverses a condition.
* `$nor` means **none of the conditions should match**.
* An index helps MongoDB find data more efficiently.
* A compound index contains multiple fields.
* The order of fields in a compound index matters.
* Don't create indexes blindly.
* Use `explain("executionStats")` to analyze query performance.
* Indexes improve reads but require extra storage and can increase write overhead.

## Remember

```text
Logical Query
     ↓
Defines WHAT data we need

Index
     ↓
Helps MongoDB find that data efficiently
```

**Simple rule:**

> First understand your query pattern, then design the index around it.
