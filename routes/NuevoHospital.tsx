import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import url from "../url.json";
import "./nuevoHospital.css";

function AddHospital() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(null); // Cambiado a null para almacenar el objeto completo
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');
  const [tipoCentro, setTipoCentro] = useState("");
  const [numero, setNumero] = useState("");
  const [correo, setCorreo] = useState("");
  const [responsable, setResponsable] = useState("");
  const [imagen, setImagen] = useState("");
  const [direccion, setDireccion] = useState("");
  const [fechaExpiracion, setFechaExpiracion] = useState("");

  useEffect(() => {
    fetch('https://api-colombia.com/api/v1/Department')
      .then((response) => response.json())
      .then((data) => {
        setDepartamentos(data);
      })
      .catch((error) => console.error('Error al cargar departamentos:', error));
  }, []);

  const handleDepartmentChange = (e) => {
    const department = JSON.parse(e.target.value);
    setDepartamentoSeleccionado(department);

    fetch(`https://api-colombia.com/api/v1/Department/${department.id}/cities`)
      .then((response) => response.json())
      .then((data) => {
        setCiudades(data);
      })
      .catch((error) => console.error('Error al cargar ciudades:', error));
  };

  const handleSiguiente = () => {
    const hospitalData = {
      nombre,
      tipoCentro,
      numero,
      correo,
      direccion,
      fechaExpiracion,
      departamentoSeleccionado: departamentoSeleccionado.name, // Guardar solo el nombre del departamento
      ciudadSeleccionada,
      responsable,
      imagen,
    };
    navigate("/nuevo/administrador", { state: hospitalData });
  };

  return (
    <div className="backgrounda">
      <div className="background"></div>
     
      
      <div className="clienteDetailContainer">
        <h1 style={{ width: "100%", textAlign: "center" }}>Nuevo Hospital</h1>

        <div className="clienteItemContainer">
          <span>Nombre: </span>
          <input
            className="clientInput"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="clienteItemContainer">
          <span>Tipo de centro médico: </span>
          <select
            className="clientInput"
            value={tipoCentro}
            onChange={(e) => setTipoCentro(e.target.value)}
            style={{
              width: '200px',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
              color: '#fff',
              backgroundColor: "#11243F",
            }}
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
          <span>Número: </span>
          <input
            className="clientInput"
            type="text"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
        </div>

        <div className="clienteItemContainer">
          <span>Correo: </span>
          <input
            className="clientInput"
            type="text"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>
        <div className="clienteItemContainer">
          <span>Responsable mantenimiento: </span>
          <input
            className="clientInput"
            type="text"
            value={responsable}
            onChange={(e) => setResponsable(e.target.value)}
          />
        </div>
        <div className="clienteItemContainer">
          <span>Imagen: </span>
          <input
            className="clientInput"
            type="text"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />
        </div>

        <div className="clienteItemContainer">
          <span>Dirección: </span>
          <input
            className="clientInput"
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>

        <div className="clienteItemContainer">
          <span>Fecha de expiración: </span>
          <input
            className="clientInput"
            style={{ minWidth: "20px", width: "170px" }}
            type="date"
            value={fechaExpiracion}
            onChange={(e) => setFechaExpiracion(e.target.value)}
          />
        </div>

        <div className="clienteItemContainer">
          <span>Departamento: </span>
          <select
            className="clientInput"
            value={JSON.stringify(departamentoSeleccionado)}
            onChange={handleDepartmentChange}
            style={{
              width: '280px',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
              color: '#fff',
              backgroundColor: "#11243F",
            }}
          >
            <option value="">Selecciona un departamento</option>
            {departamentos.map((department) => (
              <option key={department.id} value={JSON.stringify(department)}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <div className="clienteItemContainer">
          <span>Ciudad: </span>
          <select
            className="clientInput"
            value={ciudadSeleccionada}
            onChange={(e) => setCiudadSeleccionada(e.target.value)}
            style={{
              width: '250px',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
              color: '#fff',
              backgroundColor: "#11243F",
            }}
          >
            <option value="">Selecciona una ciudad</option>
            {ciudades.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
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
