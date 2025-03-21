import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../routes/Dashboard';

import EquipoDetail from "../routes/EquipoDetail";
import CrearEquipos from "../routes/CrearEquipos"
import Documentos from "../routes/SubirDocumentos"
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Dashboard/>} />
 
   
          <Route path="/EquipoDetail/:codigoIdentificacion" element={<EquipoDetail />} />
          <Route path='/crear/equipos' element={<CrearEquipos />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
