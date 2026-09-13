const fs = require("fs");
const https = require("https");

console.log('Hello world');

var a = 10;
var b = 20;

//synchronous ==> this function will actually block the main thread
fs.readFileSync("./file.txt", "utf8");//this is never use 
console.log('This will execute only after file read');


https.get("https://dummyjson.com/products", (res) => {
    console.log('Fetched Data Successfully from api');
});

setTimeout(() => {
    console.log('setTimeout called after 5 second');
}, 5000);


//Async Function 
fs.readFile("./file.txt", "utf8", (err, data) => {
    console.log('File Data :', data);
});

function muntiplyFn(x, y){
    const result = a * b;
    return result;
}

var c = muntiplyFn(a, b);

console.log('multiplication result is : ', c);

