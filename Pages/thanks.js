document.addEventListener('DOMContentLoaded', function () {
    const ultimoResultado = JSON.parse(localStorage.getItem('ultimoResultado')) || {};
    
    const principalDiv = document.getElementById('resumenCompra');
    principalDiv.innerHTML = `
        <h2>¡Gracias por tu compra!</h2>
        <p>Producto seleccionado: ${calculadora.obtenerNombreProducto(ultimoResultado.producto)}</p>
        <p>Precio total: ${ultimoResultado.montoTotal.toFixed(2)} ${ultimoResultado.moneda}</p>
        <p>Pago mensual: ${ultimoResultado.cuotaMensual.toFixed(2)} ${ultimoResultado.moneda}</p>
        <p>Por ${ultimoResultado.numeroCuotas} meses con un interés anual del ${ultimoResultado.tasaInteres}%</p>
    `;
    console.log('Thanks page loaded.');
});