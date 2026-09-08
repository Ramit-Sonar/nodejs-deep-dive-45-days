```js
// When we do require("./path"):
//
// Node.js loads the module and wraps its code inside a function wrapper.
//
// IIFE = Immediately Invoked Function Expression


const { calculateMultiply } = require("./multiply.js");


// --------------------------------------------------
// Behind the scenes:
// --------------------------------------------------

// Node.js wraps the module code like this:

(function (exports, require, module, __filename, __dirname) {

    // All the code of the module runs inside here

    function calculateMultiply(a, b) {
        const result = a * b;

        console.log(result);
    }

    module.exports = { calculateMultiply };

})();


// --------------------------------------------------
// Why can we use module.exports and require?
// --------------------------------------------------

// Node.js passes these as parameters to the wrapper function:
//
// exports
// require
// module
// __filename
// __dirname
//
// That's why we can use:
//
// module.exports
// require("./path")
// __filename
// __dirname


// --------------------------------------------------
// Important:
// --------------------------------------------------

// The code of one module is NOT directly accessible
// from another module.
//
// We use module.exports to export something:
//
// module.exports = { calculateMultiply };
//
// And require() to import it:
//
// const { calculateMultiply } = require("./multiply.js");
```
