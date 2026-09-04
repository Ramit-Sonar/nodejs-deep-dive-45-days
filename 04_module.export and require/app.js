// import "./xyz.js" // one module into another module
// import { calculateSum, x } from "./sum.js";

require("./xyz.js");
// const { calculateSum, x } = require("./calculate/sum.js");
// const { calculateMultiply } = require("./calculate/multiply.js")

const {calculateMultiply , calculateSum} = require("./calculate")
const data = require("./data.json");
const util = require("node:util");

let a = 10;

let b = 20;

c = 10;//this is also valid because commonJS module runs on non strict mode 

calculateSum(a, b);
calculateMultiply(a, b)
console.log(data)

// console.log(x);
