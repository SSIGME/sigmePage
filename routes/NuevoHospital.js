import React, { useState } from 'react';
import "./nuevoHospital.css";
import Mapa from "../routes/Mapa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
function AddHospital() {
    const [nombre, setNombre] = useState("");
    const [tipoCentro, setTipoCentro] = useState("Hospital");
    const [numero, setNumero] = useState("");
    const [logo, setLogo] = useState("");
    const [correo, setCorreo] = useState("");
    const [responsable, setResponsable] = useState("");
    const [imagen, setImagen] = useState("");
    const [codigo, setCodigo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [fechaExpiracion, setFechaExpiracion] = useState("");
    const [showCrearAdmin, setShowCrearAdmin] = useState(false);
    const generateCode = (num) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let codigo = '';
        for (let i = 0; i < num; i++) {
            codigo += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return codigo;
    };
    const handleSiguiente = () => {
        // Validación para evitar campos vacíos
        if (!nombre || !tipoCentro || !numero || !correo || !direccion || !fechaExpiracion || !codigo || !responsable || !imagen) {
            alert("Por favor, complete todos los campos antes de continuar.");
            return;
        }
        setShowCrearAdmin(true);
    };
    if (showCrearAdmin) {
        return (React.createElement(Mapa, { hospitalData: {
                nombre,
                tipoCentro,
                numero,
                correo,
                direccion,
                fechaExpiracion,
                responsable,
                imagen,
                codigo,
            } }));
    }
    return (React.createElement("div", { className: "background" },
        React.createElement("div", { className: "clienteDetailContainer" },
            React.createElement("h1", { className: "optioTitle", style: { textAlign: "center", width: "100%" } }, "Nuevo Hospital"),
            React.createElement("div", { className: "clienteItemContainer" },
                React.createElement("span", null,
                    "Nombre: ",
                    React.createElement("br", null)),
                React.createElement("input", { className: "clientInput", type: "text", value: nombre, onChange: (e) => setNombre(e.target.value) })),
            React.createElement("div", { className: "clienteItemContainer" },
                React.createElement("span", null,
                    "Tipo de centro m\u00E9dico: ",
                    React.createElement("br", null)),
                React.createElement("select", { className: "clientInput", value: tipoCentro, onChange: (e) => setTipoCentro(e.target.value) },
                    React.createElement("option", { value: "Hospital" }, "Hospital"),
                    React.createElement("option", { value: "Cl\u00EDnica" }, "Cl\u00EDnica"),
                    React.createElement("option", { value: "Centro de salud" }, "Centro de salud"),
                    React.createElement("option", { value: "Centro m\u00E9dico" }, "Centro m\u00E9dico"),
                    React.createElement("option", { value: "Consultorio" }, "Consultorio"),
                    React.createElement("option", { value: "Policl\u00EDnica" }, "Policl\u00EDnica"),
                    React.createElement("option", { value: "Centro de especialidades" }, "Centro de especialidades"))),
            React.createElement("div", { className: "clienteItemContainer" },
                React.createElement("span", null,
                    "N\u00FAmero: ",
                    React.createElement("br", null)),
                React.createElement("input", { className: "clientInput", type: "text", value: numero, onChange: (e) => setNumero(e.target.value) })),
            React.createElement("div", { className: "clienteItemContainer" },
                React.createElement("span", null,
                    "Correo: ",
                    React.createElement("br", null)),
                React.createElement("input", { className: "clientInput", type: "email", value: correo, onChange: (e) => setCorreo(e.target.value) })),
            React.createElement("div", { className: "clienteItemContainer" },
                React.createElement("span", null,
                    "Responsable mantenimiento: ",
                    React.createElement("br", null)),
                React.createElement("input", { className: "clientInput", type: "text", value: responsable, onChange: (e) => setResponsable(e.target.value) })),
            React.createElement("div", { className: "clienteItemContainer" },
                React.createElement("span", null,
                    "Logo (URL): ",
                    React.createElement("br", null)),
                React.createElement("input", { className: "clientInput", type: "text", value: logo, onChange: (e) => setLogo(e.target.value) })),
            React.createElement("div", { className: "clienteItemContainer" },
                React.createElement("span", null,
                    "Direcci\u00F3n: ",
                    React.createElement("br", null)),
                React.createElement("input", { className: "clientInput", type: "text", value: direccion, onChange: (e) => setDireccion(e.target.value) })),
            React.createElement("div", { className: "clienteItemContainer" },
                React.createElement("span", null,
                    "Fecha de expiraci\u00F3n: ",
                    React.createElement("br", null)),
                React.createElement("input", { className: "clientInput", type: "date", value: fechaExpiracion, onChange: (e) => setFechaExpiracion(e.target.value) })),
            React.createElement("div", { className: "clienteItemContainer" },
                React.createElement("span", null, "Codigo: "),
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px" } },
                    React.createElement("input", { className: "clientInput", type: "text", value: codigo, onChange: (e) => setCodigo(e.target.value.toUpperCase()), style: { textTransform: 'uppercase' } }),
                    React.createElement(FontAwesomeIcon, { icon: faRotate, style: { cursor: "pointer", fontSize: "20px" }, onClick: () => { setCodigo(generateCode(4)); }, title: "GENERAR CODIGO" }))),
            React.createElement("div", { style: { width: "93%" }, className: "clienteItemContainer" },
                React.createElement("span", null,
                    "Imagen (URL): ",
                    React.createElement("br", null)),
                React.createElement("input", { className: "clientInput", type: "text", value: imagen, onChange: (e) => setImagen(e.target.value) })),
            React.createElement("div", { className: "clienteButtonContainer" },
                React.createElement("button", { onClick: handleSiguiente, className: "clienteButton2" }, "Siguiente")))));
}
export default AddHospital;
