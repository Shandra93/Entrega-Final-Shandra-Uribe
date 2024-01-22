document.addEventListener('DOMContentLoaded', function () {
    const productos = [
        {
            nombre: 'Television 55" - LG',
            imagen: './Assets/television.avif',
            precio: 1000,
            moneda: 'USD'
        },
        {
            nombre: 'Laptop 13" - HP',
            imagen: './Assets/laptop.jpg',
            precio: 800,
            moneda: 'USD'
        },
        {
            nombre: 'Iphone 15 Pro - Apple',
            imagen: './Assets/iphone.jpg',
            precio: 1200,
            moneda: 'USD'
        },
        {
            nombre: 'MacBook Pro - Apple',
            imagen: './Assets/macbook.jpg',
            precio: 1500,
            moneda: 'USD'
        }
    ];

    const catalogoProductos = document.getElementById('catalogoProductos');
    const carrito = document.getElementById('carrito');
    const calcularButton = document.getElementById('calcularButton');
    const agregarAlCarritoButton = document.getElementById('agregarAlCarritoButton');
    const resultadoDiv = document.getElementById('resultado');

    calcularButton.disabled = true;

    renderizarCatalogo();

    agregarAlCarritoButton.addEventListener('click', function () {
        const productoSeleccionado = productos.find(producto => producto.nombre === getProductoSeleccionado());

        if (productoSeleccionado && !existeEnCarrito(productoSeleccionado.nombre)) {
            const nuevoElemento = document.createElement('div');
            nuevoElemento.textContent = `${productoSeleccionado.nombre} - Precio: ${productoSeleccionado.precio} ${productoSeleccionado.moneda}`;
            carrito.appendChild(nuevoElemento);

            calcularButton.disabled = false;
        }
    });

    catalogoProductos.addEventListener('click', function (event) {
        const productoSeleccionado = event.target.closest('.producto');

        if (productoSeleccionado) {
            catalogoProductos.querySelectorAll('.producto').forEach(function (producto) {
                producto.classList.remove('seleccionado');
            });

            productoSeleccionado.classList.add('seleccionado');
        }
    });

    calcularButton.addEventListener('click', function () {
        const productoSeleccionado = productos.find(producto => producto.nombre === getProductoSeleccionado());

        if (productoSeleccionado) {
            const montoTotal = productoSeleccionado.precio;
            const monedaSeleccionada = document.getElementById('moneda').value;
            const numeroCuotas = parseInt(document.getElementById('numeroCuotas').value, 10);
            const tasaInteres = parseFloat(document.getElementById('tasaInteres').value);

            if (monedaSeleccionada !== 'USD') {
                const conversionRate = obtenerTasaDeCambio(monedaSeleccionada);
                const montoEnMoneda = montoTotal * conversionRate;
                resultadoDiv.innerHTML = `Monto total en ${monedaSeleccionada}: ${montoEnMoneda.toFixed(2)} ${monedaSeleccionada} (Tasa de cambio: 1 USD = ${conversionRate.toFixed(2)} ${monedaSeleccionada})`;
                calcularCuotas(montoEnMoneda, numeroCuotas, tasaInteres);
            } else {
                resultadoDiv.innerHTML = `Monto total en ${monedaSeleccionada}: ${montoTotal.toFixed(2)} ${monedaSeleccionada}`;
                calcularCuotas(montoTotal, numeroCuotas, tasaInteres);
            }

            mostrarBotonLimpiarCache();
        }
    });

    function mostrarBotonLimpiarCache() {
        const limpiarCacheButton = document.createElement('button');
        limpiarCacheButton.textContent = 'Limpiar Caché';
        limpiarCacheButton.id = 'limpiarCacheResultadoButton';
        limpiarCacheButton.addEventListener('click', limpiarCacheLocal);

        resultadoDiv.appendChild(limpiarCacheButton);
    }

    function calcularCuotas(montoTotal, numeroCuotas, tasaInteres) {
        const tasaInteresDecimal = tasaInteres / 100;
        const cuotaMensual = (montoTotal * (1 + tasaInteresDecimal)) / numeroCuotas;
        resultadoDiv.innerHTML += `<br/>Número de Cuotas: ${numeroCuotas}`;
        resultadoDiv.innerHTML += `<br/>Tasa de Interés: ${tasaInteres}%`;
        resultadoDiv.innerHTML += `<br/>Cuota Mensual: ${cuotaMensual.toFixed(2)}`;
        resultadoDiv.innerHTML += `<br/>`;
    }

    function obtenerTasaDeCambio(moneda) {
        if (moneda === 'EUR') {
            return 0.85; 
        } else if (moneda === 'GBP') {
            return 0.75; 
        } else {
            return 1; 
        }
    }

    function existeEnCarrito(nombreProducto) {
        const productosEnCarrito = Array.from(productosCarrito.children).map(elemento => elemento.textContent);
        return productosEnCarrito.includes(nombreProducto);
    }

    function limpiarCacheLocal() {
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
                carrito.innerHTML = '<h2>Carrito de Compras</h2>';
                resultado.innerHTML = '';  
                if (calcularButton) {
                    calcularButton.disabled = true; 
                }
    
                Swal.fire('Caché local limpiado con éxito.', '', 'success');
            }
        });
    }
    

    function getProductoSeleccionado() {
        const productoSeleccionado = catalogoProductos.querySelector('.seleccionado');
        return productoSeleccionado ? productoSeleccionado.dataset.producto : null;
    }

    function renderizarCatalogo() {
        productos.forEach(producto => {
            const nuevoProducto = document.createElement('div');
            nuevoProducto.classList.add('producto');
            nuevoProducto.dataset.producto = producto.nombre;

            const imagen = document.createElement('img');
            imagen.src = producto.imagen;
            imagen.alt = producto.nombre;

            const parrafo = document.createElement('p');
            parrafo.textContent = `${producto.nombre} - Precio: ${producto.precio} ${producto.moneda}`;

            nuevoProducto.appendChild(imagen);
            nuevoProducto.appendChild(parrafo);

            catalogoProductos.appendChild(nuevoProducto);
        });
    }
});
