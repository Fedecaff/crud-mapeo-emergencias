# Sistema de Mapeo de Emergencias - Catamarca

> **Proyecto Educativo:** Versión simplificada con fines académicos para demostrar comprensión integral de desarrollo fullstack.

Sistema completo de gestión de puntos de interés para bomberos, con 3 tablas relacionadas: **usuarios**, **categorías** y **puntos**.

## Características del Sistema

### Base de Datos (3 Tablas Relacionadas)
- **`usuarios`** - Operadores y administradores del sistema
- **`categorias`** - Tipos de puntos (Hidrantes, Hospitales, Policía, etc.)
- **`puntos`** - Puntos de interés en el mapa con coordenadas GPS

### Relaciones
```
USUARIOS (1) ←→ (N) PUNTOS (N) ←→ (1) CATEGORIAS
```

### API REST Completa
- **CRUD completo** para las 3 tablas
- **Consultas especiales** con JOINs
- **Estadísticas** del sistema
- **Validaciones** y manejo de errores

### Frontend Moderno
- **Bootstrap 5** para diseño responsive
- **Leaflet.js** para mapa interactivo
- **Font Awesome** para iconografía
- **Formularios** para crear registros
- **Tablas** para mostrar datos
- **Dashboard** con estadísticas

## Instrucciones de Instalación

### 1. Configurar Base de Datos
```bash
# Ejecutar en PostgreSQL
psql -U postgres -d base2025 -f setup_database.sql
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Iniciar Servidor
```bash
npm start
# o para desarrollo
npm run dev
```

### 4. Acceder al Sistema
- **Frontend:** http://localhost:3000
- **API:** http://localhost:3000/api/

## Endpoints de la API

### Usuarios
- `GET /usuarios` - Listar todos los usuarios
- `GET /usuarios/:id` - Obtener usuario por ID
- `POST /usuarios` - Crear nuevo usuario
- `PUT /usuarios/:id` - Actualizar usuario
- `DELETE /usuarios/:id` - Eliminar usuario

### Categorías
- `GET /categorias` - Listar todas las categorías
- `GET /categorias/:id` - Obtener categoría por ID
- `POST /categorias` - Crear nueva categoría
- `PUT /categorias/:id` - Actualizar categoría
- `DELETE /categorias/:id` - Eliminar categoría

### Puntos
- `GET /puntos` - Listar todos los puntos (con relaciones)
- `GET /puntos/:id` - Obtener punto por ID
- `GET /puntos/por-categoria/:categoriaId` - Puntos por categoría
- `GET /puntos/por-usuario/:usuarioId` - Puntos por usuario
- `POST /puntos` - Crear nuevo punto
- `PUT /puntos/:id` - Actualizar punto
- `DELETE /puntos/:id` - Eliminar punto

### Consultas Especiales
- `GET /estadisticas` - Estadísticas generales del sistema
- `GET /puntos/con-relaciones` - Puntos con datos completos
- `GET /categorias/con-puntos` - Categorías con conteo de puntos

## Funcionalidades del Frontend

### Dashboard
- Estadísticas en tiempo real
- Contadores de usuarios, categorías y puntos
- Resumen de administradores y operadores

### Gestión de Usuarios
- Listar usuarios con filtros
- Crear nuevos usuarios
- Formulario completo con validaciones
- Roles: administrador/operador

### Gestión de Categorías
- Listar categorías con iconos y colores
- Crear nuevas categorías
- Configurar iconos Font Awesome
- Selección de colores

### Gestión de Puntos
- Listar puntos con relaciones
- Crear nuevos puntos
- Mapa interactivo con marcadores
- Coordenadas GPS precisas

### Mapa Interactivo
- Centrado en Catamarca
- Marcadores por categoría
- Popups informativos
- Zoom automático

## Ejemplos de Uso

### Crear un Usuario
```json
POST /usuarios
{
  "nombre": "Juan Pérez",
  "email": "juan@bomberos.com",
  "password": "password123",
  "rol": "operador",
  "telefono": "+54 9 383 123-4567",
  "institucion": "Bomberos Catamarca",
  "latitud": -28.4685,
  "longitud": -65.7789
}
```

### Crear una Categoría
```json
POST /categorias
{
  "nombre": "Hidrantes",
  "descripcion": "Puntos de agua para emergencias",
  "icono": "fas fa-fire-extinguisher",
  "color": "#ff0000"
}
```

### Crear un Punto
```json
POST /puntos
{
  "nombre": "Hidrante Plaza Central",
  "descripcion": "Hidrante principal de la plaza 25 de Mayo",
  "latitud": -28.4685,
  "longitud": -65.7789,
  "categoria_id": 1,
  "usuario_id": 1
}
```

## Estructura de la Base de Datos

### Tabla: usuarios
```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'operador',
    telefono VARCHAR(20),
    disponible BOOLEAN DEFAULT true,
    institucion VARCHAR(100),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: categorias
```sql
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(100),
    color VARCHAR(7) DEFAULT '#007bff',
    estado VARCHAR(50) DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: puntos
```sql
CREATE TABLE puntos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id),
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    estado VARCHAR(50) DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Tecnologías Utilizadas

### Backend
- **Node.js** + **Express**
- **PostgreSQL** con **pg**
- **API REST** completa
- **Manejo de errores** estructurado

### Frontend
- **HTML5** + **CSS3**
- **Bootstrap 5** para diseño
- **JavaScript ES6+** modular
- **Leaflet.js** para mapas
- **Font Awesome** para iconos

### Base de Datos
- **PostgreSQL** local
- **Relaciones** con FOREIGN KEYS
- **Índices** para optimización
- **Datos de ejemplo** incluidos

## Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar con nodemon
npm start               # Iniciar servidor

# Base de datos
psql -U postgres -d base2025 -f setup_database.sql

# Verificar conexión
curl http://localhost:3000/estadisticas
```

## Datos de Ejemplo Incluidos

El sistema incluye datos de ejemplo:
- **3 usuarios** (1 administrador, 2 operadores)
- **5 categorías** (Hidrantes, Hospitales, Policía, Bomberos, Escuelas)
- **5 puntos** distribuidos en Catamarca

## Sistema Listo para Usar

El sistema está completamente funcional y listo para demostrar:
- **Frontend, Backend y Base de Datos** integrados
- **3 tablas relacionadas** funcionando
- **CRUD completo** implementado
- **Mapa interactivo** con marcadores
- **Interfaz moderna** con Bootstrap
- **API REST** documentada

**Perfecto para demostrar el uso y entendimiento de frontend, backend y base de datos.**





