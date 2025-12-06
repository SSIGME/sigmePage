import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import url from "../url.json";
import "./nuevoAdminstrador.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
function AddHospital({ hospitalData }) {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [password, setPassword] = useState("");
    const [dataid, setDataid] = useState("");
    const [showCrearAdmin, setShowCrearAdmin] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const handleCopyToClipboard = (text) => {
        // Copiar al portapapeles
        navigator.clipboard.writeText(text)
            .then(() => {
            // Mostrar el modal indicando que el valor fue copiado
            setModalVisible(true);
            setTimeout(() => {
                setModalVisible(false);
            }, 2000); // Ocultar el modal después de 2 segundos
        })
            .catch((err) => console.error('Error al copiar al portapapeles:', err));
    };
    const handleSiguiente = async () => {
        if (!name || !password || !number) {
            alert("Por favor, complete todos los campos antes de continuar.");
            return;
        }
        const data = {
            nombre: hospitalData.nombre,
            fechaExpiracion: hospitalData.fechaExpiracion,
            tipo: hospitalData.tipoCentro,
            correoContacto: hospitalData.correo,
            direccion: hospitalData.direccion,
            imagen: hospitalData.imagen,
            telefono: hospitalData.numero,
            departamento: hospitalData.departamento,
            coordenadas: hospitalData.coordenadas,
            ciudad: hospitalData.ciudad,
            codigo: hospitalData.codigo,
            responsableMantenimiento: hospitalData.responsable,
            nombreAdministrador: name,
            contrasenaAdministrador: password,
            documentoAdministrador: number,
            logo: hospitalData.logo,
        };
        try {
            console.log("Enviando datos:", data);
            const response = await axios.post(`${url.url}/hospital`, data);
            if (response.status === 201) {
                console.log("Hospital creado:", response.data);
                setDataid(response.data.hospital_id);
                setShowCrearAdmin(true);
            }
            else {
                console.error("Error en la creación del hospital:", response.data.msg);
            }
        }
        catch (error) {
            console.error("Error al enviar datos a la API:", error);
        }
    };
    const generarContrasena = () => {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let nuevaContrasena = '';
        for (let i = 0; i < 9; i++) {
            nuevaContrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        setPassword(nuevaContrasena);
    };
    if (showCrearAdmin) {
        return (React.createElement("div", { className: "background" },
            React.createElement("div", { className: "background" }),
            React.createElement("div", { className: "clienteDetailContainer1 fadeIn" },
                React.createElement("h1", { className: "title1" }, "Credenciales"),
                React.createElement("div", { className: "infoContainer" },
                    React.createElement("label", { className: "label" }, "Contrase\u00F1a del Administrador:"),
                    React.createElement("span", { className: "value", onClick: () => handleCopyToClipboard(password) }, password)),
                React.createElement("div", { className: "infoContainer" },
                    React.createElement("label", { className: "label" }, "C\u00F3digo del Hospital:"),
                    React.createElement("span", { className: "value", onClick: () => handleCopyToClipboard(hospitalData.codigo) }, hospitalData.codigo)),
                React.createElement("button", { onClick: () => window.location.reload(), className: "clienteButton1" }, "Volver")),
            modalVisible && (React.createElement("div", { className: "modal" },
                React.createElement("p", null, "\u00A1Copiado al portapapeles!")))));
    }
    return (React.createElement("div", { className: "background" },
        React.createElement("div", { className: "background" }),
        React.createElement("div", { className: "clienteDetailContainer1" },
            React.createElement("h1", { style: { color: "#000", width: "100%", textAlign: "center", marginBottom: "10%" } }, "Administrador"),
            React.createElement("div", { className: "clienteItemContainer1" },
                React.createElement("span", null, "Nombre: "),
                React.createElement("input", { className: "clientInput1", type: "text", value: name, onChange: (e) => setName(e.target.value) })),
            React.createElement("div", { className: "clienteItemContainer1" },
                React.createElement("span", null, "Documento: "),
                React.createElement("input", { className: "clientInput1", type: "text", value: number, onChange: (e) => setNumber(e.target.value) })),
            React.createElement("div", { className: "clienteItemContainer1" },
                React.createElement("span", null, "Contrase\u00F1a: "),
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px" } },
                    React.createElement("input", { className: "clientInput1", type: "text", value: password, onChange: (e) => setPassword(e.target.value) }),
                    React.createElement(FontAwesomeIcon, { icon: faKey, style: { cursor: "pointer", fontSize: "20px" }, onClick: generarContrasena, title: "Generar contrase\u00F1a" }))),
            React.createElement("div", { className: "clienteButtonContainer1" },
                React.createElement("button", { onClick: handleSiguiente, className: "clienteButton1" }, "Crear hospital")))));
}
export default AddHospital;
