// vector
let vector = [];
for (let i = 1 ; i <= 500; i ++ ) {vector.push (i);}
let almacenar = vector.map(num => num ** 2);

console.log("El vector original es:", vector);
console.log("El vector elevado al cuadrado es:", almacenar);