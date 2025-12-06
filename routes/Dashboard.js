import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { useSpring, animated } from "@react-spring/web";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import NuevoHospital from "../routes/NuevoHospital";
import Documentos from "../routes/SubirDocumentos";
import Indicators from "./Indicators";
import Reports from "../routes/Reports/reports";
import url from "../url.json";
import useStore from "../src/utils/useStore";
import Rutinas from "../routes/SubirRutinas";
const geoUrl = "../src/assets/co.json";
import Slider from "../routes/dashBoard/slideNav";
import Qr from "../routes/QrSelector";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const markers = [
  { coordinates: [-74.0721, 4.711] },
  { coordinates: [-75.6972, 4.54] },
  { coordinates: [-76.5296, 3.437] },
  { coordinates: [-75.5658, 6.251] },
];
const Dashboard = () => {
  const [options, setOptions] = useState([]);
  const hospitalCode = useStore((state) => state.hospitalCode);
  const setHospitalCode = useStore((state) => state.setHospitalCode);
  const today = new Date();
  const AnimatedNumber = ({ value }) => {
    const { number } = useSpring({
      from: { number: 0 },
      to: { number: value || 0 }, // Si no hay datos, el número será 0
      config: { tension: 200, friction: 20 },
    });
    return React.createElement(
      animated.h2,
      null,
      number.to((n) => Math.floor(n))
    );
  };
  const [data, setData] = useState({});
  const [activeComponent, setActiveComponent] = useState("home"); // Estado para controlar el componente activo
  const navigate = useNavigate();
  const renderComponent = () => {
    switch (activeComponent) {
      case "home":
        return;
      case "hospitals":
        return React.createElement(NuevoHospital, null);
      case "Qr":
        return React.createElement(Qr, null);
      case "rutinas":
        return React.createElement(Rutinas, null);
      case "settings":
        return React.createElement(Documentos, null);
      case "reports":
        return React.createElement(Reports, null);
      case "map":
        return React.createElement(MapView, null);
      case "indicators":
        return React.createElement(Indicators, null);
      default:
        return;
    }
  };
  const fetchDatabases = async () => {
    try {
      const response = await axios.get(`${url.url}/main`);
      setOptions(
        response.data.dataCenters.map((center) => center.codigoIdentificacion)
      );
    } catch (error) {
      console.error("Error al conectar con la API:", error);
    }
  };
  useEffect(() => {
    console.log(options);
  }, [options]);
  useEffect(() => {
    console.log("El codigo ha cambiado", hospitalCode);
  }, [hospitalCode]);
  useEffect(() => {
    fetchDatabases();
  }, []);
  useEffect(() => {
    const fetchDatabases2 = async () => {
      try {
        const response = await fetch(`${url.url}/main`);
        if (response.ok) {
          setData(await response.json());
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
    fetchDatabases2();
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return React.createElement(
    "div",
    { className: "dashboard-container" },
    React.createElement(Slider, {
      activeComponent: activeComponent,
      navigate: navigate,
      setActiveComponent: setActiveComponent,
    }),
    " ",
    activeComponent === "home" &&
      React.createElement(
        "main",
        { className: "main-content" },
        React.createElement(
          "h1",
          { style: { color: "#333" } },
          "Bienvenido a SIGME"
        ),
        React.createElement(
          "div",
          {
            className: "picker-container",
            style: {
              width: "80%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            },
          },
          React.createElement(
            "label",
            { htmlFor: "option-picker" },
            "Codigo de hospital seleccionado:"
          ),
          React.createElement(
            "select",
            {
              id: "option-picker",
              onChange: (e) => setHospitalCode(e.target.value),
              value: hospitalCode,
              style: {
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "16px",
                width: "100%",
                maxWidth: "400px",
                color: "#333",
                margin: "10px 0",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              },
            },
            React.createElement(
              "option",
              { value: "" },
              "Selecciona un centro medico"
            ),
            options.map((option, index) =>
              React.createElement(
                "option",
                { key: index, value: option },
                option
              )
            )
          )
        ),
        React.createElement(
          "div",
          { className: "cards-container" },
          React.createElement(
            "div",
            { className: "card medium" },
            React.createElement("img", {
              className: "dashImg",
              src: "../src/assets/centrosMedicoLogo.png",
            }),
            React.createElement(
              "div",
              { style: { display: "flex" } },
              " ",
              React.createElement(AnimatedNumber, { value: data.total_dbs })
            ),
            React.createElement("p", null, "Centros m\u00E9dicos")
          ),
          React.createElement(
            "div",
            { className: "card medium" },
            React.createElement("img", {
              className: "dashImg",
              src: "../src/assets/equiposLogo.png",
            }),
            React.createElement(
              "div",
              { style: { display: "flex" } },
              " ",
              React.createElement(AnimatedNumber, { value: data.total_equipos })
            ),
            React.createElement("p", null, "Equipos")
          ),
          React.createElement(
            "div",
            {
              style: { display: "flex", flexDirection: "column", gap: "20px" },
            },
            React.createElement(
              "div",
              { className: "card" },
              React.createElement(AnimatedNumber, {
                value: data.total_rutinas_GLOBAL,
              }),
              React.createElement("p", null, "Tipos de equipo")
            ),
            React.createElement(
              "div",
              { className: "card" },
              React.createElement(
                "h2",
                null,
                " ",
                React.createElement(AnimatedNumber, {
                  value: data.total_mantenimientos,
                }),
                " "
              ),
              React.createElement("p", null, "Mantenimientos")
            )
          ),
          React.createElement(
            "div",
            { className: "card large" },
            React.createElement(
              "h3",
              { className: "proximos" },
              "Vencimiento de ",
              React.createElement("br", null),
              "licencias"
            ),
            React.createElement(
              "ul",
              { className: "license-list" },
              (data.dataCenters || [])
                .map((hospital) => ({
                  ...hospital,
                  expirationDate: new Date(hospital.fechaExpiracion),
                }))
                .sort((a, b) => a.expirationDate - b.expirationDate) // Ordenar por fecha más cercana
                .slice(0, 3) // Tomar solo los primeros 3 hospitales
                .map((hospital, index) => {
                  const isExpired = hospital.expirationDate < today;
                  // Formatear la fecha como "25 FEB 2024"
                  const formattedDate = hospital.expirationDate
                    .toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .toUpperCase();
                  // Limitar el nombre a 15 caracteres con "..."
                  const shortName =
                    hospital.nombre.length > 17
                      ? hospital.nombre.slice(0, 17) + "..."
                      : hospital.nombre;
                  return React.createElement(
                    "li",
                    {
                      key: index,
                      className: isExpired ? "red-dot" : "green-dot",
                    },
                    hospital.codigoIdentificacion,
                    " - ",
                    formattedDate
                  );
                })
            )
          )
        )
      ),
    activeComponent === "home" &&
      React.createElement(
        "div",
        { className: "map-section" },
        React.createElement(
          ComposableMap,
          {
            projection: "geoMercator",
            projectionConfig: {
              center: [-73, 4], // Centrar en Colombia
              scale: 3800,
            },
            style: {
              width: "100%",
              height: "100%",
            },
          },
          React.createElement(
            Geographies,
            { geography: geoUrl },
            ({ geographies }) =>
              geographies.map((geo) =>
                React.createElement(Geography, {
                  key: geo.rsmKey,
                  geography: geo,
                  style: {
                    default: { fill: "#fff", stroke: "#ffff" },
                    hover: { fill: "#bcf7e9", stroke: "#000" },
                    pressed: { fill: "#65c9be", stroke: "#000" },
                  },
                })
              )
          ),
          (data.dataCenters || [])
            .filter(
              (hospital) =>
                hospital.coordenadas && hospital.coordenadas.coordinates
            ) // Filtrar hospitales sin coordenadas
            .map(({ coordenadas, nombre }) =>
              React.createElement(
                Marker,
                { coordinates: coordenadas.coordinates },
                React.createElement("circle", {
                  r: 10,
                  fill: "#000",
                  stroke: "#fff",
                  strokeWidth: 3,
                }),
                React.createElement("text", {
                  textAnchor: "middle",
                  y: 15,
                  style: {
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fill: "#5D5A6D",
                  },
                })
              )
            )
        )
      ),
    activeComponent !== "home" &&
      React.createElement(
        "main",
        { className: "main-content" },
        renderComponent()
      )
  );
};
export default Dashboard;
