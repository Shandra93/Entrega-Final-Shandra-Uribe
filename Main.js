document.addEventListener('DOMContentLoaded', function () {

    document.addEventListener('DOMContentLoaded', function () {
        obtenerFechaDeAPI();
    });

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
        },
        {
            nombre: 'MacBook Air - Apple',
            imagen: './Assets/macbook.jpg',
            precio: 1350,
            moneda: 'USD',
            cantidad: 1
        },
        {
            nombre: 'MAC Pro - Apple',
            imagen: './Assets/Mac_pro.jpg',
            precio: 5800,
            moneda: 'USD',
            cantidad: 1
        },
        {
            nombre: 'Razer Blade - Razer',
            imagen: './Assets/razer_blade.jpg',
            precio: 3500,
            moneda: 'USD',
            cantidad: 1
        },
        {
            nombre: 'Golden Apple - Apple',
            imagen: './Assets/golden_apple.avif',
            precio: 5000,
            moneda: 'USD',
            cantidad: 1
        },
        {
            nombre: 'Silla Gamer - Cougar',
            imagen: './Assets/silla.jpg',
            precio: 2480,
            moneda: 'USD',
            cantidad: 1
        }
    ];

    const catalogoProductos = document.getElementById('catalogoProductos');
    const carrito = document.getElementById('productosCarrito');
    const calcularButton = document.getElementById('calcularButton');
    const agregarAlCarritoButton = document.getElementById('agregarAlCarritoButton');
    const resultadoDiv = document.getElementById('resultado');
    const monedaSelect = document.getElementById('moneda');
    const tiempoCarritoElement = document.getElementById('tiempoCarrito');
    const fechaActualElement = document.getElementById('fechaActual');

    let productosCarrito = JSON.parse(localStorage.getItem('productosCarrito')) || [];
    let tiempoEnCarrito = 60;
    let intervaloTiempoCarrito;

    console.log('Registro guardado');
    console.log(productosCarrito);

    renderizarCarrito();

    if (fechaActualElement) {
        mostrarFechaActual();
    }

    if (productosCarrito.length > 0) {
        calcularButton.disabled = false;
    }

    agregarAlCarritoButton.addEventListener('click', function () {
        reiniciarTemporizador();
        
        const productoSeleccionado = productos.find(producto => producto.nombre === getProductoSeleccionado());

        if (productoSeleccionado) {
            const productoEnCarritoIndex = productosCarrito.findIndex(p => p.nombre === productoSeleccionado.nombre);

            if (productoEnCarritoIndex !== -1) {
                productosCarrito[productoEnCarritoIndex].cantidad++;
            } else {
                productosCarrito.push({ ...productoSeleccionado, cantidad: 1 });
            }

            localStorage.setItem('productosCarrito', JSON.stringify(productosCarrito));

            mostrarNotificacion(`${productoSeleccionado.nombre} ha sido agregado al carrito`);

            renderizarCarrito();
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

    monedaSelect.addEventListener('change', function () {
        renderizarCatalogo();
        calcularButton.click();
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
                resultadoDiv.innerHTML = `<p>Monto total en ${monedaSeleccionada}: ${montoEnMoneda.toFixed(2)} ${monedaSeleccionada} (Tasa de cambio: 1 USD = ${conversionRate.toFixed(2)} ${monedaSeleccionada})</p>`;
                localStorage.setItem('resultadoDivContenido', resultadoDiv.innerHTML);
                calcularCuotas(montoEnMoneda, numeroCuotas, tasaInteres);
            } else {
                resultadoDiv.innerHTML = `<p>Monto total en ${monedaSeleccionada}: ${montoTotalCarrito.toFixed(2)} ${monedaSeleccionada}</p>`;
                calcularCuotas(montoTotalCarrito, numeroCuotas, tasaInteres);
            }

            mostrarBotonLimpiarCache();
        } else {
            resultadoDiv.innerHTML = 'No hay productos en el carrito para calcular el pago.';
        }
    });

    const limpiarCarritoButton = document.getElementById('limpiarCarritoButton');
    limpiarCarritoButton.addEventListener('click', function () {
        clearInterval(intervaloTiempoCarrito);
        tiempoEnCarrito = 60;
        actualizarTiempoCarrito(); 
        limpiarCarrito();
        intervaloTiempoCarrito = setInterval(actualizarTiempoCarrito, 1000); 
    });

    function mostrarFechaActual() {
        const fechaActual = new Date();
        const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = fechaActual.toLocaleDateString('es-ES', opcionesFecha);
        fechaActualElement.textContent = `Fecha actual: ${fechaFormateada}`;
    }

    mostrarFechaActual();


    function reiniciarTemporizador() {
        tiempoEnCarrito = 60;

        clearInterval(intervaloTiempoCarrito);

        intervaloTiempoCarrito = setInterval(actualizarTiempoCarrito, 1000);
    }

    

    function actualizarTiempoCarrito() {
        tiempoEnCarrito--;

        if (tiempoEnCarrito >= 0) {
            const minutos = Math.floor(tiempoEnCarrito / 60);
            const segundos = tiempoEnCarrito % 60;
            tiempoCarritoElement.textContent = `Tiempo en el carrito: ${minutos} min ${segundos} seg`;
        } else {
            limpiarCarrito();
            clearInterval(intervaloTiempoCarrito);
            tiempoCarritoElement.textContent = 'Tiempo en el carrito: Expirado';

            setTimeout(function () {
                location.reload();
            }, 1000);
        }
    }

    function obtenerFechaDeAPI() {
        fetch('http://worldtimeapi.org/api/ip')
            .then(response => response.json())
            .then(data => {
                const fecha = new Date(data.utc_datetime);
                mostrarFecha(fecha);
            })
            .catch(error => {
                console.error('Error al obtener la fecha desde la API:', error);
            });
    }

    function actualizarTiempoCarrito() {
        tiempoEnCarrito--;

        if (tiempoEnCarrito >= 0) {
            const minutos = Math.floor(tiempoEnCarrito / 60);
            const segundos = tiempoEnCarrito % 60;
            tiempoCarritoElement.textContent = `Tiempo en el carrito: ${minutos} min ${segundos} seg`;
        } else {
            limpiarCarrito();
            clearInterval(intervaloTiempoCarrito);
            tiempoCarritoElement.textContent = 'Tiempo en el carrito: Expirado';

            setTimeout(function () {
                location.reload();
            }, 1000);
        }
    }

    document.addEventListener('click', function () {
        tiempoEnCarrito = 60;
    });

    limpiarCarritoButton.addEventListener('click', function () {
        clearInterval(intervaloTiempoCarrito);
    });

    function calcularMontoTotalCarrito() {
        return productosCarrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
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
        resultadoDiv.innerHTML += `<p>Número de Cuotas: ${numeroCuotas}</p>`;
        resultadoDiv.innerHTML += `<p>Tasa de Interés: ${tasaInteres}%</p>`;
        resultadoDiv.innerHTML += `<p>Cuota Mensual: ${cuotaMensual.toFixed(2)}</p>`;
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
                calcularButton.disabled = true;

                Swal.fire('Caché local limpiado con éxito.', '', 'success');
            }
        });
    }

    function limpiarCarrito() {
        productosCarrito = [];
        localStorage.setItem('productosCarrito', JSON.stringify(productosCarrito));
        renderizarCarrito();
        resultadoDiv.innerHTML = '';
        calcularButton.disabled = true;
    }

    function getProductoSeleccionado() {
        const productoSeleccionado = catalogoProductos.querySelector('.seleccionado');
        return productoSeleccionado ? productoSeleccionado.dataset.producto : null;
    }

    function mostrarNotificacion(mensaje) {
        Toastify({
            text: mensaje,
            duration: 3000,
            close: true,
            gravity: 'top', 
            position: 'right', 
            stylebackground: '#4285f4', 
            stopOnFocus: true,
        }).showToast();
    }

    function renderizarCatalogo() {
        catalogoProductos.innerHTML = '';

        productos.forEach(producto => {
            const nuevoProducto = document.createElement('div');
            nuevoProducto.classList.add('producto');
            nuevoProducto.dataset.producto = producto.nombre;

            const imagen = document.createElement('img');
            imagen.src = producto.imagen;
            imagen.alt = producto.nombre;

            const precioEnMoneda = convertirPrecio(producto.precio, monedaSelect.value);

            const parrafo = document.createElement('p');
            parrafo.textContent = `${producto.nombre} - Precio: ${precioEnMoneda.toFixed(2)} ${monedaSelect.value}`;

            nuevoProducto.appendChild(imagen);
            nuevoProducto.appendChild(parrafo);

            catalogoProductos.appendChild(nuevoProducto);
        });
    }

    function convertirPrecio(precio, monedaDestino) {
        const monedaBase = 'USD';
        const conversionRate = obtenerTasaDeCambio(monedaDestino);
        return precio * conversionRate;
    }

    function renderizarCarrito() {
        carrito.innerHTML = '';

        productosCarrito.forEach(producto => {
            const nuevoElemento = document.createElement('p');
            nuevoElemento.textContent = `${producto.nombre} - Precio: ${producto.precio * producto.cantidad} ${producto.moneda} x ${producto.cantidad}`;
            carrito.appendChild(nuevoElemento);
        });
    }

    renderizarCatalogo();
});
