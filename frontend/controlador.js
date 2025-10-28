import {
    fnRecuperarUsuarios,
    fnRecuperarCategorias,
    fnRecuperarPuntos,
    fnRecuperarPuntoPorId,
    fnActualizarPunto,
    fnRecuperarEstadisticas,
    fnRecuperarEstadisticasGraficos,
    fnRecuperarPuntosConRelaciones,
    fnGenerarDatosReporte,
    fnGenerarReporteIA
} from "./modelo.js";

import {
    inicializarMapa,
    mostrarLoading,
    mostrarResultados,
    mostrarError,
    mostrarExito,
    mostrarUsuarios,
    mostrarCategorias,
    mostrarPuntos,
    actualizarMapa,
    mostrarFormularioUsuario,
    mostrarFormularioCategoria,
    mostrarFormularioPunto,
    mostrarFormularioEditarPunto,
    mostrarEstadisticasDetalladas,
    mostrarGraficosEstadisticas,
    mostrarPuntosConRelacionesDetalladas,
    cargarEstadisticas,
    mostrarReporteDetallado,
    mostrarReporteIADetallado
} from "./index.js";

// Variables globales
export let mapa = null;
export let marcadores = [];

// ==================== INICIALIZACIÓN ====================

window.addEventListener("load", () => {
    mapa = inicializarMapa();
    inicializarEventListeners();
    cargarEstadisticas();
});

function inicializarEventListeners() {
    // Botones de usuarios
    document.getElementById('btnListarUsuarios').addEventListener('click', () => listarUsuarios());
    document.getElementById('btnCrearUsuario').addEventListener('click', () => mostrarFormularioUsuario());
    
    // Botones de categorías
    document.getElementById('btnListarCategorias').addEventListener('click', () => listarCategorias());
    document.getElementById('btnCrearCategoria').addEventListener('click', () => mostrarFormularioCategoria());
    
    // Botones de puntos
    document.getElementById('btnListarPuntos').addEventListener('click', () => listarPuntos());
    document.getElementById('btnCrearPunto').addEventListener('click', () => mostrarFormularioPunto());
    
    // Botones de consultas especiales
    document.getElementById('btnEstadisticas').addEventListener('click', () => mostrarGraficos());
    document.getElementById('btnPuntosConRelaciones').addEventListener('click', () => mostrarPuntosConRelaciones());


    // En la función inicializarEventListeners
document.getElementById('btnGenerarReporte').addEventListener('click', mostrarReporte);
document.getElementById('btnGenerarReporteIA').addEventListener('click', mostrarReporteIA);

}

// ==================== FUNCIONES DE USUARIOS ====================

export async function listarUsuarios() {
    mostrarLoading(true);
    try {
        const datos = await fnRecuperarUsuarios();
        if (datos.result_estado === 'ok') {
            mostrarUsuarios(datos.result_data);
        } else {
            mostrarError(datos.result_message);
        }
    } catch (error) {
        mostrarError('Error al cargar usuarios: ' + error.message);
    } finally {
        mostrarLoading(false);
    }
}

// ==================== FUNCIONES DE CATEGORÍAS ====================

export async function listarCategorias() {
    mostrarLoading(true);
    try {
        const datos = await fnRecuperarCategorias();
        if (datos.result_estado === 'ok') {
            mostrarCategorias(datos.result_data);
        } else {
            mostrarError(datos.result_message);
        }
    } catch (error) {
        mostrarError('Error al cargar categorías: ' + error.message);
    } finally {
        mostrarLoading(false);
    }
}

// ==================== FUNCIONES DE PUNTOS ====================

export async function listarPuntos() {
    mostrarLoading(true);
    try {
        const datos = await fnRecuperarPuntos();
        if (datos.result_estado === 'ok') {
            mostrarPuntos(datos.result_data);
            actualizarMapa(datos.result_data);
        } else {
            mostrarError(datos.result_message);
        }
    } catch (error) {
        mostrarError('Error al cargar puntos: ' + error.message);
    } finally {
        mostrarLoading(false);
    }
}

// Función para editar un punto
window.editarPunto = async function(id) {
    mostrarLoading(true);
    try {
        const datos = await fnRecuperarPuntoPorId(id);
        if (datos.result_estado === 'ok') {
            const punto = datos.result_data;
            mostrarFormularioEditarPunto(punto);
        } else {
            mostrarError('Error al cargar punto: ' + datos.result_message);
        }
    } catch (error) {
        mostrarError('Error al cargar punto: ' + error.message);
    } finally {
        mostrarLoading(false);
    }
};

export async function guardarCambiosPunto(e) {
    e.preventDefault();
    
    const id = document.getElementById('editPuntoId').value;
    const datosPunto = {
        nombre: document.getElementById('editNombrePunto').value,
        descripcion: document.getElementById('editDescripcionPunto').value,
        latitud: parseFloat(document.getElementById('editLatitudPunto').value),
        longitud: parseFloat(document.getElementById('editLongitudPunto').value),
        categoria_id: parseInt(document.getElementById('editCategoriaPunto').value),
        usuario_id: parseInt(document.getElementById('editUsuarioPunto').value),
        estado: document.getElementById('editEstadoPunto').value
    };
    
    mostrarLoading(true);
    try {
        const datos = await fnActualizarPunto(id, datosPunto);
        if (datos.result_estado === 'ok') {
            mostrarExito('Punto actualizado correctamente');
            setTimeout(() => listarPuntos(), 1500);
        } else {
            mostrarError('Error al actualizar punto: ' + datos.result_message);
        }
    } catch (error) {
        mostrarError('Error al actualizar punto: ' + error.message);
    } finally {
        mostrarLoading(false);
    }
}

// ==================== FUNCIONES DE CONSULTAS ESPECIALES ====================

export async function mostrarEstadisticas() {
    mostrarLoading(true);
    try {
        const datos = await fnRecuperarEstadisticas();
        if (datos.result_estado === 'ok') {
            mostrarEstadisticasDetalladas(datos.result_data);
        } else {
            mostrarError(datos.result_message);
        }
    } catch (error) {
        mostrarError('Error al cargar estadísticas: ' + error.message);
    } finally {
        mostrarLoading(false);
    }
}

export async function mostrarPuntosConRelaciones() {
    mostrarLoading(true);
    try {
        const datos = await fnRecuperarPuntosConRelaciones();
        if (datos.result_estado === 'ok') {
            mostrarPuntosConRelacionesDetalladas(datos.result_data);
        } else {
            mostrarError(datos.result_message);
        }
    } catch (error) {
        mostrarError('Error al cargar puntos con relaciones: ' + error.message);
    } finally {
        mostrarLoading(false);
    }
}

export async function mostrarGraficos() {
    mostrarLoading(true);
    try {
        const datos = await fnRecuperarEstadisticasGraficos();
        if (datos.result_estado === 'ok') {
            mostrarGraficosEstadisticas(datos.result_data);
        } else {
            mostrarError(datos.result_message);
        }
    } catch (error) {
        mostrarError('Error al cargar gráficos: ' + error.message);
    } finally {
        mostrarLoading(false);
    }
}


// Nuevas funciones
export async function mostrarReporte() {
    mostrarLoading(true);
    try {
        const datos = await fnGenerarDatosReporte();
        if (datos.result_estado === 'ok') {
            mostrarReporteDetallado(datos.result_data);
        } else {
            mostrarError(datos.result_message);
        }
    } catch (error) {
        mostrarError('Error al generar reporte: ' + error.message);
    } finally {
        mostrarLoading(false);
    }
}


export async function mostrarReporteIA() {
    mostrarLoading(true);
    try {
        const datos = await fnGenerarReporteIA();
        if (datos.result_estado === 'ok') {
            mostrarReporteIADetallado(datos.result_data);
        } else {
            mostrarError(datos.result_message);
        }
    } catch (error) {
        mostrarError('Error al generar reporte con IA: ' + error.message);
    } finally {
        mostrarLoading(false);
    }
}