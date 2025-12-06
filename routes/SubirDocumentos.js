import "./SubirDocumentos.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import useStore from "../src/utils/useStore";
import url from "../url.json";
const SubirDocumentos = () => {
    const hospitalCode = useStore((state) => state.hospitalCode);
    const [searchEquipment, setSearchEquipment] = useState("");
    const [selectedEquipo, setSelectedEquipo] = useState("");
    const searchFilterFunctionEquipment = (search) => {
        const filteredEquipos = equipos.filter((equipo) => {
            return equipo.codigoIdentificacion
                .toLowerCase()
                .includes(search.toLowerCase());
        });
        setFilteredEquipos(filteredEquipos);
    };
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedCodeArea, setSelectedCodeArea] = useState("");
    const [areas, setAreas] = useState([]);
    const [filteredAreas, setFilteredAreas] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [filteredEquipos, setFilteredEquipos] = useState([]);
    const [isAreaGetted, setIsAreaGetted] = useState(false);
    const [isEquipoGetted, setIsEquipoGetted] = useState(false);
    const searchFilterFunctionArea = (search) => {
        const filteredAreas = areas.filter((area) => {
            return area.nombre.toLowerCase().includes(search.toLowerCase());
        });
        setFilteredAreas(filteredAreas);
    };
    const getAreas = async () => {
        console.log("Obteniendo areas");
        try {
            const response = await axios.get(`${url.url}/areas/${hospitalCode}`);
            console.log("Areas:", response.data); // Verifica la respuesta
            const areasData = response.data.map((area) => ({
                nombre: area.nombre,
                codigoIdentificacion: area.codigoIdentificacion,
            }));
            setAreas(areasData);
            setFilteredAreas(areasData);
        }
        catch (error) {
            console.error("Error obteniendo areas:", error);
        }
    };
    const getEquipmentInArea = async (codigoIdentificacion) => {
        try {
            const response = await axios.get(`${url.url}/getequipos/${hospitalCode}/${codigoIdentificacion}`);
            if (response.status === 200) {
                setIsAreaGetted(true);
            }
            console.log("Equipos:", response.data); // Verifica la respuesta
            setEquipos(response.data);
            setFilteredEquipos(response.data);
        }
        catch (error) {
            console.error("Error obteniendo equipos:", error);
        }
    };
    useEffect(() => {
        getAreas();
    }, []);
    return (React.createElement("div", { className: "container-documents" },
        React.createElement("p", { style: { color: "white", fontSize: "24px", marginTop: "2%" } }, "Subir documentos para los equipos"),
        React.createElement("input", { type: "text", value: search, onChange: (e) => {
                setSearch(e.target.value);
                searchFilterFunctionArea(e.target.value);
            }, className: "searchInput", placeholder: selectedArea === ""
                ? "Buscar área"
                : "Área seleccionada: " + selectedArea }),
        React.createElement("div", { className: "divOptions-documents" }, filteredAreas.map((area, index) => (React.createElement("button", { key: index, className: "option", onClick: () => {
                setSelectedArea(area.nombre);
                setSelectedCodeArea(area.codigoIdentificacion);
                getEquipmentInArea(area.codigoIdentificacion);
                setSearch("");
                setFilteredAreas([]);
            } }, area.nombre)))),
        isAreaGetted ? (React.createElement("div", { style: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "80%",
            } },
            React.createElement("input", { type: "text", value: searchEquipment, onChange: (e) => {
                    setSearchEquipment(e.target.value);
                    searchFilterFunctionEquipment(e.target.value);
                }, className: "searchInput", placeholder: selectedEquipo === ""
                    ? "Escribe los ultimos 4 digitos del codigo del equipo"
                    : "Equipo seleccionado: " + selectedEquipo }),
            React.createElement("div", { className: "divOptions-documents" }, filteredEquipos.map((equipo, index) => (React.createElement("div", { onClick: () => {
                    navigate(`/EquipoDetail/${equipo.codigoIdentificacion}`);
                }, className: "divEquipo" },
                React.createElement("div", { className: "divImagen" },
                    React.createElement("img", { src: equipo.Imagen, className: "Imagen" })),
                React.createElement("div", { className: "divInfoLeft" },
                    React.createElement("p", null, "CODIGO "),
                    React.createElement("p", null, "TIPO"),
                    React.createElement("p", null, "MARCA"),
                    React.createElement("p", null, "MODELO"),
                    React.createElement("p", null, "SERIE"),
                    React.createElement("p", null, "AREA")),
                React.createElement("div", { className: "divInfoRight" },
                    React.createElement("p", null, equipo.codigoIdentificacion),
                    React.createElement("p", null, equipo.Tipo),
                    React.createElement("p", null, equipo.Marca),
                    React.createElement("p", null, equipo.Modelo),
                    React.createElement("p", null, equipo.Serie),
                    React.createElement("p", null, equipo.area)))))))) : null));
};
export default SubirDocumentos;
