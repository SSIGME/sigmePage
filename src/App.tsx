import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../routes/Dashboard";
import OtherDocuments from "../routes/Equipo/OtherDocuments";

import EquipoDetail from "../routes/EquipoDetail";
import CrearEquipos from "../routes/CrearEquipos";
import HojaVida from "../routes/hojaVida/hojaVida";
import Documentos from "../routes/SubirDocumentos";
import * as React from "react";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/Documents/:codigoIdentificacion"
            element={<OtherDocuments />}
          />

          <Route
            path="/hojavida/:codigoIdentificacion"
            element={<HojaVida />}
          />
          <Route
            path="/EquipoDetail/:codigoIdentificacion"
            element={<EquipoDetail />}
          />
          <Route path="/crear/equipos" element={<CrearEquipos />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
