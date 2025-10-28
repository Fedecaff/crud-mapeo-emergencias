const MCPClient = require('./mcp-cliente.js');

async function testMCP() {
    console.log('Probando MCP...');
    
    try {
        const mcp = new MCPClient();
        await mcp.conectar();
        
        console.log('Conectado:', mcp.conectado);
        
        if (mcp.conectado) {
            const datosPrueba = {
                resumen_general: {
                    total_puntos: 15,
                    total_usuarios: 3,
                    total_categorias: 4
                },
                puntos_por_categoria: [
                    { categoria_nombre: 'Incendio', count: 5 },
                    { categoria_nombre: 'Inundación', count: 3 },
                    { categoria_nombre: 'Accidente', count: 4 },
                    { categoria_nombre: 'Otros', count: 3 }
                ]
            };
            
            console.log('Enviando datos de prueba...');
            const resultado = await mcp.generarResumen(datosPrueba);
            console.log('Resultado:', JSON.stringify(resultado, null, 2));
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

testMCP();
