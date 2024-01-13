const resultados = {
    montoTotal: 0,
    numeroCuotas: 0,
    tasaInteres: 0,
    cuotaMensual: 0,
    producto: '', 
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
    productoSelector: null, 
    registros: [], 

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.cargarConfiguracion();
        this.cargarRegistros();
    },

    cacheDOM() {
        this.inputs = ['montoTotal', 'numeroCuotas', 'tasaInteres'].map(id => document.getElementById(id));
        this.resultadoDiv = document.getElementById('resultado');
        this.calcularButton = document.getElementById('calcularButton');
        this.monedaSelector = document.getElementById('moneda');
        this.productoSelector = document.getElementById('producto'); // Nuevo campo para el producto
    },

    bindEvents() {
        this.calcularButton.addEventListener('click', this.calcularPagoCuotas.bind(this));
        this.productoSelector.addEventListener('change', this.actualizarMontoTotal.bind(this));

        // Agregar evento al botón para limpiar el caché local
        const limpiarCacheButton = document.getElementById('limpiarCacheButton');
        if (limpiarCacheButton) {
            limpiarCacheButton.addEventListener('click', this.limpiarCacheLocal.bind(this));
        }
    },

    cargarConfiguracion() {
        const configuracionInicial = { ...configuracionPredeterminada, ...JSON.parse(localStorage.getItem('configuracion')) };
        this.monedaSelector.value = configuracionInicial.monedaDefault;
        this.productoSelector.value = ''; // Valor predeterminado para el producto
        this.actualizarMontoTotal(); // Actualizar el montoTotal al cargar la configuración inicial
    },

    cargarRegistros() {
        const registrosGuardados = JSON.parse(localStorage.getItem('registros')) || [];
        this.registros = registrosGuardados;
        console.log('Registros cargados:', this.registros);
    },

    guardarRegistro() {
        this.registros.push({ ...resultados, fecha: new Date() });
        localStorage.setItem('registros', JSON.stringify(this.registros));
        console.log('Registro guardado con éxito:', resultados);
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

        resultados.producto = this.productoSelector.value;

        this.inputs.forEach((input, index) => {
            resultados[Object.keys(resultados)[index]] = parseFloat(input.value);
        });

        this.mostrarResultados();
        this.guardarRegistro(); // Guardar el resultado como registro
    },

    mostrarResultados() {
        const { montoTotal, numeroCuotas, tasaInteres, producto } = resultados; // Nuevo campo para el producto
        const monedaSeleccionada = this.monedaSelector.value;
        const cuotaMensual = this.calcularPagoMensual(montoTotal, numeroCuotas, tasaInteres, monedaSeleccionada);

        this.resultadoDiv.innerHTML = `
            <p>El pago mensual sería en ${monedaSeleccionada}: ${cuotaMensual.toFixed(2)}</p>
            <p>Por ${numeroCuotas} meses con un interés anual del ${tasaInteres}%</p>
            <p>Producto seleccionado: ${producto}</p>`; // Nuevo campo para el producto

        UI.mostrarMensaje('Resultados calculados con éxito.');

        // Almacenar la configuración en localStorage
        const configuracionActualizada = { monedaDefault: monedaSeleccionada };
        localStorage.setItem('configuracion', JSON.stringify(configuracionActualizada));
        console.log(`${configuracionActualizada}, Datos guardados`);
    },

    calcularPagoMensual(montoTotal, numeroCuotas, tasaInteres, moneda) {
        const interesMensual = tasaInteres / 100 / 12;
        const cuotaMensual = (montoTotal * interesMensual) / (1 - Math.pow(1 + interesMensual, -numeroCuotas));

        return moneda === 'USD' ? cuotaMensual : fx(cuotaMensual).from('USD').to(moneda);
    },

    actualizarMontoTotal() {
        const productoSeleccionado = this.productoSelector.value;

        switch (productoSeleccionado) {
            case 'producto1':
                this.inputs[0].value = '1000'; 
                break;
            case 'producto2':
                this.inputs[0].value = '1500'; 
                break;
            case 'producto3':
                this.inputs[0].value = '2000'; 
                break;
            case 'producto4':
                this.inputs[0].value = '2500'; 
                break;
            default:
                this.inputs[0].value = '0'; 
                break;
        }
    },

    limpiarCacheLocal() {
        localStorage.clear();
        this.registros = []; // Limpiar registros en la memoria
        UI.mostrarMensaje('Caché local limpiado con éxito.');
    },
};

document.addEventListener('DOMContentLoaded', () => {
    // Configuración de la biblioteca Money.js
    fx.settings = { from: 'USD', to: 'EUR' };
    fx.base = 'USD';
    fx.rates = { EUR: 0.85, GBP: 0.73 };

    calculadora.init();
});
