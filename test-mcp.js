const MCPClient = require('./mcp-cliente.js');

async function test() {
    console.log('Probando MCP...');
    const client = new MCPClient();
    const conectado = await client.conectar();
    console.log('Conectado:', conectado);
    
    if (conectado) {
        const datos = { resumen_general: { puntos_activos: 5 } };
        const resultado = await client.generarResumen(datos);
        console.log('Resultado:', resultado);
        await client.desconectar();
    }
}

test().catch(console.error);


