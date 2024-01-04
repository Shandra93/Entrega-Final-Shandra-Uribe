
// Objeto que almacenará los resultados de los cálculos

const resultados = {
    montoTotal: 0,
    numeroCuotas: 0,
    tasaInteres: 0,
    cuotaMensual: 0,
};

// Objeto que proporciona métodos para mostrar mensajes en la interfaz

const UI = {
    mostrarMensaje: mensaje => console.log('Mensaje en la interfaz:', mensaje),
};

// Objeto principal que contiene la lógica de la calculadora

const calculadora = {
    inputs: [],
    resultadoDiv: null,
    calcularButton: null,
    monedaSelector: null,

// Método de inicialización de la calculadora

    init() {
        this.cacheDOM();
        this.bindEvents();
    },

// Captura las referencias a los elementos del DOM

    cacheDOM() {
        this.inputs = ['montoTotal', 'numeroCuotas', 'tasaInteres'].map(id => document.getElementById(id));
        this.resultadoDiv = document.getElementById('resultado');
        this.calcularButton = document.getElementById('calcularButton');
        this.monedaSelector = document.getElementById('moneda');
    },

// Vincula el evento de clic en el botón de cálculo con la función correspondiente

    bindEvents() {
        this.calcularButton.addEventListener('click', this.calcularPagoCuotas.bind(this));
    },

// Función que se ejecuta al hacer clic en el botón de cálculo

    calcularPagoCuotas() {
        const inputsConValor = this.inputs.filter(input => input.value.trim() !== '');

        if (inputsConValor.length !== this.inputs.length) {
            alert('Por favor, complete todos los campos antes de calcular.');
            return;
        }

        const sonTodosNumericos = this.inputs.every(input => !isNaN(parseFloat(input.value)));

        if (!sonTodosNumericos) {
            alert('Por favor, ingrese valores numéricos en todos los campos.');
            return;
        }

        this.inputs.forEach((input, index) => {
            resultados[Object.keys(resultados)[index]] = parseFloat(input.value);
        });

        this.mostrarResultados();
    },

// Muestra los resultados en la interfaz en diferentes monedas
    mostrarResultados() {
        const monedaSeleccionada = this.monedaSelector.value;
        const cuotaMensual = this.calcularPagoMensual(
            resultados.montoTotal,
            resultados.numeroCuotas,
            resultados.tasaInteres,
            monedaSeleccionada
        );

        const cuotaMensualUSD = this.calcularPagoMensual(
            resultados.montoTotal,
            resultados.numeroCuotas,
            resultados.tasaInteres,
            'USD'
        );
        const cuotaMensualEUR = this.calcularPagoMensual(
            resultados.montoTotal,
            resultados.numeroCuotas,
            resultados.tasaInteres,
            'EUR'
        );
        const cuotaMensualGBP = this.calcularPagoMensual(
            resultados.montoTotal,
            resultados.numeroCuotas,
            resultados.tasaInteres,
            'GBP'
        );

        // Muestra los resultados en el elemento de resultados en la interfaz
        this.resultadoDiv.innerHTML = `
            <p>El pago mensual sería en ${monedaSeleccionada}:
                <br>
                ${cuotaMensual.toFixed(2)} (${monedaSeleccionada}),
                ${fx(cuotaMensual).from(monedaSeleccionada).to('USD').toFixed(2)} (USD),
                ${fx(cuotaMensual).from(monedaSeleccionada).to('EUR').toFixed(2)} (EUR),
                ${fx(cuotaMensual).from(monedaSeleccionada).to('GBP').toFixed(2)} (GBP)
            </p>
            <p>Por ${resultados.numeroCuotas} meses con un interés anual del ${resultados.tasaInteres}%</p>
        `;

        UI.mostrarMensaje('Resultados calculados con éxito.');
    },

    calcularPagoMensual(montoTotal, numeroCuotas, tasaInteres, moneda) {
        const interesMensual = tasaInteres / 100 / 12;
        const cuotaMensual =
            (montoTotal * interesMensual) / (1 - Math.pow(1 + interesMensual, -numeroCuotas));

        return moneda === 'USD' ? cuotaMensual : fx(cuotaMensual).from('USD').to(moneda);
    },
};

document.addEventListener('DOMContentLoaded', () => {
    // Configuración de la biblioteca Money.js
    fx.settings = { from: 'USD', to: 'EUR' };
    fx.base = 'USD';
    fx.rates = { EUR: 0.85, GBP: 0.73 };

    calculadora.init();
});
