const http = require("http");

const server = http.createServer(function (req, res) {
  if (req.url === "/myname") {
    return res.end("Ramit Sonar");
  }

  res.end("Hello world!");
});

server.listen(7777, () => {
  console.log("Server running on http://localhost:7777");
});

/*
  req  → Request sent by the client
  res  → Response sent back to the client
  req.url → Requested URL/path
  res.end() → Sends data and ends the response

  Node.js HTTP module is a low-level way to create servers,
  and handling many routes/features manually can become complex.

  Express.js is a framework built on top of Node.js that
  makes HTTP server and API development easier and more structured.
*/