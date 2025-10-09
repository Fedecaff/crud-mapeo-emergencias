// ==================== ARCHIVO DE VISTAS ====================
// Este archivo solo contiene funciones para RENDERIZAR HTML
// La lógica de coordinación está en controlador.js

import { fnRecuperarEstadisticas } from "./modelo.js";

// Variables globales para el mapa
let mapa = null;
let marcadores = [];

// ==================== FUNCIONES AUXILIARES ====================

export function inicializarMapa() {
    // Centrar en Catamarca
    mapa = L.map('mapa').setView([-28.4685, -65.7789], 13);
    
    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(mapa);
    
    return mapa;
}

export function mostrarLoading(mostrar = true) {
    const loading = document.querySelector('.loading');
    if (mostrar) {
        loading.classList.add('show');
    } else {
        loading.classList.remove('show');
    }
}

export function mostrarResultados(contenido) {
    document.getElementById('resultados').innerHTML = contenido;
}

export function mostrarError(mensaje) {
    mostrarResultados(`
        <div class="alert alert-danger" role="alert">
            <i class="fas fa-exclamation-triangle"></i> ${mensaje}
        </div>
    `);
}

export function mostrarExito(mensaje) {
    mostrarResultados(`
        <div class="alert alert-success" role="alert">
            <i class="fas fa-check-circle"></i> ${mensaje}
        </div>
    `);
}

// ==================== FUNCIONES DE VISTA - USUARIOS ====================

export function mostrarUsuarios(usuarios) {
    let html = `
        <h6><i class="fas fa-users"></i> Lista de Usuarios (${usuarios.length})</h6>
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Institución</th>
                        <th>Disponible</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    usuarios.forEach(usuario => {
        const disponible = usuario.disponible ? 
            '<span class="badge bg-success">Sí</span>' : 
            '<span class="badge bg-danger">No</span>';
        
        html += `
            <tr>
                <td>${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td><span class="badge bg-${usuario.rol === 'administrador' ? 'primary' : 'secondary'}">${usuario.rol}</span></td>
                <td>${usuario.institucion || '-'}</td>
                <td>${disponible}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    mostrarResultados(html);
}

export function mostrarFormularioUsuario() {
    const html = `
        <h6><i class="fas fa-user-plus"></i> Crear Nuevo Usuario</h6>
        <form id="formUsuario">
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="nombre" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" required>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="password" class="form-label">Contraseña</label>
                        <input type="password" class="form-control" id="password" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="rol" class="form-label">Rol</label>
                        <select class="form-select" id="rol" required>
                            <option value="operador">Operador</option>
                            <option value="administrador">Administrador</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="telefono" class="form-label">Teléfono</label>
                        <input type="text" class="form-control" id="telefono">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="institucion" class="form-label">Institución</label>
                        <input type="text" class="form-control" id="institucion">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="latitud" class="form-label">Latitud</label>
                        <input type="number" step="0.000001" class="form-control" id="latitud" value="-28.4685">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="longitud" class="form-label">Longitud</label>
                        <input type="number" step="0.000001" class="form-control" id="longitud" value="-65.7789">
                    </div>
                </div>
            </div>
            <button type="submit" class="btn btn-success">
                <i class="fas fa-save"></i> Crear Usuario
            </button>
        </form>
    `;
    
    mostrarResultados(html);
    
    // Agregar event listener al formulario
    document.getElementById('formUsuario').addEventListener('submit', async (e) => {
        e.preventDefault();
        await crearUsuario();
    });
}

async function crearUsuario() {
    const datos = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        rol: document.getElementById('rol').value,
        telefono: document.getElementById('telefono').value,
        institucion: document.getElementById('institucion').value,
        latitud: parseFloat(document.getElementById('latitud').value),
        longitud: parseFloat(document.getElementById('longitud').value)
    };
    
    mostrarLoading(true);
    try {
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const resultado = await response.json();
        if (resultado.result_estado === 'ok') {
            mostrarExito('Usuario creado correctamente');
            cargarEstadisticas(); // Actualizar estadísticas
        } else {
            mostrarError(resultado.result_message);
        }
    } catch (error) {
        mostrarError('Error al crear usuario: ' + error.message);
    } finally {
        mostrarLoading(false);
    }
}

// ==================== FUNCIONES DE VISTA - CATEGORÍAS ====================

export function mostrarCategorias(categorias) {
    let html = `
        <h6><i class="fas fa-tags"></i> Lista de Categorías (${categorias.length})</h6>
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Icono</th>
                        <th>Color</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    categorias.forEach(categoria => {
        const estado = categoria.estado === 'activo' ? 
            '<span class="badge bg-success">Activo</span>' : 
            '<span class="badge bg-danger">Inactivo</span>';
        
        html += `
            <tr>
                <td>${categoria.id}</td>
                <td>
                    <span class="badge" style="background-color: ${categoria.color}; color: white;">
                        <i class="${categoria.icono || 'fas fa-tag'}"></i> ${categoria.nombre}
                    </span>
                </td>
                <td>${categoria.descripcion || '-'}</td>
                <td><i class="${categoria.icono || 'fas fa-tag'}" style="color: ${categoria.color}; font-size: 18px;"></i></td>
                <td><span class="badge" style="background-color: ${categoria.color}">${categoria.color}</span></td>
                <td>${estado}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    mostrarResultados(html);
}

export function mostrarFormularioCategoria() {
    const html = `
        <h6><i class="fas fa-tag"></i> Crear Nueva Categoría</h6>
        <form id="formCategoria">
            <div class="mb-3">
                <label for="nombreCategoria" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="nombreCategoria" required>
            </div>
            <div class="mb-3">
                <label for="descripcionCategoria" class="form-label">Descripción</label>
                <textarea class="form-control" id="descripcionCategoria" rows="3"></textarea>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="iconoCategoria" class="form-label">Icono (Font Awesome)</label>
                        <input type="text" class="form-control" id="iconoCategoria" placeholder="fas fa-fire-extinguisher">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="colorCategoria" class="form-label">Color</label>
                        <input type="color" class="form-control" id="colorCategoria" value="#007bff">
                    </div>
                </div>
            </div>
            <button type="submit" class="btn btn-success">
                <i class="fas fa-save"></i> Crear Categoría
            </button>
        </form>
    `;
    
    mostrarResultados(html);
    
    // Agregar event listener al formulario
    document.getElementById('formCategoria').addEventListener('submit', async (e) => {
        e.preventDefault();
        await crearCategoria();
    });
}

async function crearCategoria() {
    const datos = {
        nombre: document.getElementById('nombreCategoria').value,
        descripcion: document.getElementById('descripcionCategoria').value,
        icono: document.getElementById('iconoCategoria').value,
        color: document.getElementById('colorCategoria').value
    };
    
    mostrarLoading(true);
    try {
        const response = await fetch('http://localhost:3000/categorias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const resultado = await response.json();
        if (resultado.result_estado === 'ok') {
            mostrarExito('Categoría creada correctamente');
            cargarEstadisticas(); // Actualizar estadísticas
        } else {
            mostrarError(resultado.result_message);
        }
    } catch (error) {
        mostrarError('Error al crear categoría: ' + error.message);
    } finally {
        mostrarLoading(false);
    }
}

// ==================== FUNCIONES DE VISTA - PUNTOS ====================

export function mostrarPuntos(puntos) {
    let html = `
        <h6><i class="fas fa-map-marker-alt"></i> Lista de Puntos (${puntos.length})</h6>
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Categoría</th>
                        <th>Usuario</th>
                        <th>Coordenadas</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    puntos.forEach(punto => {
        const estado = punto.estado === 'activo' ? 
            '<span class="badge bg-success">Activo</span>' : 
            '<span class="badge bg-danger">Inactivo</span>';
        
        html += `
            <tr>
                <td>${punto.id}</td>
                <td>${punto.nombre}</td>
                <td>${punto.descripcion || '-'}</td>
                <td><span class="badge" style="background-color: ${punto.categoria_color}">${punto.categoria_nombre}</span></td>
                <td>${punto.usuario_nombre}</td>
                <td><small>${punto.latitud}, ${punto.longitud}</small></td>
                <td>${estado}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editarPunto(${punto.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    mostrarResultados(html);
}

export function actualizarMapa(puntos) {
    // Limpiar marcadores existentes
    marcadores.forEach(marcador => mapa.removeLayer(marcador));
    marcadores = [];
    
    // Agregar nuevos marcadores con iconos personalizados
    puntos.forEach(punto => {
        // Crear icono personalizado según la categoría
        const iconoPersonalizado = L.divIcon({
            className: 'marcador-personalizado',
            html: `<div style="
                background-color: ${punto.categoria_color};
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 3px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                color: white;
                font-size: 14px;
            ">
                <i class="${punto.categoria_icono || 'fas fa-map-marker-alt'}"></i>
            </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        const marcador = L.marker([punto.latitud, punto.longitud], { icon: iconoPersonalizado })
            .bindPopup(`
                <div style="min-width: 200px;">
                    <strong>${punto.nombre}</strong><br>
                    <small>${punto.descripcion || 'Sin descripción'}</small><br>
                    <span class="badge" style="background-color: ${punto.categoria_color}">
                        <i class="${punto.categoria_icono || 'fas fa-map-marker-alt'}"></i> ${punto.categoria_nombre}
                    </span><br>
                    <small>Por: ${punto.usuario_nombre}</small>
                </div>
            `)
            .addTo(mapa);
        
        marcadores.push(marcador);
    });
    
    // Ajustar vista del mapa si hay puntos
    if (puntos.length > 0) {
        const grupo = new L.featureGroup(marcadores);
        mapa.fitBounds(grupo.getBounds().pad(0.1));
    }
}

export function mostrarFormularioPunto() {
    const html = `
        <h6><i class="fas fa-plus-circle"></i> Crear Nuevo Punto</h6>
        <form id="formPunto">
            <div class="mb-3">
                <label for="nombrePunto" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="nombrePunto" required>
            </div>
            <div class="mb-3">
                <label for="descripcionPunto" class="form-label">Descripción</label>
                <textarea class="form-control" id="descripcionPunto" rows="3"></textarea>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="latitudPunto" class="form-label">Latitud</label>
                        <input type="number" step="0.000001" class="form-control" id="latitudPunto" value="-28.4685" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="longitudPunto" class="form-label">Longitud</label>
                        <input type="number" step="0.000001" class="form-control" id="longitudPunto" value="-65.7789" required>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="categoriaPunto" class="form-label">Categoría</label>
                        <select class="form-select" id="categoriaPunto" required>
                            <option value="">Seleccionar categoría...</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="usuarioPunto" class="form-label">Usuario</label>
                        <select class="form-select" id="usuarioPunto" required>
                            <option value="">Seleccionar usuario...</option>
                        </select>
                    </div>
                </div>
            </div>
            <button type="submit" class="btn btn-success">
                <i class="fas fa-save"></i> Crear Punto
            </button>
        </form>
    `;
    
    mostrarResultados(html);
    
    // Cargar opciones de categorías y usuarios
    cargarOpcionesFormularioPunto();
    
    // Agregar event listener al formulario
    document.getElementById('formPunto').addEventListener('submit', async (e) => {
        e.preventDefault();
        await crearPunto();
    });
}

async function cargarOpcionesFormularioPunto() {
    try {
        // Cargar categorías
        const categoriasResponse = await fetch('http://localhost:3000/categorias');
        const categoriasData = await categoriasResponse.json();
        
        if (categoriasData.result_estado === 'ok') {
            const selectCategoria = document.getElementById('categoriaPunto');
            categoriasData.result_data.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;
                option.textContent = categoria.nombre;
                selectCategoria.appendChild(option);
            });
        }
        
        // Cargar usuarios
        const usuariosResponse = await fetch('http://localhost:3000/usuarios');
        const usuariosData = await usuariosResponse.json();
        
        if (usuariosData.result_estado === 'ok') {
            const selectUsuario = document.getElementById('usuarioPunto');
            usuariosData.result_data.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.id;
                option.textContent = usuario.nombre;
                selectUsuario.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar opciones:', error);
    }
}

async function crearPunto() {
    const datos = {
        nombre: document.getElementById('nombrePunto').value,
        descripcion: document.getElementById('descripcionPunto').value,
        latitud: parseFloat(document.getElementById('latitudPunto').value),
        longitud: parseFloat(document.getElementById('longitudPunto').value),
        categoria_id: parseInt(document.getElementById('categoriaPunto').value),
        usuario_id: parseInt(document.getElementById('usuarioPunto').value)
    };
    
    mostrarLoading(true);
    try {
        const response = await fetch('http://localhost:3000/puntos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const resultado = await response.json();
        if (resultado.result_estado === 'ok') {
            mostrarExito('Punto creado correctamente');
            cargarEstadisticas(); // Actualizar estadísticas
        } else {
            mostrarError(resultado.result_message);
        }
    } catch (error) {
        mostrarError('Error al crear punto: ' + error.message);
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

export function mostrarFormularioEditarPunto(punto) {
    const html = `
        <h6><i class="fas fa-edit"></i> Editar Punto</h6>
        <form id="formEditarPunto">
            <input type="hidden" id="editPuntoId" value="${punto.id}">
            <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-control" id="editNombrePunto" value="${punto.nombre}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea class="form-control" id="editDescripcionPunto" rows="3">${punto.descripcion || ''}</textarea>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Latitud</label>
                        <input type="number" step="0.000001" class="form-control" id="editLatitudPunto" value="${punto.latitud}" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Longitud</label>
                        <input type="number" step="0.000001" class="form-control" id="editLongitudPunto" value="${punto.longitud}" required>
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label">Categoría ID</label>
                <input type="number" class="form-control" id="editCategoriaPunto" value="${punto.categoria_id}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Usuario ID</label>
                <input type="number" class="form-control" id="editUsuarioPunto" value="${punto.usuario_id}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Estado</label>
                <select class="form-select" id="editEstadoPunto" required>
                    <option value="activo" ${punto.estado === 'activo' ? 'selected' : ''}>Activo</option>
                    <option value="inactivo" ${punto.estado === 'inactivo' ? 'selected' : ''}>Inactivo</option>
                </select>
            </div>
            <div class="d-grid gap-2">
                <button type="submit" class="btn btn-warning">
                    <i class="fas fa-save"></i> Guardar Cambios
                </button>
                <button type="button" class="btn btn-secondary" onclick="listarPuntos()">
                    <i class="fas fa-times"></i> Cancelar
                </button>
            </div>
        </form>
    `;
    
    mostrarResultados(html);
    
    // Agregar event listener al formulario
    // guardarCambiosPunto está en controlador.js y se importa dinámicamente
    import('./controlador.js').then(modulo => {
        document.getElementById('formEditarPunto').addEventListener('submit', modulo.guardarCambiosPunto);
    });
}

// ==================== FUNCIONES DE CONSULTAS ESPECIALES ====================

export function mostrarGraficosEstadisticas(datos) {
    const html = `
        <h6><i class="fas fa-chart-pie"></i> Gráficos Estadísticos del Sistema</h6>
        <div class="row">
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">Distribución por Categoría</h6>
                        <canvas id="graficoDonut"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">Top 5 Usuarios</h6>
                        <canvas id="graficoBarras"></canvas>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">Tendencia Mensual</h6>
                        <canvas id="graficoLineas"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">Distribución General</h6>
                        <canvas id="graficoEstados"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    mostrarResultados(html);
    
    // Crear gráficos después de que el HTML esté en el DOM
    setTimeout(() => {
        crearGraficoDonut(datos.puntos_por_categoria);
        crearGraficoBarras(datos.puntos_por_usuario);
        crearGraficoLineas(datos.puntos_por_mes);
        crearGraficoEstados(datos.distribucion);
    }, 100);
}

// Gráfico 1: Donut - Puntos por Categoría
function crearGraficoDonut(datos) {
    const ctx = document.getElementById('graficoDonut');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: datos.map(d => d.categoria),
            datasets: [{
                label: 'Cantidad de Puntos',
                data: datos.map(d => d.cantidad),
                backgroundColor: datos.map(d => d.color),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Gráfico 2: Barras - Puntos por Usuario
function crearGraficoBarras(datos) {
    const ctx = document.getElementById('graficoBarras');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datos.map(d => d.usuario),
            datasets: [{
                label: 'Puntos Creados',
                data: datos.map(d => d.cantidad),
                backgroundColor: '#36a2eb',
                borderColor: '#1e88e5',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Gráfico 3: Líneas - Puntos por Mes
function crearGraficoLineas(datos) {
    const ctx = document.getElementById('graficoLineas');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: datos.map(d => d.mes.trim()),
            datasets: [{
                label: 'Puntos Creados',
                data: datos.map(d => d.cantidad),
                borderColor: '#4bc0c0',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Gráfico 4: Barras Horizontales - Distribución General
function crearGraficoEstados(datos) {
    const ctx = document.getElementById('graficoEstados');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Puntos Activos', 'Puntos Inactivos', 'Administradores', 'Operadores'],
            datasets: [{
                label: 'Cantidad',
                data: [
                    datos.puntos_activos,
                    datos.puntos_inactivos,
                    datos.administradores,
                    datos.operadores
                ],
                backgroundColor: [
                    '#4caf50',
                    '#f44336',
                    '#ff9800',
                    '#2196f3'
                ],
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

export function mostrarEstadisticasDetalladas(stats) {
    const html = `
        <h6><i class="fas fa-chart-bar"></i> Estadísticas Detalladas del Sistema</h6>
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">Usuarios</h6>
                        <p class="card-text">
                            <strong>Total:</strong> ${stats.total_usuarios}<br>
                            <strong>Administradores:</strong> ${stats.total_administradores}<br>
                            <strong>Operadores:</strong> ${stats.total_operadores}
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">Puntos</h6>
                        <p class="card-text">
                            <strong>Total:</strong> ${stats.total_puntos}<br>
                            <strong>Activos:</strong> ${stats.puntos_activos}<br>
                            <strong>Categorías:</strong> ${stats.total_categorias}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    mostrarResultados(html);
}


export function mostrarPuntosConRelacionesDetalladas(puntos) {
    let html = `
        <h6><i class="fas fa-link"></i> Puntos con Relaciones Completas (${puntos.length})</h6>
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Punto</th>
                        <th>Categoría</th>
                        <th>Usuario</th>
                        <th>Coordenadas</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    puntos.forEach(punto => {
        html += `
            <tr>
                <td>
                    <strong>${punto.punto_nombre}</strong><br>
                    <small class="text-muted">${punto.punto_descripcion || 'Sin descripción'}</small>
                </td>
                <td>
                    <span class="badge" style="background-color: ${punto.categoria_color}">
                        <i class="${punto.categoria_icono || 'fas fa-map-marker-alt'}"></i> ${punto.categoria_nombre}
                    </span><br>
                    <small class="text-muted">${punto.categoria_descripcion || 'Sin descripción'}</small>
                </td>
                <td>
                    <strong>${punto.usuario_nombre}</strong><br>
                    <small class="text-muted">${punto.usuario_email}</small><br>
                    <span class="badge bg-${punto.usuario_rol === 'administrador' ? 'primary' : 'secondary'}">${punto.usuario_rol}</span>
                </td>
                <td><small>${punto.latitud}, ${punto.longitud}</small></td>
                <td><small>${new Date(punto.fecha_creacion).toLocaleDateString()}</small></td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    mostrarResultados(html);
}

// ==================== FUNCIÓN PARA CARGAR ESTADÍSTICAS ====================

export async function cargarEstadisticas() {
    try {
        const datos = await fnRecuperarEstadisticas();
        if (datos.result_estado === 'ok') {
            const stats = datos.result_data;
            document.getElementById('total-usuarios').textContent = stats.total_usuarios;
            document.getElementById('total-categorias').textContent = stats.total_categorias;
            document.getElementById('total-puntos').textContent = stats.total_puntos;
            document.getElementById('total-administradores').textContent = stats.total_administradores;
            document.getElementById('total-operadores').textContent = stats.total_operadores;
            document.getElementById('puntos-activos').textContent = stats.puntos_activos;
        }
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}
