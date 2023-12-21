const resultados = {
    montoTotal: 0,
    numeroCuotas: 0,
    tasaInteres: 0,
    cuotaMensual: 0,
};

function calcularPagoCuotas() {
    const montoTotalInput = document.getElementById('montoTotal');
    const numeroCuotasInput = document.getElementById('numeroCuotas');
    const tasaInteresInput = document.getElementById('tasaInteres');
    const resultadoDiv = document.getElementById('resultado');

    resultados.montoTotal = parseFloat(montoTotalInput.value);
    resultados.numeroCuotas = parseInt(numeroCuotasInput.value);
    resultados.tasaInteres = parseFloat(tasaInteresInput.value);

    // filtra los resultados para que se ingresen siempre cifras
    if (
        isNaN(resultados.montoTotal) ||
        isNaN(resultados.numeroCuotas) ||
        isNaN(resultados.tasaInteres) ||
        resultados.montoTotal <= 0 ||
        resultados.numeroCuotas <= 0 ||
        resultados.tasaInteres <= 0
    ) {
        alert("Por favor, ingrese valores válidos y mayores que cero en todos los campos.");
        return;
    }

    resultados.cuotaMensual = calcularPagoMensual(
        resultados.montoTotal,
        resultados.numeroCuotas,
        resultados.tasaInteres
    );

    mostrarResultados();
}

// Función para mostrar los resultados
function mostrarResultados() {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <p>El pago mensual sería: $${resultados.cuotaMensual.toFixed(2)}, por ${
        resultados.numeroCuotas
    } meses con un interés anual del ${resultados.tasaInteres}%</p>
    `;
}

// Función para calcular la cuota mensual
function calcularPagoMensual(montoTotal, numeroCuotas, tasaInteres) {
    const interesMensual = tasaInteres / 100 / 12;
    const cuotaMensual =
        (montoTotal * interesMensual) / (1 - Math.pow(1 + interesMensual, -numeroCuotas));
    return cuotaMensual;
}

document.addEventListener('DOMContentLoaded', function () {
    // Agrega un event listener al botón de calcular
    const calcularButton = document.getElementById('calcularButton');
    calcularButton.addEventListener('click', calcularPagoCuotas);
});
