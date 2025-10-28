
// ==================== FUNCIONES DE USUARIOS ====================

export const fnRecuperarUsuarios = async () => {
    let datos = null;
    try {
        const URL = `http://localhost:3000/usuarios`;
        const response = await fetch(URL);
        datos = await response.json();
    } catch (error) {
        console.log('Error al recuperar usuarios:', error);
    }
    return datos;
};

// ==================== FUNCIONES DE CATEGORÍAS ====================

export const fnRecuperarCategorias = async () => {
    let datos = null;
    try {
        const URL = `http://localhost:3000/categorias`;
        const response = await fetch(URL);
        datos = await response.json();
    } catch (error) {
        console.log('Error al recuperar categorías:', error);
    }
    return datos;
};

// ==================== FUNCIONES DE PUNTOS ====================

export const fnRecuperarPuntos = async () => {
    let datos = null;
    try {
        const URL = `http://localhost:3000/puntos`;
        const response = await fetch(URL);
        datos = await response.json();
    } catch (error) {
        console.log('Error al recuperar puntos:', error);
    }
    return datos;
};

export const fnRecuperarPuntoPorId = async (id) => {
    let datos = null;
    try {
        const URL = `http://localhost:3000/puntos/${id}`;
        const response = await fetch(URL);
        datos = await response.json();
    } catch (error) {
        console.log('Error al recuperar punto por ID:', error);
    }
    return datos;
};

export const fnActualizarPunto = async (id, datosPunto) => {
    let datos = null;
    try {
        const URL = `http://localhost:3000/puntos/${id}`;
        const response = await fetch(URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPunto)
        });
        datos = await response.json();
    } catch (error) {
        console.log('Error al actualizar punto:', error);
    }
    return datos;
};

// ==================== FUNCIONES DE CONSULTAS ESPECIALES ====================

export const fnRecuperarEstadisticas = async () => {
    let datos = null;
    try {
        const URL = `http://localhost:3000/estadisticas`;
        const response = await fetch(URL);
        datos = await response.json();
    } catch (error) {
        console.log('Error al recuperar estadísticas:', error);
    }
    return datos;
};

export const fnRecuperarEstadisticasGraficos = async () => {
    let datos = null;
    try {
        const URL = `http://localhost:3000/estadisticas/graficos`;
        const response = await fetch(URL);
        datos = await response.json();
    } catch (error) {
        console.log('Error al recuperar estadísticas para gráficos:', error);
    }
    return datos;
};

export const fnRecuperarPuntosConRelaciones = async () => {
    let datos = null;
    try {
        const URL = `http://localhost:3000/puntos/con-relaciones`;
        const response = await fetch(URL);
        datos = await response.json();
    } catch (error) {
        console.log('Error al recuperar puntos con relaciones:', error);
    }
    return datos;
};


// En frontend/modelo.js - agregar estas funciones
export const fnGenerarDatosReporte = async () => {
    let datos = null;
    try {
        const URL = `http://localhost:3000/reportes/generar-datos`;
        const response = await fetch(URL);
        datos = await response.json();
    } catch (error) {
        console.log('Error al generar datos del reporte:', error);
    }
    return datos;
};

export const fnGenerarReporteIA = async () => {
    let datos = null;
    try {
        const URL = `http://localhost:3000/reportes/generar-ia`;
        const response = await fetch(URL, { method: 'POST' });
        datos = await response.json();
    } catch (error) {
        console.log('Error al generar reporte con IA:', error);
    }
    return datos;
};