import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../routes/Dashboard';
// import NuevoHospital from '../routes/NuevoHospital';
// import NuevoAdministrador from "../routes/NuevoAdministrador"
import QRSPage from "../routes/QRSPage"

// import CrearEquipos from "../routes/CrearEquipos"
function App() {
  return (
    <>
      <Router>
        <Routes>

          <Route path='/dashboard' element={<Dashboard />} />
          
          <Route path='/' element={<QRSPage />} />
          <Route path='/qrs' element={<QRSPage />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
