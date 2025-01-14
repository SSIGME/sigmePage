import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../routes/Dashboard';
import NuevoHospital from '../routes/NuevoHospital';
import NuevoAdministrador from "../routes/NuevoAdministrador"
import NuevoQr from "../routes/NuevoQr"
import HospitalView from "../routes/HospitaView"
import CrearEquipos from "../routes/CrearEquipos"
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/nuevo/hospital' element={<NuevoHospital />} />
          <Route path='/nuevo/administrador' element={<NuevoAdministrador />} />
          <Route path='/nuevo/qr' element={<NuevoQr />} />
          <Route path='/hospital/view' element={<HospitalView />} />
          <Route path='/crear/equipos' element={<CrearEquipos />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
