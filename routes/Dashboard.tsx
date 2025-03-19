
import React, { useState, useEffect, useRef } from "react";
import "./dashboard.css";
import { useSpring, animated } from "@react-spring/web";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { FaHospital, FaToolbox, FaCogs, FaMapMarkedAlt } from "react-icons/fa";
import CearEquipos from "../routes/CrearEquipos"
import CrearEquipos from "../routes/CrearEquipos";
import NuevoHospital from "../routes/NuevoHospital"
import Documentos from "../routes/SubirDocumentos"
import url from "../url.json";
const geoUrl = "../src/assets/co.json";
import Qr from "../routes/QrSelector"
import { useNavigate } from 'react-router-dom';
const markers = [
  { coordinates: [-74.0721, 4.711] },
  { coordinates: [-75.6972, 4.540]},
  { coordinates: [-76.5296, 3.437]},
  { coordinates: [-75.5658, 6.251] },
];
const Dashboard = () => {
  const today = new Date();
  const AnimatedNumber = ({ value }) => {
    const { number } = useSpring({
      from: { number: 0 },
      to: { number: value || 0 }, // Si no hay datos, el número será 0
      config: {  tension: 200, friction: 20 },
    });
  
    return <animated.h2>{number.to((n) => Math.floor(n))}</animated.h2>;
  };
  const [data, setData]=useState({})
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
        return <Documentos />;
      case "settings":
        return <Documentos />;
      case "map":
        return <MapView />;
      default:
        return ;
    }
  };
  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const response = await fetch(`${url.url}/main`);
        if (response.ok) {
          setData(await response.json())
        
          
        } else {
          console.error(
            "Error al obtener las bases de datos:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error al conectar con la API:", error);
      }
    };

    fetchDatabases();

 
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
  <div className="logo">
    <img className="logoDashboard" src="../src/assets/logoDashborad.png" alt="Logo Dashboard" />
  </div>
  <nav>
    <ul>
      <li 
        onClick={() => setActiveComponent("home")} 
        className={activeComponent === "home" ? "active" : ""}
      >
        <img className="homeDashboard" src="../src/assets/homeDashboard.png" alt="Home Dashboard" />
      </li>
      <li 
        onClick={() => setActiveComponent("Qr")} 
        className={activeComponent === "Qr" ? "active" : ""}
      >
        <img className="QrDashboard" src="../src/assets/qrDashboard.png" alt="QR Dashboard" />
      </li>
      <li 
        onClick={() => setActiveComponent("hospitals")} 
        className={activeComponent === "hospitals" ? "active" : ""}
      >
        <img className="QrDashboard" src="../src/assets/hospitals.png" alt="Hospitals" />
      </li>
      <li 
        onClick={() => setActiveComponent("rutinas")} 
        className={activeComponent === "rutinas" ? "active" : ""}
      >
        <img className="QrDashboard" src="../src/assets/rutinas.png" alt="Rutinas" />
      </li>
      <li 
        onClick={() => navigate('/crear/equipos')}
        className={activeComponent === "equipos" ? "active" : ""}
      >
        <img className="QrDashboard" src="../src/assets/equiposDashboard.png" alt="Equipos Dashboard" />
      </li>
      <li 
        onClick={() => setActiveComponent("settings")}
        className={activeComponent === "settings" ? "active" : ""}
      >
        <img className="settingsDashboard" src="../src/assets/settingsDashboard.png" alt="Settings Dashboard" />
      </li>
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
            <div style={{display:"flex"}}>      <AnimatedNumber value={data.total_dbs} />
            {/* <span className="status negative">-20.13%</span> */}
            </div>
  
            <p>Centros médicos</p>
        
          </div>
          {/* Card 2 */}
          <div className="card medium">
          <img className="dashImg" src="../src/assets/equiposLogo.png"/>
            <div style={{display:"flex"}}>       <AnimatedNumber value={data.total_equipos} />   
            {/* <span className="status positive">-17.23%</span> */}
            </div>
  
            <p>Equipos</p>
       
          </div>
          {/* Card 3 */}
          <div style={{  display: "flex", flexDirection:'column', gap: "20px" }}>
  <div className="card">
  <AnimatedNumber value={data.total_rutinas_GLOBAL} />  
    <p>Tipos de equipo</p>
  </div>
  <div className="card">
    <h2>  <AnimatedNumber value={data.total_mantenimientos} />  </h2>
    <p>Mantenimientos</p>
  </div>
</div><div className="card large">
  <h3 className="proximos">
    Vencimiento de <br />
    licencias
  </h3>
  <ul className="license-list">
  {(data.dataCenters || [])
    .map(hospital => ({
      ...hospital,
      expirationDate: new Date(hospital.fechaExpiracion)
    }))
    .sort((a, b) => a.expirationDate - b.expirationDate) // Ordenar por fecha más cercana
    .slice(0, 3) // Tomar solo los primeros 3 hospitales
    .map((hospital, index) => {
      const isExpired = hospital.expirationDate < today;

      // Formatear la fecha como "25 FEB 2024"
      const formattedDate = hospital.expirationDate.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).toUpperCase();

      // Limitar el nombre a 15 caracteres con "..."
      const shortName =
        hospital.nombre.length > 17 ? hospital.nombre.slice(0, 17) + "..." : hospital.nombre;

      return (
        <li key={index} className={isExpired ? "red-dot" : "green-dot"}>
          {hospital.codigoIdentificacion} - {formattedDate}
        </li>
      );
    })}
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

        {(data.dataCenters || [])
  .filter(hospital => hospital.coordenadas && hospital.coordenadas.coordinates) // Filtrar hospitales sin coordenadas
  .map(({ coordenadas, nombre }) => (
    <Marker  coordinates={coordenadas.coordinates}>
      <circle r={10} fill="#000" stroke="#fff" strokeWidth={3} />
      <text
        textAnchor="middle"
        y={15}
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          fill: "#5D5A6D",
        }}
      >
      
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
