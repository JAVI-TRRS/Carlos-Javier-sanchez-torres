// Inicializar matriz de 50 alumnos y 5 columnas
let M = [];

// Generar datos aleatorios (solo ejemplo)
for (let i = 0; i < 50; i++) {
  let codigo = 1000 + i; 
  let c1 = +(Math.random() * 4 + 1).toFixed(1); 
  let c2 = +(Math.random() * 4 + 1).toFixed(1);
  let c3 = +(Math.random() * 4 + 1).toFixed(1);

  // Calcular calificación final como promedio
  let final = +((c1 + c2 + c3) / 3).toFixed(1);

  // Guardar fila en la matriz
  M.push([codigo, c1, c2, c3, final]);
}

// Variables contadoras
let aprobados = 0;
let recuperacion = 0;
let maximos = 0;

// Procesar la matriz
for (let i = 0; i < M.length; i++) {
  let final = M[i][4];

  if (final >= 3.0 && final <= 5.0) {
    aprobados++;
  } else if (final >= 2.0 && final <= 2.9) {
    recuperacion++;
  }

  if (final === 5.0) {
    maximos++;
  }
}

// Imprimir resultados
console.log("=== Resultados ===");
console.log("Cantidad de alumnos que aprobaron:", aprobados);
console.log("Cantidad de alumnos con derecho a recuperación:", recuperacion);
console.log("Cantidad de alumnos con nota máxima (5.0):", maximos);

