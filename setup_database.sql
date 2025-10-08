-- SCRIPT PARA CONFIGURAR LA BASE DE DATOS DEL SISTEMA DE MAPEO
-- Ejecutar en PostgreSQL para crear las 3 tablas relacionadas

-- Eliminar tablas existentes si existen
DROP TABLE IF EXISTS puntos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- TABLA 1: usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'operador',
    telefono VARCHAR(20),
    disponible BOOLEAN DEFAULT true,
    foto_perfil VARCHAR(500),
    institucion VARCHAR(100),
    rol_institucion VARCHAR(50),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    ultima_actualizacion_ubicacion TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA 2: categorias
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(100),
    color VARCHAR(7) DEFAULT '#007bff',
    campos_personalizados JSONB,
    estado VARCHAR(50) DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA 3: puntos
CREATE TABLE puntos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id),
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    datos_personalizados JSONB,
    estado VARCHAR(50) DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_puntos_categoria ON puntos(categoria_id);
CREATE INDEX idx_puntos_usuario ON puntos(usuario_id);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_categorias_estado ON categorias(estado);

-- Datos de ejemplo para testing
INSERT INTO usuarios (email, password, nombre, rol, telefono, institucion, latitud, longitud) VALUES
('admin@bomberos.com', 'admin123', 'Administrador Sistema', 'administrador', '+54 9 383 123-4567', 'Bomberos Catamarca', -28.4685, -65.7789),
('operador1@bomberos.com', 'op123', 'Juan Pérez', 'operador', '+54 9 383 234-5678', 'Bomberos Catamarca', -28.4700, -65.7800),
('operador2@bomberos.com', 'op123', 'María García', 'operador', '+54 9 383 345-6789', 'Bomberos Catamarca', -28.4650, -65.7750);

INSERT INTO categorias (nombre, descripcion, icono, color) VALUES
('Hidrantes', 'Puntos de agua para emergencias', 'fas fa-tint', '#00bfff'),
('Hospitales', 'Centros de salud y emergencias médicas', 'fas fa-hospital', '#00ff00'),
('Policía', 'Comisarías y puntos de seguridad', 'fas fa-shield-alt', '#0000ff'),
('Bomberos', 'Cuarteles de bomberos', 'fas fa-fire-extinguisher', '#ff0000'),
('Escuelas', 'Instituciones educativas', 'fas fa-school', '#ff6600');

INSERT INTO puntos (nombre, descripcion, latitud, longitud, categoria_id, usuario_id) VALUES
('Hidrante Plaza Central', 'Hidrante principal de la plaza 25 de Mayo', -28.4685, -65.7789, 1, 2),
('Hospital San Juan', 'Hospital principal de la ciudad', -28.4700, -65.7800, 2, 2),
('Comisaría Centro', 'Comisaría del centro de la ciudad', -28.4650, -65.7750, 3, 3),
('Cuartel Bomberos', 'Cuartel principal de bomberos', -28.4720, -65.7820, 4, 2),
('Escuela Primaria', 'Escuela primaria del barrio centro', -28.4600, -65.7700, 5, 3);

-- Verificar que todo se creó correctamente
SELECT 'Usuarios creados:' as info, COUNT(*) as cantidad FROM usuarios
UNION ALL
SELECT 'Categorías creadas:', COUNT(*) FROM categorias
UNION ALL
SELECT 'Puntos creados:', COUNT(*) FROM puntos;
s