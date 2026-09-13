console.log('Hello World');

const a = 10;
const b = 20;

//this call back will only be pushed to call stack in v8 once the callstack is empty
setTimeout(() => {
    console.log('call me right now');
}, 0); //trust issues with settimeout => it doesnot execute after 0 ms, it execute after 0 ms after when callstack is empty

setTimeout(() => {
    console.log('setTimeout called after 5 second');
}, 5000);


function muntiplyFn(x, y) {
    const result = a * b;
    return result;
}

var c = muntiplyFn(a, b);

console.log('multiplication result is : ', c);
