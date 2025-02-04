import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import url from "../url.json";
import "./nuevoAdminstrador.css";
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import logo from "../src/assets/LOGO.png";
import HospitalView from "../routes/HospitaView"
function AddHospital({ hospitalData }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [dataid, setDataid] =useState("")

  const [showCrearAdmin, setShowCrearAdmin] = useState(false); 
  const handleSiguiente = async () => {
    const data = {
      nombre: hospitalData.nombre,
      fechaCreacion: hospitalData.fechaCreacion,
      fechaExpiracion: hospitalData.fechaExpiracion,
      tipo: hospitalData.tipoCentro,
      correoContacto: hospitalData.correo,
      direccion: hospitalData.direccion,
      imagen: hospitalData.imagen,
      telefono: hospitalData.numero,
      departamento: hospitalData.departamentoSeleccionado,
      ciudad: hospitalData.ciudadSeleccionada,
      responsableMantenimiento: hospitalData.responsable,
      nombreAdministrador: name,
      contrasenaAdministrador: password,
      documentoAdministrador: number,
    };

    try {
      const response = await axios.post(`${url.url}/hospital`, data);
      if (response.status === 201) {
        data.msg = response.data.msg;
        console.log("codigo :", data.msg);
        setDataid(response.data.hospital_id)
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
    let contrasena = '';
    for (let i = 0; i < 9; i++) {
      contrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    setPassword(contrasena);
  };

  
  if (showCrearAdmin) {
    return(
    <div className="background">
    <div className="background"></div>
    

    
    <div className="clienteDetailContainer3 fadeIn">
    <h1   className="title1">Credenciales</h1>

      {/* Información de la contraseña de administrador */}
      <div className="infoContainer">
        <label className="label">Contraseña del Administrador:</label>
        <span className="value">{password}</span>
      </div>

      {/* Información del código del hospital */}
      <div className="infoContainer">
        <label className="label">Código del Hospital:</label>
        <span className="value">{dataid}</span>
        <h1 className="title">{}</h1>
      </div>
      <button  onClick={()=>{window.location.reload()}} className="clienteButton1">
          Volver
        </button>
    </div>
    
  </div>)
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
              readOnly
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
