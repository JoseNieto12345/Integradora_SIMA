import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Home, Users, CheckSquare, LogOut, Plus, Trash2, Search, X } from 'lucide-react';
import './Principal.css';
// import { useEffect } from 'react';


const Principal = () => {
  const navigate = useNavigate();
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [descripcionEquipo, setDescripcionEquipo] = useState('');
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);

// Estado para saber a qué equipo le estamos agregando miembros
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  // --- ESTADOS ---
  const [equipos, setEquipos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  







  // Estado para el usuario que viene de la BD/Sesión
  const [usuario, setUsuario] = useState({
    nombre: 'Cargando...',
    email: '',
    iniciales: ''
  });

  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: '',
    descripcion: ''
  });


  // Nuevos estados para el Modal de Agregar Miembro
  const [mostrarModalUsuarios, setMostrarModalUsuarios] = useState(false);
  const [usuariosActivos, setUsuariosActivos] = useState([]);
  const [equipoSeleccionadoId, setEquipoSeleccionadoId] = useState(null);









  // --- EFECTOS INICIALES ---
  // --- EFECTOS INICIALES Y PROTECCIÓN DE RUTA ---
  useEffect(() => {
    // 1. Buscamos si hay un usuario guardado en el navegador
    const usuarioGuardado = localStorage.getItem('usuario');

    // 2. Si NO hay usuario (nadie ha iniciado sesión), lo regresamos al login
    if (!usuarioGuardado) {
      navigate('/', { replace: true }); // Cambia '/' por la ruta exacta de tu login si es diferente
      return; 
    }

    // 3. Si SÍ hay usuario, lo transformamos de texto a objeto de JavaScript
    const datosUsuario = JSON.parse(usuarioGuardado);

    // 4. Actualizamos el estado para que el menú azul muestre sus datos reales
    setUsuario({
      nombre: datosUsuario.nombre, // Asegúrate de que tu modelo de Java se llame 'nombre'
      email: datosUsuario.email,
      // Sacamos las dos primeras letras del nombre para el circulito
      iniciales: datosUsuario.nombre ? datosUsuario.nombre.substring(0, 2).toUpperCase() : 'US'
    });

    // 5. Cargamos la tabla de equipos
    obtenerEquipos();
    
  }, [navigate]);








  // --- FUNCIONES DE BASE DE DATOS ---




  
  // 1. Obtener el Usuario Logueado (Nombre y Correo)
const obtenerDatosUsuario = async () => {
  try {
    const token = localStorage.getItem('token'); 
    
    // Llamas a tu UsuarioController (Asegúrate de tener un endpoint que devuelva el perfil actual)
    const response = await axios.get('http://localhost:8080/api', {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Guardas en el estado lo que te responda Spring Boot
    setUsuario({
      nombre: response.data.nombre,
      email: response.data.email,
      iniciales: response.data.nombre.substring(0, 2).toUpperCase()
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    // Si da error (ej. token expirado), lo mandas al login
     cerrarSesion(); 
  }
};







// 2. Obtener la tabla de datos
const obtenerEquipos = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get('http://localhost:8080/api/equipos', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // --- AGREGA ESTA LÍNEA ---
    console.log("Datos de la BD:", response.data); 
    
    setEquipos(response.data);
  } catch (error) {
    console.error("Error cargando equipos:", error);
  }
};








  // 3. Crear nuevo equipo
  const handleCrearEquipo = async (e) => {
      e.preventDefault(); 

      const datosParaJava = {
          nombre: nuevoEquipo.nombre,
          descripcion: nuevoEquipo.descripcion
      };

      try {
          const respuesta = await axios.post('http://localhost:8080/api/equipos/crear', datosParaJava);
          
          alert("¡Equipo creado con éxito!");
          
          setMostrarModal(false); 
          setNuevoEquipo({ nombre: '', descripcion: '' }); 
          obtenerEquipos(); 
          
      } catch (error) {
          // --- NUEVO MANEJO DE ERRORES ---
          // Si el servidor nos mandó un error tipo 400 (como el del nombre duplicado)
          if (error.response && error.response.status === 400) {
              alert(error.response.data); // Mostrará: "Ya existe un equipo llamado así..."
          } else {
              // Si fue otro tipo de error (se cayó el server, etc)
              console.error("Error al crear equipo:", error);
              alert("Hubo un error inesperado al intentar crear el equipo.");
          }
      }
  }









  // 4. Eliminar equipo
  const eliminarEquipo = async (id) => {
    if(window.confirm("¿Estás seguro de eliminar este equipo?")) {
        try {
            await axios.delete(`http://localhost:8080/api/equipos/${id}`);
            obtenerEquipos();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }
  };









  // 5. Cerrar Sesión
  const cerrarSesion = () => {
    // Limpiamos los datos
    localStorage.removeItem('token'); 
    localStorage.removeItem('usuario');
    
    // Redirigimos al login BORRANDO el historial previo
    navigate('/', { replace: true }); 
  };



  //6. Asignar usuario a equipo
  const asignarUsuarioAEquipo = async (idUsuario) => {
    // Verificamos que tengamos un equipo seleccionado
    if (!equipoSeleccionado) {
      alert("Por favor, selecciona un equipo primero.");
      return;
    }

    try {
      // AQUÍ ESTABA EL ERROR: Cambiamos .id_equipo por .id
      await axios.put(`http://localhost:8080/api/usuarios/${idUsuario}/equipo/${equipoSeleccionado.id}`);
      
      alert("¡Usuario añadido al equipo con éxito!");
      setMostrarModalUsuarios(false); // Cerramos el modal
      
    } catch (error) {
      console.error("Error al asignar usuario:", error);
      alert("Hubo un problema al asignar el usuario al equipo.");
    }
  };





  //7. Función para abrir el modal y cargar los usuarios
  const abrirModalAgregarMiembro = async (equipo) => {
    console.log("1. Abriendo modal para equipo:", equipo.nombre);
    setCargandoUsuarios(true);
    setEquipoSeleccionado(equipo); // Guardamos TODO el equipo seleccionado
    setMostrarModalUsuarios(true); // Abrimos el modal

    try {
      console.log("2. Pidiendo usuarios al backend...");
      const response = await axios.get('http://localhost:8080/api/usuarios/activos/sin-equipo');
      
      console.log("3. ¡Éxito! Usuarios recibidos:", response.data);
      setUsuariosActivos(response.data); 

      
    } catch (error) {
      console.error("Error al obtener usuarios activos:", error);
    }finally {
    // 2. Terminamos de buscar (ya sea con éxito o error)
    setCargandoUsuarios(false); 
  }
  };






  // --- LÓGICA DE BÚSQUEDA ---
  // Filtramos los equipos en tiempo real según lo que se escriba en el buscador
  const equiposFiltrados = equipos.filter(equipo => 
    equipo.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="sima-container">
      
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="logo-section">
          {/* Aquí puedes poner tu icono SVG del logo si lo tienes */}
          
          <div className="logo-text">
            <h1>SIMA</h1>
            <p>Sistema de Integración y Metas Académicas</p>
          </div>
        </div>








        {/* Navegación: Los onClick usan navigate para ir a otras pantallas */}
        <nav className="nav-menu">
          <button className="nav-button active" onClick={() => navigate('/inicio')}>
            <Home size={22}/> Inicio
          </button>
          <button className="nav-button" onClick={() => navigate('/participantes')}>
            <Users size={22}/> Participantes
          </button>
          <button className="nav-button" onClick={() => navigate('/Tareas')}>
            <CheckSquare size={22}/> Tareas
          </button>
        </nav>










        {/* Info del usuario desde BD */}
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
            <h2>Equipos activos</h2>
            <p className="subtitle-gray">Gestion de equipos y participantes</p>
          </div>
          <button className="btn-agregar" onClick={() => setMostrarModal(true)}>
            <Plus size={18} strokeWidth={3} /> Agregar Equipo
          </button>
        </header>








        {/* Buscador */}
        <div className="search-container">
          <Search size={20} color="#666" />
          <input 
            type="text" 
            className="search-input"
            placeholder="Buscar Equipo..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>








        {/* Tabla Dinámica */}
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th><Users size={16} className="inline-icon" /> Nombre del equipo</th>
                <th className="text-center">Descripcion</th>
                <th className="text-center"><Users size={16} className="inline-icon" /> Miembros</th>
                <th className="text-center">acciones</th>
              </tr>
            </thead>
            <tbody>
              {equiposFiltrados.length > 0 ? (
                equiposFiltrados.map((equipo) => (
                  <tr key={equipo.id}>
                    <td className="equipo-nombre">⇒ {equipo.nombre}</td>
                    <td className="equipo-desc">{equipo.descripcion}</td>
                    <td className="text-center">({equipo.cantidadMiembros || 0})</td>
                    <td className="acciones-cell text-center">
                        {/* <button className="btn-add-inline" onClick={()=> abrirModalAgregarMiembro(equipo.id)}><Plus size={14} /> Agregar</button> */}

                        {/* Este es el botón en la fila de tu tabla de equipos */}
                        <button className="btn-add-inline" onClick={() => abrirModalAgregarMiembro(equipo)}>+ Agregar</button>
                        <button className="btn-delete-inline" onClick={() => eliminarEquipo(equipo.id)}>
                          <Trash2 size={16} />
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center empty-state">No se encontraron equipos</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>











      {/* --- MODAL PARA AGREGAR EQUIPO --- */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Crear Nuevo Equipo</h2>
            <p className="modal-subtitle">Escribe los detalles de tu nuevo equipo</p>
            
            <form onSubmit={handleCrearEquipo} className="modal-form">
              <div className="form-group">
                <label>Nombre del equipo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Equipo de la muerte"
                  value={nuevoEquipo.nombre}
                  onChange={(e) => setNuevoEquipo({...nuevoEquipo, nombre: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Descripcion</label>
                <textarea 
                  placeholder="Describe el propósito del equipo..."
                  value={nuevoEquipo.descripcion}
                  onChange={(e) => setNuevoEquipo({...nuevoEquipo, descripcion: e.target.value})}
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancelar" onClick={() => setMostrarModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-crear-final">
                  Crear Equipo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}





      {/* --- NUEVO: MODAL PARA AGREGAR MIEMBROS --- */}
      {mostrarModalUsuarios && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Agregar Miembro</h2>
              {/* Botón de la X para cerrar */}
              <button 
                className="btn-close-modal"
                onClick={() => setMostrarModalUsuarios(false)} 
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="modal-subtitle">Selecciona un usuario para el equipo</p>
            
          {/* Lista de usuarios con scroll */}
          <div className="usuarios-list-container">
                {cargandoUsuarios ? (
                  // 1. Mientras espera la respuesta del backend
                  <p className="usuarios-empty-state">Buscando usuarios disponibles...</p>
                ) : usuariosActivos.length > 0 ? (
                  // 2. Si ya cargó y SÍ hay usuarios
                <ul className="usuarios-list">
                  {usuariosActivos.map((usuario) => (
                    <li key={usuario.id} className="usuario-list-item">
                      <div className="usuario-info-container">
                        <div className="user-avatar user-avatar-sm">
                        {usuario.nombre ? usuario.nombre.substring(0, 2).toUpperCase() : 'US'}
                      </div>
                  <div>
              <p className="usuario-nombre-texto">{usuario.nombre}</p>
              <p className="usuario-email-texto">{usuario.email}</p>
            </div>
          </div>
          <button className="btn-add-inline" onClick={() => asignarUsuarioAEquipo(usuario.id)}>Añadir </button>
        </li>
      ))}
    </ul>
  ) : (
    // 3. Si ya cargó y NO hay usuarios (lista vacía)
    <p className="usuarios-empty-state" style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
      No hay usuarios disponibles sin equipo en este momento.
    </p>
  )}
</div>

            <div className="modal-actions-right">
              <button className="btn-cancelar" onClick={() => setMostrarModalUsuarios(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div> // FIN DE LA ETIQUETA .sima-container




  );
};

export default Principal;