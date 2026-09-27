const express = require("express");

const app = express();
const PORT = 5000;

// Handle GET requests to the home route
app.get("/", (req, res) => {
    res.send("Hello from Express Server!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});