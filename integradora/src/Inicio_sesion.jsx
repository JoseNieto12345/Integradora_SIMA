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
    e.preventDefault(); // Evita que la página se recargue

    try {
      // Llamada al endpoint que creamos en IntelliJ
      const response = await axios.post('http://localhost:8080/api/usuarios/login', {
        email: email,
        password: password
      });

      if (response.status === 200) {
        // Login exitoso: Guardamos datos en el navegador para "recordar" la sesión
        localStorage.setItem('usuarioLogueado', JSON.stringify(response.data));
        
        alert(`¡Bienvenido de nuevo, ${response.data.name_user}!`);
        
        // Redirigir a la pantalla principal (por ejemplo, /dashboard)
        navigate('/registro'); 
      }
    } catch (error) {
      // Si el backend devuelve 401 (Unauthorized)
      console.error("Error en login:", error);
      alert("Correo o contraseña incorrectos. Inténtalo de nuevo.");
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