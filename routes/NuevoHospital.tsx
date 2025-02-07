import React, { useState } from 'react';
import "./nuevoHospital.css";
import Mapa from "../routes/Mapa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
interface HospitalData {
  nombre: string;
  tipoCentro: string;
  numero: string;
  correo: string;
  direccion: string;
  fechaExpiracion: string;
  responsable: string;
  imagen: string;
  codigo: string;
  logo:string
}

function AddHospital() {
  const [nombre, setNombre] = useState("");
  const [tipoCentro, setTipoCentro] = useState("Hospital");
  const [numero, setNumero] = useState("");
  const [logo, setLogo]=useState("")
  const [correo, setCorreo] = useState("");
  const [responsable, setResponsable] = useState("");
  const [imagen, setImagen] = useState("");
  const [codigo, setCodigo] = useState("")
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
    if (!nombre || !tipoCentro || !numero || !correo || !direccion || !fechaExpiracion|| !codigo || !responsable || !imagen) {
      alert("Por favor, complete todos los campos antes de continuar.");
      return;
    }

    setShowCrearAdmin(true);
  };

  if (showCrearAdmin) {
    return (
      <Mapa
        hospitalData={{
          nombre,
          tipoCentro,
          numero,
          correo,
          direccion,
          fechaExpiracion,
          responsable,
          imagen,
          codigo,
        }}
      />
    );
  }

  return (
    <div className="background">
      <div className="clienteDetailContainer">
        <h1 style={{ textAlign: "center" , width:"100%"}}>Nuevo Hospital</h1>

        <div className="clienteItemContainer">
          <span>Nombre: <br /></span>
          <input
            className="clientInput"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="clienteItemContainer">
          <span>Tipo de centro médico: <br /></span>
          <select
            className="clientInput"
            value={tipoCentro}
            onChange={(e) => setTipoCentro(e.target.value)}
          >
            <option value="Hospital">Hospital</option>
            <option value="Clínica">Clínica</option>
            <option value="Centro de salud">Centro de salud</option>
            <option value="Centro médico">Centro médico</option>
            <option value="Consultorio">Consultorio</option>
            <option value="Policlínica">Policlínica</option>
            <option value="Centro de especialidades">Centro de especialidades</option>
          </select>
        </div>

        <div className="clienteItemContainer">
          <span>Número: <br /></span>
          <input
            className="clientInput"
            type="text"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
        </div>

        <div className="clienteItemContainer">
          <span>Correo: <br /></span>
          <input
            className="clientInput"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <div className="clienteItemContainer">
          <span>Responsable mantenimiento: <br /></span>
          <input
            className="clientInput"
            type="text"
            value={responsable}
            onChange={(e) => setResponsable(e.target.value)}
          />
        </div>

        <div className="clienteItemContainer">
          <span>Logo (URL): <br /></span>
          <input
            className="clientInput"
            type="text"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
          />
        </div>

        <div className="clienteItemContainer">
          <span>Dirección: <br /></span>
          <input
            className="clientInput"
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>

        <div className="clienteItemContainer">
          <span>Fecha de expiración: <br /></span>
          <input
            className="clientInput"
            type="date"
            value={fechaExpiracion}
            onChange={(e) => setFechaExpiracion(e.target.value)}
          />
        </div>
        
        <div className="clienteItemContainer">
          <span>Codigo: </span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
  className="clientInput"
  type="text"
  value={codigo}
  onChange={(e) => setCodigo(e.target.value.toUpperCase())} // Convirtiendo a mayúsculas
  style={{ textTransform: 'uppercase' }} // Esto también ayuda visualmente
/>

            <FontAwesomeIcon
              icon={faRotate}
              style={{ cursor: "pointer", fontSize: "20px" }}
              onClick={()=>{setCodigo(generateCode(4))}}
              title="GENERAR CODIGO"
            />
          </div>
          
        </div>
        <div style={{width:"93%"}} className="clienteItemContainer">
          <span>Imagen (URL): <br /></span>
          <input
            className="clientInput"
            type="text"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />
        </div>
        <div className="clienteButtonContainer">
          <button onClick={handleSiguiente} className="clienteButton2">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddHospital;
