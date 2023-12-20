const resultados = [];

function calcularPagoCuotas() {
    const montoTotalInput = document.getElementById('montoTotal');
    const numeroCuotasInput = document.getElementById('numeroCuotas');
    const tasaInteresInput = document.getElementById('tasaInteres');
    const resultadoDiv = document.getElementById('resultado');

    const montoTotal = parseFloat(montoTotalInput.value);
    const numeroCuotas = parseInt(numeroCuotasInput.value);
    const tasaInteres = parseFloat(tasaInteresInput.value);

    if (isNaN(montoTotal) || isNaN(numeroCuotas) || isNaN(tasaInteres) || montoTotal <= 0 || numeroCuotas <= 0 || tasaInteres <= 0) {
        alert("Por favor, ingrese valores válidos y mayores que cero en todos los campos.");
        return;
    }

    const cuotaMensual = calcularPagoMensual(montoTotal, numeroCuotas, tasaInteres);

    resultados.push(`El pago total sería: $${montoTotal.toFixed(2)}, por ${numeroCuotas} meses con un interes del ${tasaInteres}%`);
    console.log(resultados);

    resultadoDiv.innerHTML = resultados.join('<br>');
    
}

// Función para calcular la cuota mensual
function calcularPagoMensual(montoTotal, numeroCuotas, tasaInteres) {
    const interesMensual = tasaInteres / 100 / 12;
    const cuotaMensual = (montoTotal * interesMensual) / (1 - Math.pow(1 + interesMensual, -numeroCuotas));
    return cuotaMensual;
}

document.addEventListener('DOMContentLoaded', function () {
    // Agrega un event listener al botón de calcular
    const calcularButton = document.getElementById('calcularButton');
    calcularButton.addEventListener('click', calcularPagoCuotas);
});
