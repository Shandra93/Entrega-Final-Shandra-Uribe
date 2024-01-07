const resultados = {
    montoTotal: 0,
    numeroCuotas: 0,
    tasaInteres: 0,
    cuotaMensual: 0,
};

const configuracionPredeterminada = {
    monedaDefault: 'USD',
};

const UI = {
    mostrarMensaje: mensaje => console.log('Mensaje en la interfaz:', mensaje),
};

const calculadora = {
    inputs: [],
    resultadoDiv: null,
    calcularButton: null,
    monedaSelector: null,

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.cargarConfiguracion();
    },

    cacheDOM() {
        this.inputs = ['montoTotal', 'numeroCuotas', 'tasaInteres'].map(id => document.getElementById(id));
        this.resultadoDiv = document.getElementById('resultado');
        this.calcularButton = document.getElementById('calcularButton');
        this.monedaSelector = document.getElementById('moneda');
    },

    bindEvents() {
        this.calcularButton.addEventListener('click', this.calcularPagoCuotas.bind(this));
    },

    cargarConfiguracion() {
        const configuracionInicial = { ...configuracionPredeterminada, ...JSON.parse(localStorage.getItem('configuracion')) };
        this.monedaSelector.value = configuracionInicial.monedaDefault;
    },

    calcularPagoCuotas() {
        const inputsConValor = this.inputs.every(input => input.value.trim() !== '');

        if (!inputsConValor) {
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

    mostrarResultados() {
        const { montoTotal, numeroCuotas, tasaInteres } = resultados;
        const monedaSeleccionada = this.monedaSelector.value;
        const cuotaMensual = this.calcularPagoMensual(montoTotal, numeroCuotas, tasaInteres, monedaSeleccionada);

        this.resultadoDiv.innerHTML = `
            <p>El pago mensual sería en ${monedaSeleccionada}: ${cuotaMensual.toFixed(2)}</p>
            <p>Por ${numeroCuotas} meses con un interés anual del ${tasaInteres}%</p>
        `;

        UI.mostrarMensaje('Resultados calculados con éxito.');

        // Almacenar la configuración en localStorage
        const configuracionActualizada = { monedaDefault: monedaSeleccionada };
        localStorage.setItem('configuracion', JSON.stringify(configuracionActualizada));
        console.log(`${configuracionActualizada}, Datos guardados `);
    },

    calcularPagoMensual(montoTotal, numeroCuotas, tasaInteres, moneda) {
        const interesMensual = tasaInteres / 100 / 12;
        const cuotaMensual = (montoTotal * interesMensual) / (1 - Math.pow(1 + interesMensual, -numeroCuotas));

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
