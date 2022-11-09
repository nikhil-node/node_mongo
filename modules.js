// console.log(arguments);
// console.log(require('module').wrapper);
const calc = require('./test-module');

const addCalc = new calc();

console.log(addCalc.add(5,5));
console.log(addCalc.multiply(5,5));
console.log(addCalc.division(5,5));

const calc2 = require('./test-module2');

console.log(calc2.add(3,4));
console.log(calc2.multiply(3,4));
console.log(calc2.division(3,4));

