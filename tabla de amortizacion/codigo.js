const tabla = document.getElementById("bodyResultados");

class Deuda {
  constructor(monto, tasaInteres, plazo){
    this.monto = monto;
    this.tasaInteres = tasaInteres;
    this.plazo = plazo;

    this.deudas = [];
  }

  //Setters
  set_monto (monto){ this.monto = monto; }
  set_tasaInteres (tasaInteres){ this.tasaInteres = tasaInteres; }
  set_plazo (plazo){ this.plazo = plazo; }

  //Getters
  get_monto () { return this.monto; }
  get_tasaInteres () { return this.tasaInteres; }
  get_plazo () { return this.plazo; }

  calcularCuota () { }

}

class DeudaAmortizable extends Deuda {

  calcularCuota () {

    let periodosPorAño = 12;

    let interesDecimal = this.get_tasaInteres() / 100;

    let cantidadMeses = this.get_plazo();

    let valor = this.get_monto();

    let tazaMensual = interesDecimal / periodosPorAño;

    let saldoAnterior = valor;

    for (let i = 0; i < cantidadMeses; i++) {

      let mes = i+1;

      let cuota = ((( interesDecimal / periodosPorAño)*(1 + interesDecimal / periodosPorAño)**cantidadMeses)/(((1 + interesDecimal / periodosPorAño)**cantidadMeses)-1))*valor;

      let interes = saldoAnterior * tazaMensual;

      let capital = cuota - interes; 

      let saldo = saldoAnterior - capital;

      cuota = parseFloat(cuota.toFixed(2));
      interes = parseFloat(interes.toFixed(2));
      capital = parseFloat(capital.toFixed(2));
      saldo = parseFloat(saldo.toFixed(2));

      if (saldo < 0) {
        saldo = 0;
        break;
      }

      let deuda = {
        mes: mes,
        cuota: cuota,
        interes: interes,
        capital: capital,
        saldo: saldo
      };

      this.deudas.push(deuda);
 
      saldoAnterior = saldo;
    }   

  }

  generarTablaAmortizacion () {


    this.deudas.forEach((deuda, posicion) => {

      let mensaje = `
        <tr>
          <td>${deuda.mes}</td>
          <td>${deuda.cuota}</td>
          <td>${deuda.interes}</td>
          <td>${deuda.capital}</td>
          <td>${deuda.saldo}</td>
        </tr>
      `;


      resultados.innerHTML += mensaje;
      
    });

  }

}

//Elementos html
const boton = document.getElementById("form__button");
const input1 = document.getElementById("monto");
const input2 = document.getElementById("tasa__interes");
const input3 = document.getElementById("plazo");

const advertencias = document.getElementById("mensajes");
const resultados = document.getElementById("bodyResultados");

boton.addEventListener("click", (event) => {
  event.preventDefault();
  inicial();
})

function inicial () {

  let monto = parseFloat(input1.value);
  let tasaInteres = parseFloat(input2.value);
  let plazo = parseInt(input3.value);


  if(isNaN(monto) || isNaN(tasaInteres) || isNaN(plazo)) {

    advertencias.innerHTML = "Por favor Ingrese un valor en todos los campos!";
    return;

  }

  if (monto < 0){
    advertencias.innerHTML = "El monto debe ser mayor a 0.!";
    return;
  }

  if (tasaInteres < 0 || tasaInteres > 100){
    advertencias.innerHTML = "Por favor Ingrese un valor entre 0 y 100 en la Tasa de Interes";
    return;
  }

  if (plazo <= 0) {
    advertencias.innerHTML = "El plazo debe ser mayor a 0 meses.";
    return;
  }

  if (!Number.isInteger(plazo)) {
    advertencias.innerHTML = "El plazo debe ser un número entero.";
    return;
  }

  if (plazo > 480) {
    advertencias.innerHTML = "El plazo no puede superar los 480 meses.";
    return;
  }

  advertencias.innerHTML = "";
  resultados.innerHTML = "";

  let deuda = new DeudaAmortizable(monto, tasaInteres, plazo);

  deuda.calcularCuota();

  deuda.generarTablaAmortizacion();

}


