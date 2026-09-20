const http = require("http");

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);

  res.writeHead(200, {
    "Content-Type": "text/plain",
  });

  if (req.url === "/") {
    res.end("Welcome to Node.js Server!");
  } else if (req.url === "/about") {
    res.end("This is the About page.");
  } else {
    res.writeHead(404);
    res.end("Page Not Found!");
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});