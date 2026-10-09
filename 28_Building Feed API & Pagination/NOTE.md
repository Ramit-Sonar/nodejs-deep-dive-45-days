# Episode 14 — Building Feed API & Pagination

## 1. What Is a Feed API?

A **Feed API** returns a list of content that should be displayed to users.

Examples:

* Social media posts
* Connection suggestions
* Products
* Jobs
* News
* Videos
* Notifications

For example:

```http
GET /feed
```

The API might return:

```json
{
    "success": true,
    "data": [
        {
            "name": "Ramit",
            "post": "Learning Node.js"
        },
        {
            "name": "John",
            "post": "Learning MongoDB"
        }
    ]
}
```

---

# 2. The Problem With Large Data

Suppose our database contains:

```text
1,000,000 posts
```

If we do:

```js
Post.find();
```

MongoDB may need to return a huge amount of data.

This can cause:

* Slow API response
* High memory usage
* Large network response
* Slow frontend rendering
* Poor user experience

Instead of returning everything, we return data in **small portions**.

This is called **pagination**.

---

# 3. What Is Pagination?

Pagination means dividing a large dataset into smaller parts called **pages**.

For example:

```text
Total Posts = 100

Page 1 → Posts 1–10
Page 2 → Posts 11–20
Page 3 → Posts 21–30
...
```

Instead of:

```text
100 posts → one API response
```

we return:

```text
10 posts → one API response
```

---

# 4. Why Do We Need Pagination?

Pagination helps:

* Reduce response size
* Reduce database work
* Reduce network usage
* Improve frontend performance
* Improve user experience
* Handle large datasets

### Simple idea

```text
Without Pagination

Database
   ↓
100,000 records
   ↓
API
   ↓
Huge Response
   ↓
Slow


With Pagination

Database
   ↓
100,000 records
   ↓
Only 10 records
   ↓
API
   ↓
Small Response
   ↓
Fast
```

---

# 5. Two Common Pagination Approaches

The two common approaches are:

1. **Page-based pagination**
2. **Cursor-based pagination**

For beginner applications, page-based pagination is easy to understand and implement.

---

# 6. Page-Based Pagination

The client sends:

```text
page
limit
```

Example:

```http
GET /feed?page=2&limit=10
```

Meaning:

```text
Page = 2
Items per page = 10
```

---

# 7. Understanding `skip()` and `limit()`

MongoDB/Mongoose provides:

```js
.skip()
.limit()
```

### `limit()`

Controls how many documents should be returned.

```js
Post.find()
    .limit(10);
```

Returns at most 10 documents.

### `skip()`

Controls how many documents should be skipped before returning results.

```js
Post.find()
    .skip(10)
    .limit(10);
```

This skips the first 10 documents and returns the next 10.

---

# 8. Pagination Formula

For page-based pagination:

```text
skip = (page - 1) × limit
```

### Example

Suppose:

```text
page = 1
limit = 10
```

Then:

```text
skip = (1 - 1) × 10
     = 0
```

Page 1:

```text
skip 0
limit 10
```

---

### Page 2

```text
skip = (2 - 1) × 10
     = 10
```

```text
skip 10
limit 10
```

---

### Page 3

```text
skip = (3 - 1) × 10
     = 20
```

```text
skip 20
limit 10
```

---

# 9. Basic Pagination Example

```js
const page = 2;
const limit = 10;

const skip = (page - 1) * limit;

const posts = await Post.find()
    .skip(skip)
    .limit(limit);
```

Flow:

```text
page = 2
limit = 10

        ↓

skip = (2 - 1) × 10
     = 10

        ↓

skip(10)
limit(10)

        ↓

Return posts 11–20
```

---

# 10. Getting Pagination Parameters From the Client

The client can send pagination information through query parameters.

Example:

```http
GET /feed?page=2&limit=10
```

Access them using:

```js
req.query
```

Example:

```js
const { page, limit } = req.query;
```

Remember:

> Query parameters arrive as strings.

So:

```js
page = "2"
limit = "10"
```

It is better to convert and validate them before using them in database operations.

---

# 11. Validate Pagination Parameters

Never blindly trust client input.

Bad:

```js
const page = req.query.page;
const limit = req.query.limit;
```

Better:

```js
const page = Math.max(
    parseInt(req.query.page) || 1,
    1
);

const limit = Math.min(
    Math.max(parseInt(req.query.limit) || 10, 1),
    50
);
```

Now:

* Minimum page = `1`
* Default page = `1`
* Default limit = `10`
* Minimum limit = `1`
* Maximum limit = `50`

### Why limit the maximum?

Without a maximum, someone could request:

```http
GET /feed?limit=1000000
```

which could create unnecessary database and server load.

---

# 12. Building a Feed API

Suppose we have a `User` model and want to build a feed containing users.

For example:

```http
GET /feed?page=1&limit=10
```

Controller:

```js
const getFeed = async (req, res) => {

    const page = Math.max(
        parseInt(req.query.page) || 1,
        1
    );

    const limit = Math.min(
        Math.max(parseInt(req.query.limit) || 10, 1),
        50
    );

    const skip = (page - 1) * limit;

    const users = await User.find()
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        success: true,
        message: "Feed fetched successfully",
        data: users
    });
};
```

---

# 13. Why Sorting Is Important

Pagination should usually use a **stable and predictable order**.

For example:

```js
User.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
```

This means:

```text
Sort by createdAt
Newest → Oldest
```

Without a defined sort order, the order of documents returned by a query should not be assumed to be stable.

---

# 14. Example Feed Query

```js
const users = await User.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
```

Flow:

```text
Database
   ↓
Sort newest → oldest
   ↓
Skip previous records
   ↓
Take required records
   ↓
Return feed
```

---

# 15. Excluding the Logged-In User

In a social application, we may not want to show the current user in their own feed.

For example:

```js
const users = await User.find({
    _id: { $ne: req.user._id }
})
.sort({ createdAt: -1 })
.skip(skip)
.limit(limit);
```

`$ne` means:

> Not equal to.

So this query means:

```text
Find users whose _id is NOT equal to the logged-in user's _id.
```

---

# 16. Feed API With Authentication

A private feed might look like:

```js
router.get(
    "/feed",
    userAuth,
    getFeed
);
```

Flow:

```text
Client
  ↓
GET /feed?page=1&limit=10
  ↓
Authentication Middleware
  ↓
Identify Logged-in User
  ↓
Feed Controller
  ↓
Database Query
  ↓
Pagination
  ↓
Response
```

---

# 17. Better API Response

Instead of returning only the data:

```json
{
    "data": []
}
```

we can return useful pagination information.

Example:

```json
{
    "success": true,
    "message": "Feed fetched successfully",
    "data": [],
    "pagination": {
        "page": 1,
        "limit": 10,
        "hasMore": true
    }
}
```

This helps the frontend understand whether it should request another page.

---

# 18. Using `countDocuments()`

Sometimes the frontend needs to know how many records exist.

We can use:

```js
const total = await User.countDocuments({
    _id: { $ne: req.user._id }
});
```

Then calculate:

```js
const totalPages = Math.ceil(total / limit);
```

Example:

```text
Total = 100
Limit = 10

Total Pages = 100 / 10
            = 10
```

Response:

```json
{
    "pagination": {
        "page": 2,
        "limit": 10,
        "total": 100,
        "totalPages": 10
    }
}
```

---

# 19. `hasMore`

For infinite scrolling, we often don't need the exact total number of pages.

We mainly need:

> Is there more data?

Example:

```js
const hasMore = skip + users.length < total;
```

Then:

```json
{
    "pagination": {
        "page": 2,
        "limit": 10,
        "hasMore": true
    }
}
```

If:

```text
hasMore = false
```

the frontend knows there is no more data to load.

---

# 20. Complete Page-Based Feed API

```js
const getFeed = async (req, res) => {

    const page = Math.max(
        parseInt(req.query.page) || 1,
        1
    );

    const limit = Math.min(
        Math.max(parseInt(req.query.limit) || 10, 1),
        50
    );

    const skip = (page - 1) * limit;

    const filter = {
        _id: { $ne: req.user._id }
    };

    const [users, total] = await Promise.all([
        User.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

        User.countDocuments(filter)
    ]);

    const hasMore = skip + users.length < total;

    res.status(200).json({
        success: true,
        message: "Feed fetched successfully",

        data: users,

        pagination: {
            page,
            limit,
            total,
            hasMore
        }
    });
};
```

### Why `Promise.all()`?

These two database operations are independent:

```js
User.find(...)
User.countDocuments(...)
```

They don't need to wait for each other.

`Promise.all()` allows them to run concurrently.

---

# 21. Page-Based Pagination vs Infinite Scrolling

### Page-Based Navigation

Example:

```text
Page 1
Page 2
Page 3
Page 4
```

Frontend provides page controls.

Common for:

* Admin dashboards
* Tables
* Search results
* Management systems

---

### Infinite Scrolling

Example:

```text
Load Page 1
      ↓
User scrolls
      ↓
Load Page 2
      ↓
User scrolls
      ↓
Load Page 3
      ↓
...
```

Common for:

* Social media feeds
* Product feeds
* News feeds
* Video feeds

The backend can still use pagination.

---

# 22. What Is Cursor-Based Pagination?

For very large or frequently changing datasets, another approach is **cursor-based pagination**.

Instead of:

```http
GET /feed?page=3
```

we can use a cursor:

```http
GET /feed?cursor=665ab123&limit=10
```

The cursor represents where the next query should continue.

For example, if sorting by `_id` or `createdAt`, we can query records after the last item from the previous response.

---

# 23. Why Cursor Pagination?

Page-based pagination uses:

```js
.skip()
.limit()
```

For very large offsets, large `skip()` values can become inefficient because MongoDB may still need to walk past many records.

Cursor-based pagination can avoid large offsets by using an indexed field to continue from a known position.

Conceptually:

```text
Page-based:

skip 1,000,000
     ↓
then return 20


Cursor-based:

start after this indexed value
     ↓
return next 20
```

Cursor pagination is especially useful for:

* Large feeds
* Infinite scrolling
* Frequently changing data
* High-scale applications

---

# 24. Basic Cursor Example

Suppose posts are sorted by `_id` descending.

First request:

```http
GET /feed?limit=10
```

Response contains the last item's `_id`:

```json
{
    "data": [...],
    "nextCursor": "665ab123"
}
```

Next request:

```http
GET /feed?limit=10&cursor=665ab123
```

Query concept:

```js
Post.find({
    _id: { $lt: cursor }
})
.sort({ _id: -1 })
.limit(limit);
```

This continues from the previous position.

### Important

Cursor pagination requires careful ordering and an appropriate index. The cursor field should provide a stable ordering.

---

# 25. Pagination Performance

When designing a feed API, think about:

### 1. Indexing

If frequently sorting by:

```js
createdAt
```

consider an appropriate index:

```js
postSchema.index({
    createdAt: -1
});
```

### 2. Select only required fields

Instead of:

```js
User.find();
```

consider:

```js
User.find()
    .select("firstName lastName photo");
```

### 3. Limit maximum page size

Don't allow:

```text
limit = 1,000,000
```

Use a reasonable maximum.

### 4. Use stable sorting

Always define how the feed should be ordered.

---

# 26. Pagination and Indexes

Suppose we frequently run:

```js
Post.find({
    category: "technology"
})
.sort({
    createdAt: -1
})
.limit(20);
```

We should consider an index designed around this query:

```js
postSchema.index({
    category: 1,
    createdAt: -1
});
```

The exact index should be chosen based on the application's actual query patterns and workload.

---

# 27. Common Mistakes

### Mistake 1 — Returning everything

```js
Post.find();
```

For a large collection, this can create unnecessarily large responses.

---

### Mistake 2 — No maximum limit

```js
const limit = parseInt(req.query.limit);
```

A client could request an extremely large number.

Always validate and cap it.

---

### Mistake 3 — No sorting

Pagination without a clear ordering can lead to inconsistent results.

Prefer:

```js
.sort({ createdAt: -1 })
```

or another stable ordering appropriate to the use case.

---

### Mistake 4 — Trusting query parameters

Remember:

```js
req.query.page
req.query.limit
```

come from the client.

Validate them.

---

### Mistake 5 — Using huge `skip()` values

For very large datasets, offset/page-based pagination can become less efficient.

Consider cursor-based pagination when scale requires it.

---

# 28. API Design Thought Process

When creating a feed API, ask:

```text
1. What data should the feed contain?
        ↓
2. Who can access the feed?
        ↓
3. What filters are required?
        ↓
4. What should the sorting order be?
        ↓
5. How many records should be returned?
        ↓
6. How will pagination work?
        ↓
7. What fields does the frontend actually need?
        ↓
8. Which indexes support the query?
        ↓
9. How will errors be handled?
        ↓
10. What response structure should the frontend receive?
```

---

# 29. Complete Request Flow

```text
Client
   ↓
GET /feed?page=1&limit=10
   ↓
Authentication Middleware
   ↓
Validate Query Parameters
   ↓
Calculate Pagination
   ↓
Database Query
   ↓
Apply Filter
   ↓
Apply Sort
   ↓
Apply Pagination
   ↓
Return Data + Pagination Info
   ↓
Client
```

---

# Key Takeaways

* A Feed API returns a collection of content/data for the client.
* Don't return huge datasets in a single response.
* Pagination divides data into smaller chunks.
* Page-based pagination commonly uses `page`, `limit`, `skip()`, and `limit()`.
* Formula:

```text
skip = (page - 1) × limit
```

* Always validate pagination parameters.
* Set a maximum `limit`.
* Use a stable and predictable sort order.
* `countDocuments()` can be used when total count is needed.
* `hasMore` is useful for infinite scrolling.
* Cursor-based pagination can be more efficient for very large or frequently changing feeds.
* Indexes should support the actual filter and sort patterns.
* Return only the fields the frontend actually needs.

## Remember

```text
Feed API
   ↓
Large Dataset
   ↓
Pagination
   ↓
Small Response
   ↓
Better Performance
   ↓
Better User Experience
```

### Page-Based Pagination

```text
page + limit
     ↓
skip + limit
     ↓
Easy to implement
```

### Cursor-Based Pagination

```text
cursor + limit
     ↓
Continue from previous position
     ↓
Better suited for large feeds
```

> **Good pagination is not just about dividing data into pages. It is about retrieving the right amount of data, in a predictable order, with queries that remain efficient as the dataset grows.**
