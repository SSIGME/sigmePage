import React, { useState } from 'react';
import CrearAdministrador from "../routes/NuevoAdministrador";
import "./nuevoAdminstrador.css";
import MapSelector from "./MapSelector";
function AddHospital({ hospitalData }) {
    const [showCrearAdmin, setShowCrearAdmin] = useState(false);
    const [updatedHospitalData, setUpdatedHospitalData] = useState({});
    // Estado para saber si se ha seleccionado un punto
    const [pointSelected, setPointSelected] = useState(false);
    // Actualizamos handleSelect para recibir un objeto LocationData
    const handleSelect = ({ lat, lng, city, state }) => {
        console.log("Coordenadas seleccionadas:", { lat, lng }, city, state);
        setUpdatedHospitalData({
            ...hospitalData,
            ciudad: city,
            departamento: state,
            coordenadas: { lat, lng }
        });
        // Indicamos que se ha seleccionado un punto
        setPointSelected(true);
    };
    // Función que se ejecuta al hacer clic en el botón "Siguiente"
    const handleContinue = () => {
        if (!pointSelected) {
            alert('Debes seleccionar un punto en el mapa para continuar');
            return;
        }
        setShowCrearAdmin(true);
    };
    if (showCrearAdmin) {
        return React.createElement(CrearAdministrador, { hospitalData: updatedHospitalData });
    }
    return (React.createElement("div", { className: "background" },
        React.createElement("div", { className: "background" }),
        React.createElement("div", { className: "clienteDetailContainer4 fadeIn" },
            React.createElement(MapSelector, { onSelect: handleSelect }),
            React.createElement("div", { className: "clienteButtonContainer1" },
                React.createElement("button", { onClick: handleContinue, className: "clienteButton3" }, "Siguiente")))));
}
export default AddHospital;
