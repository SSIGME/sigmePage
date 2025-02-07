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
    if (!name || !password || !number ) {
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
      logo:hospitalData.logo,
    };

    try {
      console.log("Enviando datos:", data);
      const response = await axios.post(`${url.url}/hospital`, data);
      if (response.status === 201) {
        console.log("Hospital creado:", response.data);
        setDataid(response.data.hospital_id);
        setShowCrearAdmin(true);
      } else {
        console.error("Error en la creación del hospital:", response.data.msg);
      }
    } catch (error) {
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
    return (
      <div className="background">
        <div className="background"></div>
        <div className="clienteDetailContainer1 fadeIn">
          <h1 className="title1">Credenciales</h1>
          <div className="infoContainer">
            <label className="label">Contraseña del Administrador:</label>
            <span
              className="value"
              onClick={() => handleCopyToClipboard(password)}
            >
              {password}
            </span>
          </div>
          <div className="infoContainer">
            <label className="label">Código del Hospital:</label>
            <span
              className="value"
              onClick={() => handleCopyToClipboard(hospitalData.codigo)}
            >
              {hospitalData.codigo}
            </span>
          </div>
          <button onClick={() => window.location.reload()} className="clienteButton1">
            Volver
          </button>
        </div>

        {/* Modal de copia */}
        {modalVisible && (
          <div className="modal">
            <p>¡Copiado al portapapeles!</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="background">
      <div className="background"></div>

      <div className="clienteDetailContainer1">
        <h1 style={{ width: "100%", textAlign: "center", marginBottom: "10%" }}>Administrador</h1>

        <div className="clienteItemContainer1">
          <span>Nombre: </span>
          <input
            className="clientInput1"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="clienteItemContainer1">
          <span>Documento: </span>
          <input
            className="clientInput1"
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>

        <div className="clienteItemContainer1">
          <span>Contraseña: </span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              className="clientInput1"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Permitir edición
            />
            <FontAwesomeIcon
              icon={faKey}
              style={{ cursor: "pointer", fontSize: "20px" }}
              onClick={generarContrasena}
              title="Generar contraseña"
            />
          </div>
        </div>

        <div className="clienteButtonContainer1">
          <button onClick={handleSiguiente} className="clienteButton1">
            Crear hospital
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddHospital;
