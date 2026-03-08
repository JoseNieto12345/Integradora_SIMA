import { useState } from 'react'; // Paso 1: Importar useState
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Paso 2: Importar axios
import './Inicio_sesion.css';
import folderIcon from './Img/image 69.png';

function Registrar() {
  const navigate = useNavigate();

  // Paso 3: Crear el estado para capturar los datos del formulario
  const [formData, setFormData] = useState({
    name_user: '', // Asegúrate de que coincida con el nombre en tu clase Java
    email: '',
    password: '',
    confirmarPassword: '',
    tipo: 'usuario' // Valor por defecto para tu ENUM
  });

  // Paso 4: Función para actualizar el estado cada vez que el usuario escribe
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Paso 5: Función para enviar los datos a Spring Boot
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (formData.password !== formData.confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      // URL de tu controlador en IntelliJ
      const url = "http://localhost:8080/api/usuarios";
      
      const res = await axios.post(url, {
        name_user: formData.name_user,
        email: formData.email,
        password: formData.password,
        tipo: formData.tipo
      });

      if (res.status === 200 || res.status === 201) {
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        navigate("/"); // Redirigir al login
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error en el servidor. Revisa si Spring Boot está corriendo.");
    }
  };

  return (
    <div className="full-screen-container">
      <div className="login-card">
        <div className="logo-container">
          <div className="circle-logo">
            <img src={folderIcon} alt="Icono Carpeta" className="folder-icon" style={{ width: '70%' }} />
          </div>
        </div>

        <div className="header-sima">
          <h1 className="sima-title">SIMA</h1>
          <p className="sima-subtitle">Sistema de Integración y Metas Académicas</p>
        </div>

        {/* Agregamos el onSubmit */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nombre de Usuario</label>
            <input 
              type="text" 
              name="name_user" 
              required 
              onChange={handleChange} 
            />
          </div>
          <div className="input-group">
            <label>Correo</label>
            <input 
              type="email" 
              name="email" 
              required 
              onChange={handleChange} 
            />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              name="password" 
              required 
              onChange={handleChange} 
            />
          </div>
          <div className="input-group">
            <label>Confirmar Contraseña</label>
            <input 
              type="password" 
              name="confirmarPassword" 
              required 
              onChange={handleChange} 
            />
          </div>

          <button type="submit" className="btn-iniciar">Registrar</button>
        </form>

        <Link to="/" className="link-registrar">¿Ya tienes cuenta? Inicia Sesión</Link>
      </div>
    </div>
  );
}

export default Registrar;