import { useState } from 'react'; // Paso 1: Importar useState
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate
import axios from 'axios'; // Paso 2: Importar axios
import image from './Img/image 69.png';
import './Inicio_sesion.css'

















function Inicio_sesion() {
  // Paso 3: Crear estados para los inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Paso 4: Función para manejar el envío del formulario
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/usuarios/login', {
        email: email,
        password: password
      });

      if (response.status === 200) {
        // Tu backend devuelve el objeto completo (con nombre, email, id, etc.)
        const usuarioBackend = response.data;

        // Lo convertimos a texto y lo guardamos en la "memoria" del navegador
        localStorage.setItem('usuario', JSON.stringify(usuarioBackend));
        
        // Redirigimos a la pantalla principal (borrando el historial para que no puedan regresar con la flecha)
        navigate('/principal', { replace: true }); 
      }
    } catch (error) {
      console.error("Error en login:", error);

      // Verificamos si el servidor respondió con un error específico
      if (error.response) {
        const status = error.response.status;
        const mensajeBackend = error.response.data;

        if (status === 403) {
          // Aquí cae si el usuario está INACTIVO
          alert(mensajeBackend); 
        } else if (status === 401) {
          // Aquí cae si la contraseña está mal
          alert("Contraseña incorrecta. Inténtalo de nuevo.");
        } else if (status === 404) {
          // Aquí cae si el correo no existe
          alert("El usuario no está registrado.");
        } else {
          // Cualquier otro error (500, etc.)
          alert("Ocurrió un error en el servidor. Inténtalo más tarde.");
        }
      } else {
        // Si ni siquiera se pudo conectar al servidor
        alert("No se pudo conectar con el servidor. Revisa tu conexión.");
      }
    }
  };

















  return (
    <div className="full-screen-container">
      <div className="login-card">
        <div className="circle-logo">
          <img src={image} alt="SIMA" />
        </div>

        <h1 className="sima-title">SIMA</h1>
        <p className="sima-subtitle">Sistema de Integración y Metas Académicas</p>

        {/* Paso 5: Agregar el evento onSubmit */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Correo</label>
            <input 
              type="email" 
              placeholder="ejemplo@correo.com" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Captura el texto
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Captura la contraseña
            />
            
            <Link to="/restablecer" className="forgot-link">¿Olvidaste tu contraseña?</Link>
          </div>

          <button type="submit" className="btn-iniciar">Iniciar Sesión</button>
        </form>
        <Link to="/registro" className="link-registrar" style={{marginTop: '20px', display: 'block', textAlign: 'center'}}>
            ¿No tienes cuenta? Regístrate aquí
        </Link> 
        
      </div>
    </div>
  );
}

export default Inicio_sesion;