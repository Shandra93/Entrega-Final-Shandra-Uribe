function () {
    // Obtén referencias a los elementos del formulario y al resultado
    const calculatorForm = document.getElementById('calculatorForm');
    const montoTotalInput = document.getElementById('montoTotal');
    const numeroCuotasInput = document.getElementById('numeroCuotas');
    const tasaInteresInput = document.getElementById('tasaInteres');
    const resultadoDiv = document.getElementById('resultado');

    // Agrega un event listener al formulario para el evento 'submit'
    calculatorForm.addEventListener('submit', function (event) {
        // Evita el comportamiento predeterminado del formulario
        event.preventDefault();

        // Obtiene los valores de los campos de entrada
        const montoTotal = parseFloat(montoTotalInput.value);
        const numeroCuotas = parseInt(numeroCuotasInput.value);
        const tasaInteres = parseFloat(tasaInteresInput.value);

        // Valida los valores de entrada
        if (isNaN(montoTotal) || isNaN(numeroCuotas) || isNaN(tasaInteres) || montoTotal <= 0 || numeroCuotas <= 0 || tasaInteres <= 0) {
            alert("Por favor, ingrese valores válidos y mayores que cero en todos los campos.");
            return;
        }

        // Realiza el cálculo llamando a la función calcularPagoCuotas
        const cuotaMensual = calcularPagoCuotas(montoTotal, numeroCuotas, tasaInteres);

        // Muestra el resultado en el elemento con id 'resultado'
        resultadoDiv.textContent = `El pago mensual sería: $${cuotaMensual}`;
    });
};

function calcularPagoCuotas(montoTotal, numeroCuotas, tasaInteres) {
    // Calcula el interés mensual
    const interesMensual = tasaInteres / 100 / 12;

    // Calcula la cuota mensual
    const cuotaMensual = (montoTotal * interesMensual) / (1 - Math.pow(1 + interesMensual, -numeroCuotas));

    // Retorna el resultado redondeado a dos decimales
    return cuotaMensual.toFixed(2);
}
