const fs = require("fs");

setImmediate(() => console.log('setImmediate'));

setTimeout(() => {
    console.log('Timer expired');
}, 0);

Promise.resolve().then(() => console.log("Promise"));

fs.readFile("./file.txt", "utf8", () => {
    setTimeout(() => {
        console.log('2nd timer');
    }, 0);

    process.nextTick(() => console.log('2nd nextTick'));

    setImmediate(() => console.log('2nd setImmediate'));

    console.log('File Reading CB');

})

process.nextTick(() => console.log('nextTick'));

console.log('Last line of the file.');

//........output............
//Last line of the file
//nextTick
//Time expired
//setImmediate
//File Reading CB
//2nd nextTick
//2nd setImmediate
//2nd timer


//Event loop waits in pool phase so the insted of 2nd timer,2nd setImmediate runs first 