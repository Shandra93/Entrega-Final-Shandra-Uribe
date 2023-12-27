const resultados = {
    montoTotal: 0,
    numeroCuotas: 0,
    tasaInteres: 0,
    cuotaMensual: 0,
};

const calculadora = {
    inputs: [],
    init: function () {
        this.cacheDOM();
        this.bindEvents();
    },
    cacheDOM: function () {
        this.inputs = [
            document.getElementById('montoTotal'),
            document.getElementById('numeroCuotas'),
            document.getElementById('tasaInteres'),
        ];
        this.resultadoDiv = document.getElementById('resultado');
        this.calcularButton = document.getElementById('calcularButton');
    },
    bindEvents: function () {
        this.calcularButton.addEventListener('click', this.calcularPagoCuotas.bind(this));
    },
    calcularPagoCuotas: function () {
        // se incorpora forEach como método de array para trabajar 
        // sobre el array inputs y actualizar los valores en el objeto 
        // resultados en la función calcularPagoCuotas
        this.inputs.forEach((input, index) => {
            resultados[Object.keys(resultados)[index]] = parseFloat(input.value);
        });

        if (this.isValidInput()) {
            resultados.cuotaMensual = this.calcularPagoMensual(
                resultados.montoTotal,
                resultados.numeroCuotas,
                resultados.tasaInteres
            );
            this.mostrarResultados();
        } else {
            alert("Por favor, ingrese valores válidos y mayores que cero en todos los campos.");
        }
    },
    isValidInput: function () {
        return this.inputs.every(input => !isNaN(parseFloat(input.value)) && parseFloat(input.value) > 0);
    },
    mostrarResultados: function () {
        this.resultadoDiv.innerHTML = `
            <p>El pago mensual sería: $${resultados.cuotaMensual.toFixed(2)}, por ${
            resultados.numeroCuotas
        } meses con un interés anual del ${resultados.tasaInteres}%</p>
        `;
    },
    calcularPagoMensual: function (montoTotal, numeroCuotas, tasaInteres) {
        const interesMensual = tasaInteres / 100 / 12;
        const cuotaMensual =
            (montoTotal * interesMensual) / (1 - Math.pow(1 + interesMensual, -numeroCuotas));
        return cuotaMensual;
    },
};

document.addEventListener('DOMContentLoaded', function () {
    calculadora.init();
});