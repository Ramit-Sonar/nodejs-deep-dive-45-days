const fs = require("fs");
const crypto = require("crypto");

// libuv's thread pool has 4 worker threads by default.
// Each pbkdf2() operation is offloaded to the thread pool.

crypto.pbkdf2(
  "password",
  "salt",
  5000000,
  50,
  "sha512",
  (err, key) => {
    console.log("1 - cryptoPBKDF2 done");
  }
); // Assigned to the 1st available thread


crypto.pbkdf2(
  "password",
  "salt",
  5000000,
  50,
  "sha512",
  (err, key) => {
    console.log("2 - cryptoPBKDF2 done");
  }
); // Assigned to the 2nd available thread


crypto.pbkdf2(
  "password",
  "salt",
  5000000,
  50,
  "sha512",
  (err, key) => {
    console.log("3 - cryptoPBKDF2 done");
  }
); // Assigned to the 3rd available thread


crypto.pbkdf2(
  "password",
  "salt",
  5000000,
  50,
  "sha512",
  (err, key) => {
    console.log("4 - cryptoPBKDF2 done");
  }
); // Assigned to the 4th available thread


// The first 4 pbkdf2() operations can run concurrently
// because the default libuv thread pool has 4 worker threads.
//
// The 5th pbkdf2() operation cannot start immediately
// because all 4 worker threads are busy.
// It waits in the queue until one of the threads becomes free.
//
// Therefore, the 5th operation usually completes later
// than the first 4 operations.

crypto.pbkdf2(
  "password",
  "salt",
  5000000,
  50,
  "sha512",
  (err, key) => {
    console.log("5 - cryptoPBKDF2 done");
  }
); // Waits for an available thread


// fs.readFile("/file.txt", "utf8", () => {
//   console.log("File Reading CB");
// });