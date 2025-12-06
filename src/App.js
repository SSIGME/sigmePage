import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../routes/Dashboard";
import OtherDocuments from "../routes/Equipo/OtherDocuments";
import EquipoDetail from "../routes/EquipoDetail";
import CrearEquipos from "../routes/CrearEquipos";
import HojaVida from "../routes/hojaVida/hojaVida";
import * as React from "react";
function App() {
    return (React.createElement(React.Fragment, null,
        React.createElement(Router, null,
            React.createElement(Routes, null,
                React.createElement(Route, { path: "/", element: React.createElement(Dashboard, null) }),
                React.createElement(Route, { path: "/Documents/:codigoIdentificacion", element: React.createElement(OtherDocuments, null) }),
                React.createElement(Route, { path: "/hojavida/:codigoIdentificacion", element: React.createElement(HojaVida, null) }),
                React.createElement(Route, { path: "/EquipoDetail/:codigoIdentificacion", element: React.createElement(EquipoDetail, null) }),
                React.createElement(Route, { path: "/crear/equipos", element: React.createElement(CrearEquipos, null) })))));
}
export default App;
