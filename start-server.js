/**
 * Script para arrancar el servidor del Sistema de Mapeo de Emergencias
 * 
 * Este script verifica la conexión a la base de datos y arranca el servidor
 * con mensajes informativos sobre el estado del sistema.
 */

const { Pool } = require("pg");

// Configuración de la base de datos
const pool = new Pool({
    user: "postgres",
    host: "localhost", 
    database: "base2025",
    password: "password",
    port: 5432,
});

// Función para verificar la conexión a la base de datos
async function verificarConexionDB() {
    try {
        console.log("Verificando conexión a la base de datos...");
        const resultado = await pool.query("SELECT NOW() as tiempo_actual");
        console.log("Conexión a PostgreSQL exitosa");
        console.log(`Hora del servidor: ${resultado.rows[0].tiempo_actual}`);
        return true;
    } catch (error) {
        console.error("Error al conectar con PostgreSQL:");
        console.error(`   ${error.message}`);
        console.log("\nVerifica que:");
        console.log("   - PostgreSQL esté ejecutándose");
        console.log("   - La base de datos 'base2025' exista");
        console.log("   - Las credenciales sean correctas");
        console.log("   - El puerto 5432 esté disponible");
        return false;
    }
}

// Función principal para arrancar el servidor
async function arrancarServidor() {
    console.log("Iniciando Sistema de Mapeo de Emergencias...");
    console.log("=" .repeat(50));
    
    // Verificar conexión a la base de datos
    const conexionOK = await verificarConexionDB();
    
    if (!conexionOK) {
        console.log("\nNo se puede arrancar el servidor sin conexión a la base de datos");
        process.exit(1);
    }
    
    console.log("\nCargando módulos del servidor...");
    
    try {
        // Importar y ejecutar el servidor principal
        require('./index_nuevo.js');
        
        console.log("\n¡Servidor arrancado exitosamente!");
        console.log("=" .repeat(50));
        console.log("API REST disponible en: http://localhost:3000");
        console.log("Frontend disponible en: http://localhost:3000");
        console.log("Endpoints disponibles:");
        console.log("   - GET    /usuarios");
        console.log("   - GET    /categorias"); 
        console.log("   - GET    /puntos");
        console.log("   - GET    /estadisticas");
        console.log("=" .repeat(50));
        
    } catch (error) {
        console.error("Error al arrancar el servidor:");
        console.error(`   ${error.message}`);
        process.exit(1);
    }
}

// Manejar cierre graceful del servidor
process.on('SIGINT', async () => {
    console.log('\nCerrando servidor...');
    try {
        await pool.end();
        console.log('Conexión a la base de datos cerrada');
        process.exit(0);
    } catch (error) {
        console.error('Error al cerrar la conexión:', error.message);
        process.exit(1);
    }
});

// Arrancar el servidor
arrancarServidor();

