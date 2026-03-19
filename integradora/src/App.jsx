import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio_sesion from "./Inicio_sesion";
import Registrar from "./Registrar";
import Restablecer_Contrasena from "./Restablecer_Contrasena";
import Principal from "./Principal";
import Tareas from "./Tareas";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el Login */}
        <Route path="/" element={<Inicio_sesion />} />
        
        {/* Ruta para el Registro (debe coincidir con el 'to' de tu Link) */}
        <Route path="/registro" element={<Registrar />} />

        <Route path="/restablecer" element={<Restablecer_Contrasena />} />

        <Route path="/principal" element={<Principal />} />

        <Route path="/tareas" element={<Tareas />} />
      </Routes>
    </Router>
  );
}

export default App;