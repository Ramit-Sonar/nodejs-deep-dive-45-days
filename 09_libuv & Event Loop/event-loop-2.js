const fs = require("fs");
const a = 100;

setImmediate(() => console.log('setImmediate'));

Promise.resolve()
    .then(() => console.log('promise'));

fs.readFile("./file.txt", "utf8", (res) => {
    console.log('File Reading CB');
});

setTimeout(() => {
    console.log('Timer Expired');
}, 10);

process.nextTick(() => console.log('process.nextTick'));


function prindA() {
    console.log('a=', a);
}

prindA();
console.log('Last line of the file.');

//output
//a=100
//Last line of the file
//process.nextTick
//Promise
//Timer Expired
//setImmediate
//File Reading CB



