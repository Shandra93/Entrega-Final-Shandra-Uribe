document.addEventListener('DOMContentLoaded', function () {
    const productos = [
        {
            nombre: 'Television 55" - LG',
            imagen: './Assets/television.avif',
            precio: 1000,
            moneda: 'USD',
            cantidad: 1
        },
        {
            nombre: 'Laptop 13" - HP',
            imagen: './Assets/laptop.jpg',
            precio: 800,
            moneda: 'USD',
            cantidad: 1
        },
        {
            nombre: 'Iphone 15 Pro - Apple',
            imagen: './Assets/iphone.jpg',
            precio: 1200,
            moneda: 'USD',
            cantidad: 1
        },
        {
            nombre: 'MacBook Pro - Apple',
            imagen: './Assets/macbook.jpg',
            precio: 1500,
            moneda: 'USD',
            cantidad: 1
        }
    ];

    const catalogoProductos = document.getElementById('catalogoProductos');
    const carrito = document.getElementById('productosCarrito');
    const calcularButton = document.getElementById('calcularButton');
    const agregarAlCarritoButton = document.getElementById('agregarAlCarritoButton');
    const limpiarCacheButton = document.getElementById('limpiarCacheButton');
    const resultadoDiv = document.getElementById('resultado');

    let productosCarrito = JSON.parse(localStorage.getItem('productosCarrito')) || [];

    limpiarCacheButton.style.display = productosCarrito.length > 0 ? 'block' : 'none';

    calcularButton.disabled = true;

    agregarAlCarritoButton.addEventListener('click', function () {
        const productoSeleccionado = productos.find(producto => producto.nombre === getProductoSeleccionado());

        if (productoSeleccionado) {
            const index = productosCarrito.findIndex(item => item.nombre === productoSeleccionado.nombre);

            if (index !== -1) {
                productosCarrito[index].cantidad++;
            } else {
                productosCarrito.push({ ...productoSeleccionado, cantidad: 1 });
            }

            localStorage.setItem('productosCarrito', JSON.stringify(productosCarrito));
            console.log('Se agregaron productos a la memoria')
            console.log(productosCarrito)

            renderizarCarrito();
            calcularButton.disabled = false;

            document.getElementById('resultado').removeAttribute('disabled');

            limpiarCacheButton.style.display = 'block';
        }
    });

    limpiarCacheButton.addEventListener('click', limpiarCacheLocal);

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
        if (productosCarrito.length > 0) {
            const montoTotalCarrito = calcularMontoTotalCarrito();
            const monedaSeleccionada = document.getElementById('moneda').value;
            const numeroCuotas = parseInt(document.getElementById('numeroCuotas').value, 10);
            const tasaInteres = parseFloat(document.getElementById('tasaInteres').value);

            if (monedaSeleccionada !== 'USD') {
                const conversionRate = obtenerTasaDeCambio(monedaSeleccionada);
                const montoEnMoneda = montoTotalCarrito * conversionRate;
                resultadoDiv.innerHTML = `Monto total en ${monedaSeleccionada}: ${montoEnMoneda.toFixed(2)} ${monedaSeleccionada} (Tasa de cambio: 1 USD = ${conversionRate.toFixed(2)} ${monedaSeleccionada})`;
                calcularCuotas(montoEnMoneda, numeroCuotas, tasaInteres);
            } else {
                resultadoDiv.innerHTML = `Monto total en ${monedaSeleccionada}: ${montoTotalCarrito.toFixed(2)} ${monedaSeleccionada}`;
                calcularCuotas(montoTotalCarrito, numeroCuotas, tasaInteres);
            }

            mostrarBotonLimpiarCache();
        } else {
            resultadoDiv.innerHTML = 'No hay productos en el carrito para calcular el pago.';
            document.getElementById('resultado').setAttribute('disabled', true);
        }
    });

    function calcularMontoTotalCarrito() {
        return productosCarrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
    }

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
        const productosEnCarrito = productosCarrito.map(producto => producto.nombre);
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
                productosCarrito = [];
                renderizarCarrito();
                resultadoDiv.innerHTML = '';
                if (calcularButton) {
                    calcularButton.disabled = true;
                }

                limpiarCacheButton.style.display = 'none';

                if (productosCarrito.length > 0) {
                    calcularButton.disabled = false;
                    document.getElementById('resultado').removeAttribute('disabled');
                } else {
                    calcularButton.disabled = true;
                    document.getElementById('resultado').setAttribute('disabled', true);
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

    function renderizarCarrito() {
        carrito.innerHTML = '';

        productosCarrito.forEach(producto => {
            const nuevoElemento = document.createElement('p');
            nuevoElemento.textContent = `${producto.nombre} - Precio: ${producto.precio} ${producto.moneda} x ${producto.cantidad}`;
            carrito.appendChild(nuevoElemento);
        });
    }

    renderizarCatalogo();
    renderizarCarrito();
});
