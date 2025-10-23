let Num;

Num = parseFloat(prompt("Digite un número:"));

if (isNaN(Num)) {
    console.log("Digite un dato válido.");
} else {
    if (Num < 0) {
        Num = -Num;
    }
    console.log("El valor absoluto es:", Num);
}
