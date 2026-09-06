//when we do require("./path")
//all the code of the module is weapped inside a function (IIFE)
//IIFE - Immediately Invoked Function Expression

const { calculateMultiply } = require("./multiply.js")//when we require this moduel all code of this module copy into the IIFE function and then execute thats why we cannot directly access the variable and function of another module
    //IIFE
    (function (module, require) {
        //all code of the module runs inside here
        function calculateMultiply(a, b) {
            const result = a * b;

            console.log(result);
        }

        module.exports = { calculateMultiply }
    })()//passed module and require as a prameter to the IIFE functio so we can access the module.export and require