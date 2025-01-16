
import React, { useState } from "react";
import "./dashboard.css";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { FaHospital, FaToolbox, FaCogs, FaMapMarkedAlt } from "react-icons/fa";
import CearEquipos from "../routes/CrearEquipos"
import CrearEquipos from "../routes/CrearEquipos";
import NuevoHospital from "../routes/NuevoHospital"
const geoUrl = "../src/assets/co.json";
import Qr from "../routes/NuevoQr"
import { useNavigate } from 'react-router-dom';
const markers = [
  { coordinates: [-74.0721, 4.711], name: "" },
  { coordinates: [-75.6972, 4.540], name: "" },
  { coordinates: [-76.5296, 3.437], name: "" },
  { coordinates: [-75.5658, 6.251], name: "" },
];
const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("home"); // Estado para controlar el componente activo
  const navigate = useNavigate();
  const renderComponent = () => {
    switch (activeComponent) {
      case "home":
        return ;
      case "hospitals":
        return <NuevoHospital />;
      case "Qr":
        return <Qr/>;
      case "routines":
        return <Routines />;
      case "settings":
        return <Settings />;
      case "map":
        return <MapView />;
      default:
        return ;
    }
  };


  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
        <img className="logoDashboard" src="../src/assets/logoDashborad.png" alt="Logo Dashboard" />
        </div>
        <nav>
          <ul>
            <li onClick={()=>{setActiveComponent("home")}}> <img className="homeDashboard" src="../src/assets/homeDashboard.png" alt="Logo Dashboard" /></li>
            <li onClick={()=>{setActiveComponent("Qr")}}> <img className="QrDashboard" src="../src/assets/qrDashboard.png" alt="Qr Dashboard" /></li>
            <li onClick={()=>{setActiveComponent("hospitals")}}> <img className="QrDashboard" src="../src/assets/hospitals.png" alt="Qr Dashboard" /></li>
            <li> <img className="QrDashboard" src="../src/assets/rutinas.png" alt="Qr Dashboard" /></li>
            <li onClick={()=>{navigate('/crear/equipos')}}><img  className="QrDashboard" src="../src/assets/equiposDashboard.png" alt="Qr Dashboard" /></li>
            <li> <img className="settingsDashboard" src="../src/assets/settingsDashboard.png" alt="Logo Dashboard" /></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */} {activeComponent === "home" && (
      <main className="main-content">
        <h1>Bienvenido a SIGME</h1>
        <div className="cards-container">
          {/* Card 1 */}
          <div className="card medium">
          <img className="dashImg" src="../src/assets/centrosMedicoLogo.png"/>
            <div style={{display:"flex"}}>          <h2>60</h2>
            <span className="status negative">-17.23%</span></div>
  
            <p>Centros médicos</p>
        
          </div>
          {/* Card 2 */}
          <div className="card medium">
          <img className="dashImg" src="../src/assets/equiposLogo.png"/>
            <div style={{display:"flex"}}>          <h2>600</h2>
            <span className="status positive">-17.23%</span></div>
  
            <p>Equipos</p>
       
          </div>
          {/* Card 3 */}
          <div style={{  display: "flex", flexDirection:'column', gap: "20px" }}>
  <div className="card">
    <h2>104</h2>
    <p>Tipos de equipo</p>
  </div>
  <div className="card">
    <h2>763</h2>
    <p>Mantenimientos</p>
  </div>
</div><div className="card large">
  <h3 className="proximos">
    Vencimiento de <br />
    licencias
  </h3>
  <ul className="license-list">
    <li className="red-dot">San Rafa - 15/01/2025</li>
    <li className="green-dot">Hospital 1 - 20/01/2025</li>
    <li className="red-dot">Hospital 2 - 22/01/2025</li>
  </ul>
</div>

     
  
        </div>

 
      </main>)}
             {/* Map Section */}
             {activeComponent === "home" && (
             <div className="map-section">
   
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [-73, 4], // Centrar en Colombia
          scale: 3800,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill: "#fff", stroke: "#ffff" },
                  hover: { fill: "#bcf7e9", stroke: "#000" },
                  pressed: { fill: "#65c9be", stroke: "#000" },
                }}
              />
            ))
          }
        </Geographies>

        {markers.map(({ coordinates, name }) => (
          <Marker key={name} coordinates={coordinates}>
            <circle r={10} fill="#000" stroke="#fff" strokeWidth={2} />
            <text
              textAnchor="middle"
              y={15}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "26px",
                fill: "#5D5A6D",
              }}
            >
              {name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
 
    </div>)}
    {activeComponent !== "home" && (
    <main className="main-content">{renderComponent()}</main>)}
    </div>
  );
};

export default Dashboard;
