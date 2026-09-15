const fs = require("fs");

setImmediate(() => console.log('setImmediate'));

setTimeout(() => {
    console.log('Timer Expired');
}, 0);

Promise.resolve()
    .then(() => console.log('promise'));

fs.readFile("./file.txt", "utf8", (res) => {
    console.log('File Reading CB');
});


process.nextTick(() => {
    process.nextTick(() => console.log('inner nextTick'));
    console.log('nextTick');
    setTimeout(() => {
    console.log('Timer Expired 2');
}, 0);
    
});


console.log('Last line of the file.');

/**OUTPUT
 * Last line of the file
 * nextTick
 * inner nextTick
 * promise
 * Timer Expired
 * Timer Expired 2
 * setImmediate
 * File Reading CB
 */