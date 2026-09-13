const crypto = require("crypto");
console.log('Hello World');

const a = 10;
const b = 20;

//pbkdf = password base key derivative function 

//synchronous => it will block will bolck main thread - don't use it
crypto.pbkdf2Sync("anypassword", "salt", 5000000, 50, "sha512")//sync function never have callback function 
console.log('First key is Generated');

setTimeout(() => {
    console.log('call me right now !!!!');
}, 0); // it will only be called once call stack of main thread is empty


// Async Function 
crypto.pbkdf2("anypassword", "salt", 500000, 50, "sha512", (err, key) => {
    console.log('second key is generated', key);
})

function muntiplyFn(x, y) {
    const result = a * b;
    return result;
}

var c = muntiplyFn(a, b);

console.log('multiplication result is : ', c);