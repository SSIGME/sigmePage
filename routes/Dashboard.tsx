import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
;
import "./dashboard.css";
import logo from "../src/assets/LOGO.png"
function Dashboard() {

  const navigate = useNavigate(); // Hook de useNavigate

  useEffect(() => {
  }, []);


  const handleNavigation = (route) => {
    navigate(route); // Navega a la ruta especificada
  };

  return (
    

    <div className="containerDashboard">
    {/* Capa para el fondo desenfocado */}
    <div className="background"></div>

    {/* Contenido principal */}
    <div className="containerContent">
      <a href="/">
        <img className="logo" src={logo} alt="logo" />
      </a>

      <div className="itemContainer">
        <div className="item" onClick={() => handleNavigation("/nuevo/hospital")}>
          <img className="itemImage" src="https://i.postimg.cc/s2YGrPPS/hand-drawn-hospital-cartoon-illustration-23-2150594166.avif" alt="clientes" />
          <p className="itemText">Nuevo Hospital</p>
        </div>

        <div className="item" onClick={() => handleNavigation("/nuevo/qr")}>
          <img className="itemImage" src="https://media.istockphoto.com/id/1448345755/vector/qr-code-scan-icon-on-red-background-with-shadow.jpg?s=612x612&w=0&k=20&c=aohinWHpA8SuMXptlo6CnD2NWkfwqACJyZnZlIeURR0=" alt="comprobantes" />
          <p className="itemText">Generar QR</p>
        </div>

        
        <div className="c item" onClick={() => handleNavigation("/hospitales")}>
          <img className="itemImage" src="https://i.postimg.cc/2yGXXXS5/3262097.jpg" alt="disciplinas"/>
          <p className="itemText">Hospitales</p>
        </div>
        <div className="d item" onClick={() => handleNavigation("/secretaria")}>
          <img className="itemImage" src="https://img.freepik.com/free-vector/hand-drawn-busy-office-illustration_23-2151051237.jpg" alt="entrenadores"/>
          <p className="itemText">Secretaria</p>
        </div>
        <div className="e item" onClick={() => handleNavigation("/equipos")}>
          <img className="itemImage" src="https://i.postimg.cc/ryQxnL9k/iconos-equipos-medicos-diseno-plano-1280751-36335.avif" alt="administradores"/>
          <p className="itemText">Base Equipos</p>
        </div>
        <div className="f item" onClick={() => handleNavigation("/configuracion")}>
          <img className="itemImage" src="https://st2.depositphotos.com/4069215/9515/v/450/depositphotos_95159178-stock-illustration-icon-flat-settings.jpg" alt="planes"/>
          <p className="itemText">Configuracion</p>
        </div>
        </div>
      </div>
      </div>
  );
}

export default Dashboard;
