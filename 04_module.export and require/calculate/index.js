const { calculateMultiply } = require("./multiply.js");
const { calculateSum } = require("./sum.js");

module.exports = { calculateMultiply, calculateSum }

//the folder calculate become the another module and we can directly import these function from ./calculate