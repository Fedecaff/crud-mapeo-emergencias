const { spawn } = require('child_process');
const path = require('path');

class MCPClient {
  constructor() {
    this.serverProcess = null;
    this.conectado = false;
  }

  async conectar() {
    try {
      const serverPath = path.join(process.cwd(), 'mcp-server.js');
      
      // Iniciar el servidor MCP como proceso hijo
      this.serverProcess = spawn(process.execPath, [serverPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: process.cwd(),
        env: process.env
      });

      this.serverProcess.on('error', (err) => {
        console.error('[MCP] Error al iniciar proceso hijo:', err);
      });

      this.serverProcess.stderr.on('data', (data) => {
        console.error('[MCP][STDERR]', data.toString());
      });

      this.serverProcess.stdout.on('data', (data) => {
        const line = data.toString();
        if (line.includes('MCP Server iniciado') || line.includes('FALTA ANTHROPIC_API_KEY')) {
          console.log('[MCP]', line.trim());
        }
      });

      // Esperar un poco para que el servidor se inicie
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.conectado = true;
      console.log("Conectado a MCP Server");
      return true;
    } catch (error) {
      console.error("Error conectando a MCP:", error);
      return false;
    }
  }

  async generarResumen(datos) {
    return new Promise((resolve) => {
      if (!this.serverProcess) {
        resolve({
          resumen_ejecutivo: "Error: Servidor MCP no iniciado",
          hallazgos_clave: ["Error en la conexión"],
          recomendaciones: ["Revisar configuración de MCP"],
          timestamp: new Date().toISOString()
        });
        return;
      }

      // Escuchar respuesta
      this.serverProcess.stdout.once('data', (data) => {
        try {
          const resultado = JSON.parse(data.toString());
          resolve(resultado);
        } catch (error) {
          console.error("Error parseando respuesta:", error);
          resolve({
            resumen_ejecutivo: "Error al procesar respuesta de IA",
            hallazgos_clave: ["Error en el análisis"],
            recomendaciones: ["Revisar configuración de IA"],
            timestamp: new Date().toISOString()
          });
        }
      });

      // Enviar comando
      const comando = {
        accion: 'generar_resumen',
        datos: datos
      };
      
      this.serverProcess.stdin.write(JSON.stringify(comando) + '\n');
    });
  }

  async desconectar() {
    if (this.serverProcess) {
      this.serverProcess.kill();
      this.serverProcess = null;
    }
  }
}

module.exports = MCPClient;