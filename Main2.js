// Calcula el pago de las cuotas
function calcularPagoCuotas(montoTotal, numeroCuotas, tasaInteres) {
    const interesMensual = calcularInteresMensual(tasaInteres);
    const cuotaMensual = calcularCuotaMensual(montoTotal, numeroCuotas, interesMensual);

    // Resto del código...

    return cuotaMensual.toFixed(2);
}

// Funciones específicas para el cálculo
function calcularInteresMensual(tasaInteres) {
    return tasaInteres / 100 / 12;
}

function calcularCuotaMensual(montoTotal, numeroCuotas, interesMensual) {
    return (montoTotal * interesMensual) / (1 - Math.pow(1 + interesMensual, -numeroCuotas));
}

// Resto del código...

// Método para buscar un pago por el monto total
function buscarPagoPorMonto(montoBuscado) {
    return pagosRealizados.find(pago => pago.montoTotal === montoBuscado);
}

// Método para filtrar pagos por número de cuotas
function filtrarPagosPorCuotas(cuotasFiltradas) {
    return pagosRealizados.filter(pago => pago.numeroCuotas === cuotasFiltradas);
}
