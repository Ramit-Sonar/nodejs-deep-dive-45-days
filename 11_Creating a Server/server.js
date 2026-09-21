const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  // Parse URL and query parameters
  const parsedUrl = url.parse(req.url, true);

  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`Request: ${req.method} ${req.url}`);

  // Common response header
  res.setHeader("Content-Type", "text/plain");

  // Home route
  if (path === "/" && req.method === "GET") {
    res.writeHead(200);
    res.end("Welcome to Node.js Server!");
  }

  // About route
  else if (path === "/about" && req.method === "GET") {
    res.writeHead(200);
    res.end("This is the About page.");
  }

  // User route with query parameter
  else if (path === "/user" && req.method === "GET") {
    res.writeHead(200);
    res.end(`Hello, ${query.name || "Guest"}!`);
  }

  // API route
  else if (path === "/api" && req.method === "GET") {
    const data = {
      message: "API is working!",
      status: "success",
      server: "Node.js",
    };

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(data));
  }

  // Contact route
  else if (path === "/contact" && req.method === "GET") {
    res.writeHead(200);
    res.end("Contact us at contact@example.com");
  }

  // Page not found
  else {
    res.writeHead(404);
    res.end("404 - Page Not Found!");
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});