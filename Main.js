function calcularPagoCuotas(montoTotal, numeroCuotas, tasaInteres) {
    // Calcula el interés mensual
    const interesMensual = tasaInteres / 100 / 12;

    // Calcula la cuota mensual
    const cuotaMensual = (montoTotal * interesMensual) / (1 - Math.pow(1 + interesMensual, -numeroCuotas));

    // Retorna el resultado redondeado a dos decimales
    return cuotaMensual.toFixed(2);
}

let continuar;
do {
    // Prompts de usuario con validación de entrada
    let montoTotal = parseFloat(prompt("Ingrese el monto total:"));
    if (isNaN(montoTotal) || montoTotal <= 0) {
        alert("Por favor, ingrese un monto total válido y mayor que cero.");
        continue;
    }

    let numeroCuotas = parseInt(prompt("Ingrese el número de cuotas:"));
    if (isNaN(numeroCuotas) || numeroCuotas <= 0) {
        alert("Por favor, ingrese un número de cuotas válido y mayor que cero.");
        continue;
    }

    let tasaInteres = parseFloat(prompt("Ingrese la tasa de interés anual (%):"));
    if (isNaN(tasaInteres) || tasaInteres <= 0) {
        alert("Por favor, ingrese una tasa de interés válida y mayor que cero.");
        continue;
    }
    tasaInteres /= 100; // Convertir la tasa a decimal

    const cuotaMensual = calcularPagoCuotas(montoTotal, numeroCuotas, tasaInteres);
    console.log(`El pago mensual sería: $${cuotaMensual}`);
    
    alert(`El pago total es de $${montoTotal}. El pago mensual sería de: $${cuotaMensual} por ${numeroCuotas} meses`);
    
    // Continuar el ciclo con un while mientras el usuario no diga que no
    continuar = prompt("¿Desea realizar otro cálculo? (Sí/No)").toLowerCase();
} while (continuar === "si");
