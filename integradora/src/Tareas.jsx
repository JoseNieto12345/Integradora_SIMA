import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Home, Users, CheckSquare, LogOut, Plus, Search, X, Calendar, User } from 'lucide-react';
import './Tareas.css';

const Tareas = () => {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [tareas, setTareas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todas');
  const [mostrarModal, setMostrarModal] = useState(false);
  
  const [usuario, setUsuario] = useState({
    nombre: 'Cargando...',
    email: '',
    iniciales: 'US'
  });

  // Estado ajustado para que coincida exactamente con la BD
  const [nuevaTarea, setNuevaTarea] = useState({
    name_tarea: '',
    descripcion: '',
    estado: 'Por Hacer',
    prioridad: 'Media',
    id_usuario: '',
    fecha_entrega: ''
  });

  // --- EFECTOS INICIALES ---
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (!usuarioGuardado) {
      navigate('/', { replace: true });
      return; 
    }

    const datosUsuario = JSON.parse(usuarioGuardado);
    setUsuario({
      nombre: datosUsuario.nombre,
      email: datosUsuario.email,
      iniciales: datosUsuario.nombre ? datosUsuario.nombre.substring(0, 2).toUpperCase() : 'US'
    });

    obtenerTareas();
  }, [navigate]);

  // --- FUNCIONES DE BASE DE DATOS ---
  
  const obtenerTareas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/tareas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Tareas cargadas:", response.data);
      setTareas(response.data);
    } catch (error) {
      console.error("Error cargando tareas:", error);
    }
  };

  const handleCrearTarea = async (e) => {
    e.preventDefault(); 
    try {
      const token = localStorage.getItem('token');
      
      // Formatear la fecha para que Spring Boot (LocalDateTime) la acepte (Añade la hora T00:00:00)
      const fechaFormateada = nuevaTarea.fecha_entrega ? `${nuevaTarea.fecha_entrega}T00:00:00` : null;

      const tareaAEnviar = {
        ...nuevaTarea,
        id_usuario: parseInt(nuevaTarea.id_usuario), // Asegurar que sea número
        fecha_entrega: fechaFormateada
      };

      await axios.post('http://localhost:8080/api/tareas/crear', tareaAEnviar, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("¡Tarea creada con éxito!");
      setMostrarModal(false); 
      
      // Reiniciar formulario
      setNuevaTarea({
        name_tarea: '', descripcion: '', estado: 'Por Hacer', 
        prioridad: 'Media', id_usuario: '', fecha_entrega: ''
      }); 
      obtenerTareas();
    } catch (error) {
      console.error("Error al crear tarea:", error);
      alert("Hubo un error al intentar crear la tarea. Revisa la consola.");
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('usuario');
    navigate('/', { replace: true }); 
  };

  // --- LÓGICA DE FILTRADO ---
  const tareasFiltradas = tareas.filter(tarea => {
    // Cambiado de tarea.titulo a tarea.name_tarea
    const coincideBusqueda = tarea.name_tarea?.toLowerCase().includes(busqueda.toLowerCase()) || 
                             tarea.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'Todas' || tarea.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  const conteoTareas = {
    Todas: tareas.length,
    'Por Hacer': tareas.filter(t => t.estado === 'Por Hacer').length,
    'En Progreso': tareas.filter(t => t.estado === 'En Progreso').length,
    'Completadas': tareas.filter(t => t.estado === 'Completado').length, // Asegúrate de que coincida con el Enum
  };

  return (
    <div className="sima-container">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-text">
            <h1>SIMA</h1>
            <p>Sistema de Integración y Metas Académicas</p>
          </div>
        </div>

        <nav className="nav-menu">
          <button className="nav-button" onClick={() => navigate('/Principal')}>
            <Home size={22}/> Inicio
          </button>
          <button className="nav-button" onClick={() => navigate('/Principal')}>
            <Users size={22}/> Participantes
          </button>
          <button className="nav-button active" onClick={() => navigate('/Tareas')}>
            <CheckSquare size={22}/> Tareas
          </button>
        </nav>

        <div className="user-section">
            <div className="user-info">
                <div className="user-avatar">{usuario.iniciales}</div>
                <div>
                    <p className="user-name">{usuario.nombre}</p>
                    <p className="user-email">{usuario.email}</p>
                </div>
            </div>
            <button className="btn-logout" onClick={cerrarSesion}>
                <LogOut size={18} /> cerrar sesion
            </button>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="main-content">
        <header className="header-main">
          <div>
            <h2 className="title-xxl">Tareas</h2>
            <p className="subtitle-gray">Gestor de tareas</p>
          </div>
          <button className="btn-agregar-black" onClick={() => setMostrarModal(true)}>
            <Plus size={18} strokeWidth={3} /> Nueva Tarea
          </button>
        </header>

        {/* Buscador */}
        <div className="search-container rounded-search">
          <Search size={20} color="#666" />
          <input 
            type="text" 
            className="search-input"
            placeholder="Buscar Tareas..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Pestañas de Filtro */}
        <div className="filter-tabs">
          {['Todas', 'Por Hacer', 'En Progreso', 'Completadas'].map(filtro => (
            <button 
              key={filtro}
              className={`tab-button ${filtroEstado === filtro ? 'active' : ''}`}
              onClick={() => setFiltroEstado(filtro === 'Completadas' ? 'Completado' : filtro)}
            >
              {filtro} ({conteoTareas[filtro]})
            </button>
          ))}
        </div>

        {/* Grid de Tareas */}
        <div className="tareas-grid">
          {tareasFiltradas.length > 0 ? (
            tareasFiltradas.map((tarea) => (
              <div key={tarea.id_tarea} className="tarea-card">
                <h3>{tarea.name_tarea}</h3>
                <p>{tarea.descripcion}</p>
                
                <div className="tarea-badges">
                  <span className={`badge badge-estado ${tarea.estado.replace(/\s+/g, '-').toLowerCase()}`}>
                    {tarea.estado}
                  </span>
                  <span className={`badge badge-prioridad ${tarea.prioridad.toLowerCase()}`}>
                    {tarea.prioridad}
                  </span>
                </div>

                <div className="tarea-footer">
                  <span className="tarea-asignado">
                    <User size={14} /> ID Usuario: {tarea.id_usuario}
                  </span>
                  <span className="tarea-fecha">
                    {/* Extraemos solo la parte de la fecha YYYY-MM-DD */}
                    <Calendar size={14} /> {tarea.fecha_entrega ? tarea.fecha_entrega.split('T')[0] : 'Sin fecha'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-state">No se encontraron tareas con estos filtros.</p>
          )}
        </div>
      </main>

      {/* --- MODAL PARA NUEVA TAREA --- */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-tarea-lg">
            <div className="modal-header">
              <h2 className="modal-title">Nueva Tarea</h2>
              <button className="btn-close-modal" onClick={() => setMostrarModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCrearTarea} className="modal-form-grid">
              <div className="form-group full-width">
                <label>Titulo de Tarea</label>
                <input 
                  type="text" required
                  value={nuevaTarea.name_tarea}
                  onChange={(e) => setNuevaTarea({...nuevaTarea, name_tarea: e.target.value})}
                />
              </div>

              <div className="form-group full-width">
                <label>Descripcion</label>
                <textarea 
                  required rows="3"
                  value={nuevaTarea.descripcion}
                  onChange={(e) => setNuevaTarea({...nuevaTarea, descripcion: e.target.value})}
                />
              </div>

              <div className="form-group">
  <label>Estado</label>
  <select 
  value={nuevaTarea.estado || ''} 
  onChange={(e) => setNuevaTarea({...nuevaTarea, estado: e.target.value})}
  required
>
  <option value="" disabled>Selecciona un estado...</option>
  {/* Asegúrate de que lo que está en value="" sea EXACTAMENTE lo que acepta tu BD */}
  <option value="Por Hacer">Por Hacer</option>
  <option value="En Progreso">En Progreso</option>  {/* Cambia el value si es necesario */}
  <option value="Completado">Completado</option>
</select>
</div>

<div className="form-group">
  <label>Prioridad</label>
  <select 
  value={nuevaTarea.prioridad || ''} 
  onChange={(e) => setNuevaTarea({...nuevaTarea, prioridad: e.target.value})}
  required
>
  <option value="" disabled>Selecciona una prioridad...</option>
  {/* Asegúrate de que lo que está en value="" sea EXACTAMENTE lo que acepta tu BD */}
  <option value="Baja">Baja</option>
    <option value="Media">Media</option>
    <option value="Alta">Alta</option>
</select>
</div>

              <div className="form-group">
                <label>Usuario Asignado</label>
                <input 
                  type="number" required
                  placeholder="ID numérico..."
                  value={nuevaTarea.id_usuario}
                  onChange={(e) => setNuevaTarea({...nuevaTarea, id_usuario: e.target.value})}
                />
              </div>

              <div className="form-group">
  <label>Fecha de entrega</label>
  <input 
    type="date" 
    required
    defaultValue={nuevaTarea.fecha_entrega} 
    onChange={(e) => setNuevaTarea({...nuevaTarea, fecha_entrega: e.target.value})}
    onClick={(e) => e.target.showPicker && e.target.showPicker()} /* Esto fuerza a que se abra el calendario al hacer clic */
  />
</div>

              <div className="modal-actions-right full-width mt-4">
                <button type="submit" className="btn-agregar-black">
                  + Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tareas;