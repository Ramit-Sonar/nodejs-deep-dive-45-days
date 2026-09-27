
const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Regex route: matches paths ending with "fly"
app.use(/.*fly$/, (req, res) => {
    res.send("Matched a path ending with fly");
});

// 2. Basic middleware: matches paths starting with "/user"
app.use("/user", (req, res) => {
    res.send("HAHAHHAHAHAHAHA");
});

// 3. *: zero or more occurrences of the previous character
app.use("/ab*c", (req, res) => {
    res.send("Matched /ac, /abc, /abbc, etc.");
});

// 4. +: one or more occurrences of the previous character
app.use("/ab+c", (req, res) => {
    res.send("Matched /abc, /abbc, /abbbc, etc.");
});

// 5. GET route: reads query parameters
app.get("/user", (req, res) => {
    console.log(req.query);
    res.send({ firstname: "Ramit", lastname: "Sonar" });
});

// 6. Dynamic route: reads URL parameters
app.get("/user/:userId/:name/:password", (req, res) => {
    console.log(req.params);
    res.send({ firstname: "Ramit", lastname: "Sonar" });
});

// 7. POST route: handles data submission
app.post("/user", (req, res) => {
    res.send("Data saved successfully in database");
});

// 8. DELETE route: handles data deletion
app.delete("/user", (req, res) => {
    res.send("Data deleted successfully");
});

// 9. Middleware: handles requests starting with "/test"
app.use("/test", (req, res) => {
    res.send("Hello from the server!");
});

// 10. Middleware: handles requests starting with "/hello/h2"
app.use("/hello/h2", (req, res) => {
    res.send("Hello Hello Hello from h2!");
});

// 11. Middleware: handles requests starting with "/hello"
app.use("/hello", (req, res) => {
    res.send("Hello Hello Hello!");
});

// 12. Root middleware: catches remaining requests
app.use("/", (req, res) => {
    res.send("Hello From the Dashboard");
});

// Start the server and listen for requests
app.listen(PORT, () => {
    console.log(`Server is successfully listening on port ${PORT}`);
});