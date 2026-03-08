import React from 'react';
import { Link } from 'react-router-dom';
import './Inicio_sesion.css'; // Usamos el mismo CSS para no repetir código
import folderIcon from './Img/image 69.png'; 

function Restablecer_Contrasena() {
  return (
    <div className="full-screen-container">
      <div className="login-card">
        {/* Logo y Título (Se mantienen igual) */}
        <div className="logo-container">
          <div className="circle-logo">
            <img src={folderIcon} alt="SIMA" className="folder-icon" />
          </div>
        </div>

        <h1 className="sima-title">SIMA</h1>
        <p className="sima-subtitle">Sistema de Integración y Metas Académicas</p>

        {/* Formulario de Recuperación */}
        <form className="login-form">
          <div className="input-group">
            <label>Correo</label>
            <input 
              type="email" 
              placeholder="Ingresa tu correo" 
              style={{ fontWeight: '600', color: '#000' }} 
            />
          </div>

          <button type="submit" className="btn-recuperar">
            Enviar recuperación
          </button>
        </form>

        <Link to="/" className="link-registrar">Volver al inicio</Link>
      </div>
    </div>
  );
}

export default Restablecer_Contrasena;