import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx' // Importamos el jefe de las rutas

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App /> {/* Cambiamos Inicio_sesion por App */}
  </StrictMode>,
)