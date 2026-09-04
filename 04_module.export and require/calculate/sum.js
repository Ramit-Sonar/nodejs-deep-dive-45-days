//modules protectes their variables and function from leaking

console.log('sum module executed');

let x = "hello world"

function calculateSum(a, b) {
    const sum = a + b;
    console.log('sum is: ', sum);
}

console.log(module.exports);//this is empty object 

module.exports = { x, calculateSum }
// export { calculateSum, x };//to give access of private variable and function of this module we need to export our function like this

// module.exports.x = x;
// module.exports.calculateSum = calculateSum;