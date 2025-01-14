import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import url from "../url.json";
import "./nuevoAdminstrador.css";
import { useLocation } from 'react-router-dom';
import logo from "../src/assets/LOGO.png"
function AddHospital() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState(""); // Campo para la contraseña
  const location = useLocation();
  const hospitalData = location.state || {};
  
  
  

    const handleSiguiente = async () => {
      const data = {
        nombre: hospitalData.nombre,
        fechaCreacion:hospitalData.fechaCreacion,
        fechaExpiracion: hospitalData.fechaExpiracion, // Asume que tienes este estado para la fecha de expiración
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
        navigate("/hospital/view", { state: data });
      } else {
        console.error("Error en la creación del hospital:", response.data.msg);
      }
    } catch (error) {
      console.error("Error al enviar datos a la API:", error);
    }
  };
  




  // Función para generar una contraseña aleatoria
  const generarContrasena = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let contrasena = '';
    for (let i = 0; i < 9 ; i++) {
      contrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    setPassword(contrasena); // Actualiza el estado con la contraseña generada
  };

  return (
    <div className="backgrounda">
      <div className="background"></div>
      <a href="/">
        <img className="logo" src={logo} alt="logo" />
      </a>
      
      <div className="clienteDetailContainer1">
        <h1 style={{width:"100%", textAlign:"center", marginBottom:"10%"}}>Administrador</h1>

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

   

        {/* Campo para la contraseña */}
        <div className="clienteItemContainer1">
          <span>Contraseña: </span>
          <input
            className="clientInput1"
            type="text"
            value={password}
            readOnly // Hace que no se pueda editar manualmente
          />
          <button className="generatePasswordButton" style={{border:"none", padding:"5px", borderRadius:"5px"}} onClick={generarContrasena}>
            Generar contraseña
          </button>
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
