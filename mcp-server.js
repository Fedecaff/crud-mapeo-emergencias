require('dotenv').config();

console.log("MCP Server iniciado - Modo Análisis Inteligente");
console.log("Análisis basado en datos reales simulando IA");

process.stdin.on('data', async (data) => {
    try {
        const comando = JSON.parse(data.toString());
        
        if (comando.accion === 'generar_resumen') {
            // Análisis inteligente de los datos reales
            const resumen = comando.datos.resumen_general;
            const puntosPorCategoria = comando.datos.puntos_por_categoria;
            
            // Calcular estadísticas
            const totalPuntos = resumen.total_puntos || 0;
            const totalUsuarios = resumen.total_usuarios || 0;
            const totalCategorias = resumen.total_categorias || 0;
            
            // Encontrar categoría más activa
            let categoriaMasActiva = null;
            let maxPuntos = 0;
            if (puntosPorCategoria && Array.isArray(puntosPorCategoria)) {
                puntosPorCategoria.forEach(cat => {
                    if (cat.count > maxPuntos) {
                        maxPuntos = cat.count;
                        categoriaMasActiva = cat.categoria_nombre;
                    }
                });
            }
            
            // Generar análisis inteligente
            const resumenEjecutivo = generarResumenEjecutivo(totalPuntos, totalUsuarios, totalCategorias, categoriaMasActiva);
            const hallazgosClave = generarHallazgosClave(puntosPorCategoria, totalPuntos, totalUsuarios);
            const recomendaciones = generarRecomendaciones(categoriaMasActiva, totalPuntos, puntosPorCategoria);
            
            const respuesta = {
                resumen_ejecutivo: resumenEjecutivo,
                hallazgos_clave: hallazgosClave,
                recomendaciones: recomendaciones,
                timestamp: new Date().toISOString(),
                fuente: "Análisis Inteligente - Simulación IA"
            };
            
            process.stdout.write(JSON.stringify(respuesta) + '\n');
        }
    } catch (error) {
        process.stdout.write(JSON.stringify({
            resumen_ejecutivo: `Error en el análisis: ${error.message}`,
            hallazgos_clave: ['Error en el procesamiento de datos'],
            recomendaciones: ['Revisar integridad de los datos'],
            timestamp: new Date().toISOString(),
            fuente: "Sistema de Análisis"
        }) + '\n');
    }
});

// Función para generar resumen ejecutivo inteligente
function generarResumenEjecutivo(totalPuntos, totalUsuarios, totalCategorias, categoriaMasActiva) {
    const densidad = totalUsuarios > 0 ? (totalPuntos / totalUsuarios).toFixed(1) : 0;
    
    let resumen = `El sistema de mapeo de emergencias registra ${totalPuntos} puntos de emergencia `;
    resumen += `distribuidos en ${totalCategorias} categorías diferentes. `;
    
    if (categoriaMasActiva) {
        resumen += `La categoría más reportada es "${categoriaMasActiva}", `;
    }
    
    resumen += `con una densidad promedio de ${densidad} puntos por usuario. `;
    
    if (totalPuntos > 20) {
        resumen += `El sistema muestra alta actividad, indicando una necesidad significativa de monitoreo.`;
    } else if (totalPuntos > 10) {
        resumen += `El sistema presenta actividad moderada, sugiriendo un patrón de emergencias controlado.`;
    } else {
        resumen += `El sistema registra actividad baja, lo que puede indicar períodos de calma o subregistro.`;
    }
    
    return resumen;
}

// Función para generar hallazgos clave
function generarHallazgosClave(puntosPorCategoria, totalPuntos, totalUsuarios) {
    const hallazgos = [];
    
    if (totalPuntos > 0) {
        hallazgos.push(`Se registraron ${totalPuntos} incidentes de emergencia en el período analizado`);
    }
    
    if (totalUsuarios > 0) {
        const promedio = (totalPuntos / totalUsuarios).toFixed(1);
        hallazgos.push(`Promedio de ${promedio} reportes por usuario, indicando participación activa`);
    }
    
    if (puntosPorCategoria && Array.isArray(puntosPorCategoria)) {
        const categoriasConDatos = puntosPorCategoria.filter(cat => cat.count > 0);
        hallazgos.push(`${categoriasConDatos.length} categorías de emergencia presentan actividad`);
        
        // Hallazgo sobre distribución
        const maxCategoria = puntosPorCategoria.reduce((max, cat) => cat.count > max.count ? cat : max, {count: 0});
        if (maxCategoria.count > 0) {
            const porcentaje = ((maxCategoria.count / totalPuntos) * 100).toFixed(1);
            hallazgos.push(`"${maxCategoria.categoria_nombre}" concentra el ${porcentaje}% de los reportes`);
        }
    }
    
    if (totalPuntos > 15) {
        hallazgos.push("Alta frecuencia de reportes sugiere necesidad de protocolos de respuesta rápida");
    }
    
    return hallazgos;
}

// Función para generar recomendaciones
function generarRecomendaciones(categoriaMasActiva, totalPuntos, puntosPorCategoria) {
    const recomendaciones = [];
    
    if (categoriaMasActiva) {
        recomendaciones.push(`Priorizar recursos y capacitación para emergencias de tipo "${categoriaMasActiva}"`);
    }
    
    if (totalPuntos > 20) {
        recomendaciones.push("Implementar sistema de alertas automáticas para respuesta inmediata");
        recomendaciones.push("Considerar ampliar el equipo de respuesta ante la alta demanda");
    } else if (totalPuntos < 5) {
        recomendaciones.push("Evaluar estrategias de sensibilización para aumentar reportes ciudadanos");
    }
    
    if (puntosPorCategoria && Array.isArray(puntosPorCategoria)) {
        const categoriasSinActividad = puntosPorCategoria.filter(cat => cat.count === 0);
        if (categoriasSinActividad.length > 0) {
            recomendaciones.push("Revisar protocolos para categorías sin reportes recientes");
        }
    }
    
    recomendaciones.push("Mantener actualización constante del mapa de emergencias");
    recomendaciones.push("Implementar análisis de tendencias temporales para predicción");
    
    return recomendaciones;
}

process.stdin.resume();