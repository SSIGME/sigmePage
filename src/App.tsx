import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../routes/Dashboard";
// import NuevoHospital from '../routes/NuevoHospital';
// import NuevoAdministrador from "../routes/NuevoAdministrador"
import QRSPage from "../routes/SubirDocumentos";
import EquipoDetail from "../routes/EquipoDetail";
// import CrearEquipos from "../routes/CrearEquipos"
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/" element={<QRSPage />} />
          <Route path="/qrs" element={<QRSPage />} />
          <Route path="/EquipoDetail/:codigoIdentificacion" element={<EquipoDetail />} />
          </Routes>
      </Router>
    </>
  );
}

export default App;
