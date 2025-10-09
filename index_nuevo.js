// Importación de librerías
const express = require("express");
const { Pool } = require("pg");

// Crear instancia de Express
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("frontend"));

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "base2025",
    password: "password",
    port: 5432,
});

// Función auxiliar para construir respuestas estandarizadas
const construirRespuesta = (estado, mensaje, filas, verbo, proceso, datos) => ({
    result_estado: estado, // Estado de la respuesta (ok, error)
    result_message: mensaje, // Mensaje de la respuesta (descripción del resultado)
    result_rows: filas, // Número de filas afectadas o recuperadas
    result_verbo: verbo, // Verbo HTTP (GET, POST, PUT, DELETE)
    result_proceso: proceso, // Proceso (nombre del endpoint)
    result_data: datos // Datos de la respuesta
});
/*
// Función auxiliar para manejo de errores en endpoints
const manejarError = (error, verbo, proceso, res) => {
    const respuesta = construirRespuesta("error", error.message, 0, verbo, proceso, "");
    res.json(respuesta);
};*/

// ==================== ENDPOINTS - USUARIOS ====================

// GET /usuarios - Listar todos los usuarios
app.get("/usuarios", async (req, res) => {
    try {
            const sentenciaSQL = `
                SELECT id, email, nombre, rol, telefono, disponible, 
                       institucion, rol_institucion, latitud, longitud, created_at
                FROM usuarios
                ORDER BY id
            `;

            const resultado = await pool.query(sentenciaSQL);
            const respuesta = construirRespuesta("ok", "usuarios recuperados correctamente", 
                                      resultado.rowCount, "get", "/usuarios", resultado.rows);
            res.json(respuesta);
        } catch (error) {
            const respuesta = construirRespuesta("error", error.message, 0, "get", "/usuarios", "");
            res.json(respuesta);
        }
    });

// GET /usuarios/:id - Obtener usuario por ID
app.get("/usuarios/:id", async (req, res) => {
        let Salida;

        try {
            const { id } = req.params;
            const sentenciaSQL = `
                SELECT id, email, nombre, rol, telefono, disponible, 
                       institucion, rol_institucion, latitud, longitud, created_at
                FROM usuarios
                WHERE id = $1
            `;

            const resultado = await pool.query(sentenciaSQL, [id]);
            Salida = construirRespuesta("ok", "usuario recuperado correctamente", 
                                      resultado.rowCount, "get", "/usuarios/:id", resultado.rows[0]);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "get", "/usuarios/:id", "");
        }

        res.json(Salida);
    });

// POST /usuarios - Crear nuevo usuario
app.post("/usuarios", async (req, res) => {
        let Salida;

        try {
            const { email, password, nombre, rol, telefono, institucion, latitud, longitud } = req.body;

            const sentenciaSQL = `
                INSERT INTO usuarios (email, password, nombre, rol, telefono, institucion, latitud, longitud)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id, email, nombre, rol, telefono, institucion, latitud, longitud
            `;

            const resultado = await pool.query(sentenciaSQL, [email, password, nombre, rol, telefono, institucion, latitud, longitud]);
            Salida = construirRespuesta("ok", "usuario creado correctamente", 
            resultado.rowCount, "post", "/usuarios", resultado.rows[0]);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "post", "/usuarios", "");
        }

        res.json(Salida);
    });

// PUT /usuarios/:id - Actualizar usuario
app.put("/usuarios/:id", async (req, res) => {
        let Salida;

        try {
            const { id } = req.params;
            const { email, password, nombre, rol, telefono, institucion, latitud, longitud } = req.body;

            const sentenciaSQL = `
                UPDATE usuarios
                SET email = $2, password = $3, nombre = $4, rol = $5, 
                    telefono = $6, institucion = $7, latitud = $8, longitud = $9
                WHERE id = $1
                RETURNING id, email, nombre, rol, telefono, institucion, latitud, longitud
            `;

            const resultado = await pool.query(sentenciaSQL, [id, email, password, nombre, rol, telefono, institucion, latitud, longitud]);
            Salida = construirRespuesta("ok", "usuario actualizado correctamente", 
                                      resultado.rowCount, "put", "/usuarios/:id", resultado.rows[0]);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "put", "/usuarios/:id", "");
        }

        res.json(Salida);
    });

// DELETE /usuarios/:id - Eliminar usuario
app.delete("/usuarios/:id", async (req, res) => {
        let Salida;

        try {
            const { id } = req.params;
            const sentenciaSQL = `DELETE FROM usuarios WHERE id = $1 RETURNING id, nombre`;

            const resultado = await pool.query(sentenciaSQL, [id]);
            Salida = construirRespuesta("ok", "usuario eliminado correctamente", 
                                      resultado.rowCount, "delete", "/usuarios/:id", resultado.rows[0]);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "delete", "/usuarios/:id", "");
        }

        res.json(Salida);
    });

// ==================== ENDPOINTS - CATEGORÍAS ====================

// GET /categorias - Listar todas las categorías
app.get("/categorias", async (req, res) => {
        let Salida;

        try {
            const sentenciaSQL = `
                SELECT id, nombre, descripcion, icono, color, estado, fecha_creacion
                FROM categorias
                ORDER BY id
            `;

            const resultado = await pool.query(sentenciaSQL);
            Salida = construirRespuesta("ok", "categorías recuperadas correctamente", 
                                      resultado.rowCount, "get", "/categorias", resultado.rows);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "get", "/categorias", "");
        }

        res.json(Salida);
    });

// GET /categorias/:id - Obtener categoría por ID
app.get("/categorias/:id", async (req, res) => {
        let Salida;

        try {
            const { id } = req.params;
            const sentenciaSQL = `
                SELECT id, nombre, descripcion, icono, color, estado, fecha_creacion
                FROM categorias
                WHERE id = $1
            `;

            const resultado = await pool.query(sentenciaSQL, [id]);
            Salida = construirRespuesta("ok", "categoría recuperada correctamente", 
                                      resultado.rowCount, "get", "/categorias/:id", resultado.rows[0]);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "get", "/categorias/:id", "");
        }

        res.json(Salida);
    });

// POST /categorias - Crear nueva categoría
app.post("/categorias", async (req, res) => {
        let Salida;

        try {
            const { nombre, descripcion, icono, color } = req.body;

            const sentenciaSQL = `
                INSERT INTO categorias (nombre, descripcion, icono, color)
                VALUES ($1, $2, $3, $4)
                RETURNING id, nombre, descripcion, icono, color, estado, fecha_creacion
            `;

            const resultado = await pool.query(sentenciaSQL, [nombre, descripcion, icono, color]);
            Salida = construirRespuesta("ok", "categoría creada correctamente", 
                                      resultado.rowCount, "post", "/categorias", resultado.rows[0]);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "post", "/categorias", "");
        }

        res.json(Salida);
    });

// PUT /categorias/:id - Actualizar categoría
app.put("/categorias/:id", async (req, res) => {
        let Salida;

        try {
            const { id } = req.params;
            const { nombre, descripcion, icono, color, estado } = req.body;

            const sentenciaSQL = `
                UPDATE categorias
                SET nombre = $2, descripcion = $3, icono = $4, color = $5, estado = $6
                WHERE id = $1
                RETURNING id, nombre, descripcion, icono, color, estado, fecha_creacion
            `;

            const resultado = await pool.query(sentenciaSQL, [id, nombre, descripcion, icono, color, estado]);
            Salida = construirRespuesta("ok", "categoría actualizada correctamente", 
                                      resultado.rowCount, "put", "/categorias/:id", resultado.rows[0]);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "put", "/categorias/:id", "");
        }

        res.json(Salida);
    });

// DELETE /categorias/:id - Eliminar categoría
app.delete("/categorias/:id", async (req, res) => {
        let Salida;

        try {
            const { id } = req.params;
            const sentenciaSQL = `DELETE FROM categorias WHERE id = $1 RETURNING id, nombre`;

            const resultado = await pool.query(sentenciaSQL, [id]);
            Salida = construirRespuesta("ok", "categoría eliminada correctamente", 
                                      resultado.rowCount, "delete", "/categorias/:id", resultado.rows[0]);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "delete", "/categorias/:id", "");
        }

        res.json(Salida);
    });

// ==================== ENDPOINTS - PUNTOS ====================

// GET /puntos - Listar todos los puntos con relaciones
app.get("/puntos", async (req, res) => {
        let Salida;

        try {
            const sentenciaSQL = `
                SELECT p.id, p.nombre, p.descripcion, p.latitud, p.longitud, 
                       p.estado, p.fecha_creacion, p.fecha_actualizacion,
                       c.nombre as categoria_nombre, c.icono as categoria_icono, c.color as categoria_color,
                       u.nombre as usuario_nombre, u.email as usuario_email
                FROM puntos p
                JOIN categorias c ON p.categoria_id = c.id
                JOIN usuarios u ON p.usuario_id = u.id
                ORDER BY p.id
            `;

            const resultado = await pool.query(sentenciaSQL);
            Salida = construirRespuesta("ok", "puntos recuperados correctamente", 
                                      resultado.rowCount, "get", "/puntos", resultado.rows);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "get", "/puntos", "");
        }

        res.json(Salida);
    });

// GET /puntos/:id - Obtener punto por ID
app.get("/puntos/:id", async (req, res) => {
        let Salida;

        try {
            const { id } = req.params;
            const sentenciaSQL = `
                SELECT p.id, p.nombre, p.descripcion, p.latitud, p.longitud, 
                       p.categoria_id, p.usuario_id, p.estado, p.fecha_creacion, p.fecha_actualizacion,
                       c.nombre as categoria_nombre, c.icono as categoria_icono, c.color as categoria_color,
                       u.nombre as usuario_nombre, u.email as usuario_email
                FROM puntos p
                JOIN categorias c ON p.categoria_id = c.id
                JOIN usuarios u ON p.usuario_id = u.id
                WHERE p.id = $1
            `;

            const resultado = await pool.query(sentenciaSQL, [id]);
            Salida = construirRespuesta("ok", "punto recuperado correctamente", 
                                      resultado.rowCount, "get", "/puntos/:id", resultado.rows[0]);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "get", "/puntos/:id", "");
        }

        res.json(Salida);
    });

// GET /puntos/por-categoria/:categoriaId - Puntos por categoría
app.get("/puntos/por-categoria/:categoriaId", async (req, res) => {
        let Salida;

        try {
            const { categoriaId } = req.params;
            const sentenciaSQL = `
                SELECT p.id, p.nombre, p.descripcion, p.latitud, p.longitud, 
                       p.estado, p.fecha_creacion,
                       c.nombre as categoria_nombre, c.icono as categoria_icono, c.color as categoria_color,
                       u.nombre as usuario_nombre
                FROM puntos p
                JOIN categorias c ON p.categoria_id = c.id
                JOIN usuarios u ON p.usuario_id = u.id
                WHERE p.categoria_id = $1
                ORDER BY p.nombre
            `;

            const resultado = await pool.query(sentenciaSQL, [categoriaId]);
            Salida = construirRespuesta("ok", "puntos por categoría recuperados correctamente", 
                                      resultado.rowCount, "get", "/puntos/por-categoria/:categoriaId", resultado.rows);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "get", "/puntos/por-categoria/:categoriaId", "");
        }

        res.json(Salida);
    });

// GET /puntos/por-usuario/:usuarioId - Puntos por usuario
app.get("/puntos/por-usuario/:usuarioId", async (req, res) => {
        let Salida;

        try {
            const { usuarioId } = req.params;
            const sentenciaSQL = `
                SELECT p.id, p.nombre, p.descripcion, p.latitud, p.longitud, 
                       p.estado, p.fecha_creacion,
                       c.nombre as categoria_nombre, c.icono as categoria_icono, c.color as categoria_color
                FROM puntos p
                JOIN categorias c ON p.categoria_id = c.id
                WHERE p.usuario_id = $1
                ORDER BY p.fecha_creacion DESC
            `;

            const resultado = await pool.query(sentenciaSQL, [usuarioId]);
            Salida = construirRespuesta("ok", "puntos por usuario recuperados correctamente", 
                                      resultado.rowCount, "get", "/puntos/por-usuario/:usuarioId", resultado.rows);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "get", "/puntos/por-usuario/:usuarioId", "");
        }

        res.json(Salida);
    });

// POST /puntos - Crear nuevo punto
app.post("/puntos", async (req, res) => {
        let Salida;

        try {
            const { nombre, descripcion, latitud, longitud, categoria_id, usuario_id } = req.body;

            const sentenciaSQL = `
                INSERT INTO puntos (nombre, descripcion, latitud, longitud, categoria_id, usuario_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, nombre, descripcion, latitud, longitud, categoria_id, usuario_id, estado, fecha_creacion
            `;

            const resultado = await pool.query(sentenciaSQL, [nombre, descripcion, latitud, longitud, categoria_id, usuario_id]);
            Salida = construirRespuesta("ok", "punto creado correctamente", 
                                      resultado.rowCount, "post", "/puntos", resultado.rows[0]);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "post", "/puntos", "");
        }

        res.json(Salida);
    });

// PUT /puntos/:id - Actualizar punto
app.put("/puntos/:id", async (req, res) => {
        let Salida;

        try {
            const { id } = req.params;
            const { nombre, descripcion, latitud, longitud, categoria_id, usuario_id, estado } = req.body;

            const sentenciaSQL = `
                UPDATE puntos
                SET nombre = $2, descripcion = $3, latitud = $4, longitud = $5, 
                    categoria_id = $6, usuario_id = $7, estado = $8, fecha_actualizacion = CURRENT_TIMESTAMP
                WHERE id = $1
                RETURNING id, nombre, descripcion, latitud, longitud, categoria_id, usuario_id, estado, fecha_actualizacion
            `;

            const resultado = await pool.query(sentenciaSQL, [id, nombre, descripcion, latitud, longitud, categoria_id, usuario_id, estado]);
            Salida = construirRespuesta("ok", "punto actualizado correctamente", 
                                      resultado.rowCount, "put", "/puntos/:id", resultado.rows[0]);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "put", "/puntos/:id", "");
        }

        res.json(Salida);
    });

// DELETE /puntos/:id - Eliminar punto
app.delete("/puntos/:id", async (req, res) => {
        let Salida;

        try {
            const { id } = req.params;
            const sentenciaSQL = `DELETE FROM puntos WHERE id = $1 RETURNING id, nombre`;

            const resultado = await pool.query(sentenciaSQL, [id]);
            Salida = construirRespuesta("ok", "punto eliminado correctamente", 
                                      resultado.rowCount, "delete", "/puntos/:id", resultado.rows[0]);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "delete", "/puntos/:id", "");
        }

        res.json(Salida);
    });

// ==================== ENDPOINTS - CONSULTAS ESPECIALES ====================

// GET /estadisticas - Estadísticas generales del sistema
app.get("/estadisticas", async (req, res) => {
        let Salida;

        try {
            const sentenciaSQL = `
                SELECT 
                    (SELECT COUNT(*) FROM usuarios) as total_usuarios,
                    (SELECT COUNT(*) FROM categorias) as total_categorias,
                    (SELECT COUNT(*) FROM puntos) as total_puntos,
                    (SELECT COUNT(*) FROM usuarios WHERE rol = 'administrador') as total_administradores,
                    (SELECT COUNT(*) FROM usuarios WHERE rol = 'operador') as total_operadores,
                    (SELECT COUNT(*) FROM puntos WHERE estado = 'activo') as puntos_activos
            `;

            const resultado = await pool.query(sentenciaSQL);
            Salida = construirRespuesta("ok", "estadísticas recuperadas correctamente", 
                                      resultado.rowCount, "get", "/estadisticas", resultado.rows[0]);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "get", "/estadisticas", "");
        }

        res.json(Salida);
    });

// GET /puntos/con-relaciones - Puntos con datos completos de relaciones
app.get("/puntos/con-relaciones", async (req, res) => {
        let Salida;

        try {
            const sentenciaSQL = `
                SELECT 
                    p.id, p.nombre as punto_nombre, p.descripcion as punto_descripcion,
                    p.latitud, p.longitud, p.estado as punto_estado, p.fecha_creacion,
                    c.id as categoria_id, c.nombre as categoria_nombre, c.descripcion as categoria_descripcion,
                    c.icono as categoria_icono, c.color as categoria_color,
                    u.id as usuario_id, u.nombre as usuario_nombre, u.email as usuario_email,
                    u.rol as usuario_rol, u.institucion as usuario_institucion
                FROM puntos p
                JOIN categorias c ON p.categoria_id = c.id
                JOIN usuarios u ON p.usuario_id = u.id
                ORDER BY p.fecha_creacion DESC
            `;

            const resultado = await pool.query(sentenciaSQL);
            Salida = construirRespuesta("ok", "puntos con relaciones recuperados correctamente", 
                                      resultado.rowCount, "get", "/puntos/con-relaciones", resultado.rows);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "get", "/puntos/con-relaciones", "");
        }

        res.json(Salida);
    });

// GET /categorias/con-puntos - Categorías con conteo de puntos
app.get("/categorias/con-puntos", async (req, res) => {
        let Salida;

        try {
            const sentenciaSQL = `
                SELECT 
                    c.id, c.nombre, c.descripcion, c.icono, c.color, c.estado,
                    COUNT(p.id) as total_puntos,
                    COUNT(CASE WHEN p.estado = 'activo' THEN 1 END) as puntos_activos
                FROM categorias c
                LEFT JOIN puntos p ON c.id = p.categoria_id
                GROUP BY c.id, c.nombre, c.descripcion, c.icono, c.color, c.estado
                ORDER BY total_puntos DESC
            `;

            const resultado = await pool.query(sentenciaSQL);
            Salida = construirRespuesta("ok", "categorías con puntos recuperadas correctamente", 
                                      resultado.rowCount, "get", "/categorias/con-puntos", resultado.rows);
        } catch (error) {
            Salida = construirRespuesta("error", error.message, 0, "get", "/categorias/con-puntos", "");
        }

        res.json(Salida);
    });

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📊 API REST: http://localhost:${PORT}`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
});

