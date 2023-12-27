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
        const inputsConValor = this.inputs.filter(input => input.value.trim() !== '');

        console.log('Inputs con valor:', inputsConValor);

        if (inputsConValor.length !== this.inputs.length) {
            alert('Por favor, complete todos los campos antes de calcular.');
            return;
        }

        const sonTodosNumericos = this.inputs.every(input => !isNaN(parseFloat(input.value)));

        console.log('Son todos numéricos:', sonTodosNumericos);

        if (!sonTodosNumericos) {
            alert('Por favor, ingrese valores numéricos en todos los campos.');
            return;
        }

        this.inputs.forEach((input, index) => {
            resultados[Object.keys(resultados)[index]] = parseFloat(input.value);
        });

        console.log('Resultados después de la asignación:', resultados);

        this.mostrarResultados();
    },
    mostrarResultados: function () {
        const resultadoDiv = document.getElementById('resultado');
        resultadoDiv.innerHTML = `
            <p>El pago mensual sería: $${this.calcularPagoMensual(
                resultados.montoTotal,
                resultados.numeroCuotas,
                resultados.tasaInteres
            ).toFixed(2)}, por ${resultados.numeroCuotas} meses con un interés anual del ${resultados.tasaInteres}%</p>
        `;
    },
    calcularPagoMensual: function (montoTotal, numeroCuotas, tasaInteres) {
        const interesMensual = tasaInteres / 100 / 12;
        const cuotaMensual =
            (montoTotal * interesMensual) / (1 - Math.pow(1 + interesMensual, -numeroCuotas));

        console.log('Cálculo de la cuota mensual:', cuotaMensual);

        return cuotaMensual;
    },
};

document.addEventListener('DOMContentLoaded', function () {
    calculadora.init();
});
