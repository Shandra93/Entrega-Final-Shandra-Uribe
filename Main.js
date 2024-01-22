if (typeof UI === 'undefined') {
    var UI = {
        mostrarMensaje: mensaje => console.log('Mensaje en la interfaz:', mensaje),
    };
}

const configuracionPredeterminada = {
    monedaDefault: 'USD',
};

if (typeof calculadora === 'undefined') {
    const calculadora = {
        inputs: [],
        resultadoDiv: null,
        calcularButton: null,
        monedaSelector: null,
        productoSelector: null,
        registros: [],
    
        obtenerNombreProducto(productoId) {
            switch (productoId) {
                case 'producto1':
                    return 'Television 55" - LG';
                case 'producto2':
                    return 'Laptop 13" - HP';
                case 'producto3':
                    return 'Iphone 15 Pro - Apple';
                case 'producto4':
                    return 'MacBook Pro - Apple';
                default:
                    return 'Producto Desconocido';
            }
        },

    mostrarAgradecimiento() {
        const principalDiv = document.getElementById('principalDiv');
        const agradecimientoDiv = document.getElementById('agradecimientoDiv');

        if (principalDiv && agradecimientoDiv) {
            principalDiv.style.display = 'none';
            agradecimientoDiv.style.display = 'block';

            document.addEventListener('DOMContentLoaded', () => {
                const ultimoResultado = JSON.parse(localStorage.getItem('ultimoResultado')) || {};
                
                const resumenDiv = document.getElementById('resumenCompra');
                principalDiv.innerHTML = `
                    <h2>¡Gracias por tu compra!</h2>
                    <p>Producto seleccionado: ${calculadora.obtenerNombreProducto(ultimoResultado.producto)}</p>
                    <p>Precio total: ${ultimoResultado.montoTotal.toFixed(2)} ${ultimoResultado.moneda}</p>
                    <p>Pago mensual: ${ultimoResultado.cuotaMensual.toFixed(2)} ${ultimoResultado.moneda}</p>
                    <p>Por ${ultimoResultado.numeroCuotas} meses con un interés anual del ${ultimoResultado.tasaInteres}%</p>
                `;
            });
        }
    },
    
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.cargarConfiguracion();
        this.cargarRegistros();
        this.actualizarMontoTotal();
        this.mostrarCarrito();
        this.mostrarResultados();

        if (this.registros.length > 0) {
            this.calcularPagoCuotas();
        }
    },

    cargarUltimoResultado() {
        const ultimoResultado = JSON.parse(localStorage.getItem('ultimoResultado')) || {};
    
        if (Object.keys(ultimoResultado).length > 0 && ultimoResultado.producto) {
            this.mostrarResultadosEnInterfaz(
                ultimoResultado.cuotaMensual,
                ultimoResultado.montoTotal,
                ultimoResultado.moneda,
                ultimoResultado.producto,
                ultimoResultado.numeroCuotas,
                ultimoResultado.tasaInteres,
                ultimoResultado.carrito
            );
        }
    },

    cacheDOM() {
        this.inputs = ['montoTotal', 'numeroCuotas', 'tasaInteres'].map(id => document.getElementById(id));
        this.resultadoDiv = document.getElementById('resultado');
        this.calcularButton = document.getElementById('calcularButton');
        this.monedaSelector = document.getElementById('moneda');
        this.productoSelector = document.getElementById('catalogoProductos');

        if (!this.productoSelector) {
            console.error('Elemento con ID "catalogoProductos" no encontrado.');
        }
    },

    cargarRegistros() {
        const registrosGuardados = JSON.parse(localStorage.getItem('registros')) || [];
        this.registros = registrosGuardados;
        console.log('Registros cargados:', this.registros);
    
        const ultimoResultado = this.registros.length > 0 ? this.registros[this.registros.length - 1] : null;
        if (ultimoResultado) {
            this.mostrarResultadosEnInterfaz(
                ultimoResultado.cuotaMensual,
                ultimoResultado.montoTotal,
                ultimoResultado.moneda,
                ultimoResultado.producto,
                ultimoResultado.numeroCuotas,
                ultimoResultado.tasaInteres,
                ultimoResultado.carrito
            );
        } else {
            UI.mostrarMensaje('No hay registros disponibles.');
        }
    
        this.mostrarCarrito();
        this.mostrarResultados();
    },

    bindEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            this.actualizarMontoTotal();
            this.cacheDOM();
        });

        const limpiarCacheButton = document.getElementById('limpiarCacheButton');
        if (limpiarCacheButton) {
            limpiarCacheButton.addEventListener('click', this.limpiarCacheLocal.bind(this));
        }

        const catalogoProductos = document.getElementById('catalogoProductos');
        if (catalogoProductos) {
            catalogoProductos.addEventListener('click', this.seleccionarProducto.bind(this));
        } else {
            console.error('Elemento con ID "catalogoProductos" no encontrado.');
        }

        this.calcularButton.addEventListener('click', () => {
            // Mostrar el div "montoTotal" al hacer clic en el botón de calcular
            const montoTotalLabel = document.querySelector('label[for="montoTotal"]');
            const montoTotalInput = document.getElementById('montoTotal');
            
            if (montoTotalLabel && montoTotalInput) {
                montoTotalLabel.style.display = 'block';
                montoTotalInput.style.display = 'block';
            }

            // Mostrar el div "totalCarrito" al hacer clic en el botón de calcular
            const totalCarritoDiv = document.getElementById('totalCarrito');
            if (totalCarritoDiv) {
                totalCarritoDiv.style.display = 'block';
            }

            this.calcularPagoCuotas();
        });
    }, 

    cargarConfiguracion() {
        const configuracionInicial = { ...configuracionPredeterminada, ...JSON.parse(localStorage.getItem('configuracion')) };
        this.monedaSelector.value = configuracionInicial.monedaDefault;
        this.productoSelector.value = '';
    },

    limpiarCacheLocal() {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esto eliminará todos los registros y la configuración almacenada. ¿Quieres continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, limpiar caché',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                this.registros = [];
                UI.mostrarMensaje('Caché local limpiado con éxito.');
                this.mostrarCarrito();
                document.getElementById('resultado').innerHTML = '';
            }
        });
    },

    agregarAlCarrito() {
        const productoSeleccionado = this.productoSelector.value;
        if (productoSeleccionado !== '') {
        resultados.producto = productoSeleccionado;
        
        resultados.montoTotal = parseFloat(this.inputs[0].value);
        resultados.numeroCuotas = parseInt(document.getElementById('numeroCuotas').value, 10);
        resultados.tasaInteres = parseFloat(document.getElementById('tasaInteres').value);
        
        console.log('Valores recogidos:', resultados); 

        this.guardarRegistro();
        this.mostrarCarrito();
    } else {
        alert('Por favor, selecciona un producto antes de agregar al carrito.');
    }
},

    
    guardarRegistro() {
        const nuevoRegistro = { ...resultados, fecha: new Date(), carrito: this.obtenerCarrito() };
        console.log('Registro a guardar:', nuevoRegistro);
    
        this.registros.push(nuevoRegistro);
        localStorage.setItem('registros', JSON.stringify(this.registros));
        console.log('Registro guardado con éxito:', nuevoRegistro);
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
        const productoSeleccionado = productos.find(producto => producto.nombre === resultados.producto);

        if (productoSeleccionado) {
            const montoTotal = parseFloat(this.inputs[0].value);
            const numeroCuotas = parseInt(this.inputs[1].value, 10);
            const tasaInteres = parseFloat(this.inputs[2].value);

            if (productoSeleccionado.moneda !== 'USD') {
                const conversionRate = obtenerTasaDeCambio(productoSeleccionado.moneda);
                const montoEnMoneda = montoTotal * conversionRate;
                this.mostrarResultadosEnInterfaz(
                    calcularCuotaMensual(montoEnMoneda, numeroCuotas, tasaInteres),
                    montoTotal,
                    productoSeleccionado.moneda,
                    resultados.producto,
                    numeroCuotas,
                    tasaInteres
                );
            } else {
                this.mostrarResultadosEnInterfaz(
                    calcularCuotaMensual(montoTotal, numeroCuotas, tasaInteres),
                    montoTotal,
                    productoSeleccionado.moneda,
                    resultados.producto,
                    numeroCuotas,
                    tasaInteres
                );
            }

            this.guardarRegistro();
        } else {
            alert('Producto no encontrado en el catálogo.');
        }
    },

    mostrarResultados() {
        const { montoTotal, numeroCuotas, tasaInteres, producto } = resultados; 
        const monedaSeleccionada = this.monedaSelector.value;
        this.calcularPagoMensual(montoTotal, numeroCuotas, tasaInteres, monedaSeleccionada);
    },
    
    calcularPagoMensual(montoTotal, numeroCuotas, tasaInteres, moneda) {
        const interesMensual = tasaInteres / 100 / 12;
    
        fetch(`https://open.er-api.com/v6/latest/${moneda}?apikey=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                const tasaCambio = data.rates[configuracionPredeterminada.monedaDefault];
                const monedaSeleccionada = this.monedaSelector.value; // Corrección
    
                const cuotaMensualUSD = (montoTotal * interesMensual) / (1 - Math.pow(1 + interesMensual, -numeroCuotas));
    
                const cuotaMensual = cuotaMensualUSD * tasaCambio;
    
                this.mostrarResultadosEnInterfaz(cuotaMensual, montoTotal, monedaSeleccionada, resultados.producto, numeroCuotas, tasaInteres); // Corrección
            })
            .catch(error => {
                console.error('Error al obtener la tasa de cambio:', error);
            });
    },
    

    mostrarResultadosEnInterfaz(cuotaMensual, montoTotal, monedaSeleccionada, producto, numeroCuotas, tasaInteres) {
        const productoSeleccionado = this.obtenerNombreProducto(producto);

        this.resultadoDiv.innerHTML = `
            <p>Producto seleccionado: ${productoSeleccionado}</p>
            <p>Precio total: ${montoTotal.toFixed(2)} ${monedaSeleccionada}</p>
            <p>El pago mensual sería de ${monedaSeleccionada}: ${cuotaMensual.toFixed(2)}</p>
            <p>Por ${numeroCuotas} meses con un interés anual del ${tasaInteres}%</p>`;

        UI.mostrarMensaje('Resultados calculados con éxito.');
    },

    obtenerNombreProducto(productoId) {
        switch (productoId) {
            case 'producto1':
                return 'Television 55" - LG';
            case 'producto2':
                return 'Laptop 13" - HP';
            case 'producto3':
                return 'Iphone 15 Pro - Apple';
            case 'producto4':
                return 'MacBook Pro - Apple';
            default:
                return 'Producto Desconocido';
        }
    },
    

    calcularPagoMensual(montoTotal, numeroCuotas, tasaInteres, moneda) {
        const interesMensual = tasaInteres / 100 / 12;
        const cuotaMensual = (montoTotal * interesMensual) / (1 - Math.pow(1 + interesMensual, -numeroCuotas));

        return moneda === 'USD' ? cuotaMensual : fx(cuotaMensual).from('USD').to(moneda);
    },

    seleccionarProducto(event) {
        const productos = document.querySelectorAll('.producto');
        productos.forEach(producto => producto.classList.remove('seleccionado'));
    
        if (event.target.closest('.producto')) {
            const productoSeleccionado = event.target.closest('.producto');
            productoSeleccionado.classList.add('seleccionado');
            this.productoSelector.value = productoSeleccionado.dataset.producto;
            this.actualizarMontoTotal();
        }
    },

    actualizarMontoTotal() {
        const productoSeleccionado = this.productoSelector.value;
        const montoTotalInput = this.inputs[0];

        switch (productoSeleccionado) {
            case 'producto1':
                montoTotalInput.value = '1000';
                break;
            case 'producto2':
                montoTotalInput.value = '1500';
                break;
            case 'producto3':
                montoTotalInput.value = '2000';
                break;
            case 'producto4':
                montoTotalInput.value = '2500';
                break;
            default:
                montoTotalInput.value = '0';
                break;
        }

        montoTotalInput.disabled = productoSeleccionado === '';
    },

    limpiarCacheLocal() {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esto eliminará todos los registros y la configuración almacenada. ¿Quieres continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, limpiar caché',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                this.registros = [];
                UI.mostrarMensaje('Caché local limpiado con éxito.');
    
                document.getElementById('resultado').innerHTML = '';
            }
        });
    },
};

document.addEventListener('DOMContentLoaded', () => {
    calculadora.init();
});
}