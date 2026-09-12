const fs = require("fs");
const https = require("https");

console.log('Hello world');

var a = 10;
var b = 20;

https.get("https://dummyjson.com/products", (res) => {
    console.log('Fetched Data Successfully from api');
});

setTimeout(() => {
    console.log('setTimeout called after 5 second');
}, 5000);

fs.readFile("./file.txt", "utf8", (err, data) => {
    console.log('File Data :', data);
});

function muntiplyFn(x, y){
    const result = a * b;
    return result;
}

var c = muntiplyFn(a, b);

console.log('multiplication result is : ', c);

