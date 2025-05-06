import "./SubirDocumentos.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import useStore from "../src/utils/useStore";
import url from "../url.json";

interface Area {
  nombre: string;
  codigoIdentificacion: string;
}
interface Equipo {
  area: string;
  Imagen: string;
  codigoIdentificacion: string;
  Tipo: string;
  Marca: string;
  Modelo: string;
  Serie: string;
}
const SubirDocumentos = () => {
  const hospitalCode = useStore((state) => state.hospitalCode);
  const [searchEquipment, setSearchEquipment] = useState<string>("");
  const [selectedEquipo, setSelectedEquipo] = useState<string>("");

  const searchFilterFunctionEquipment = (search: string) => {
    const filteredEquipos = equipos.filter((equipo) => {
      return equipo.codigoIdentificacion
        .toLowerCase()
        .includes(search.toLowerCase());
    });
    setFilteredEquipos(filteredEquipos);
  };
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedCodeArea, setSelectedCodeArea] = useState<string>("");

  const [areas, setAreas] = useState<Area[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<Area[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [filteredEquipos, setFilteredEquipos] = useState<Equipo[]>([]);
  const [isAreaGetted, setIsAreaGetted] = useState<boolean>(false);
  const [isEquipoGetted, setIsEquipoGetted] = useState<boolean>(false);
  const searchFilterFunctionArea = (search: string) => {
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
      const areasData = response.data.map((area: Area) => ({
        nombre: area.nombre,
        codigoIdentificacion: area.codigoIdentificacion,
      }));
      setAreas(areasData);
      setFilteredAreas(areasData);
    } catch (error) {
      console.error("Error obteniendo areas:", error);
    }
  };
  const getEquipmentInArea = async (codigoIdentificacion: string) => {
    try {
      const response = await axios.get(
        `${url.url}/getequipos/${hospitalCode}/${codigoIdentificacion}`
      );
      if (response.status === 200) {
        setIsAreaGetted(true);
      }
      console.log("Equipos:", response.data); // Verifica la respuesta
      setEquipos(response.data);
      setFilteredEquipos(response.data);
    } catch (error) {
      console.error("Error obteniendo equipos:", error);
    }
  };
  useEffect(() => {
    getAreas();
  }, []);
  return (
    <div className="container-documents">
      <p style={{ color: "white", fontSize: "24px" }}>
        Subir documentos para los equipos
      </p>
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          searchFilterFunctionArea(e.target.value);
        }}
        className="searchInput"
        placeholder={
          selectedArea === ""
            ? "Buscar área"
            : "Área seleccionada: " + selectedArea
        }
      />
      <div className="divOptions-documents">
        {filteredAreas.map((area, index) => (
          <button
            key={index}
            className="option"
            onClick={() => {
              setSelectedArea(area.nombre);
              setSelectedCodeArea(area.codigoIdentificacion);
              getEquipmentInArea(area.codigoIdentificacion);
              setSearch("");
              setFilteredAreas([]);
            }}
          >
            {area.nombre}
          </button>
        ))}
      </div>
      {isAreaGetted ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "80%",
          }}
        >
          <input
            type="text"
            value={searchEquipment}
            onChange={(e) => {
              setSearchEquipment(e.target.value);
              searchFilterFunctionEquipment(e.target.value);
            }}
            className="searchInput"
            placeholder={
              selectedEquipo === ""
                ? "Escribe los ultimos 4 digitos del codigo del equipo"
                : "Equipo seleccionado: " + selectedEquipo
            }
          />

          <div className="divOptions-documents">
            {filteredEquipos.map((equipo, index) => (
              <div
                onClick={() => {
                  navigate(`/EquipoDetail/${equipo.codigoIdentificacion}`);
                }}
                className="divEquipo"
              >
                <div className="divImagen">
                  <img src={equipo.Imagen} className="Imagen" />
                </div>
                <div className="divInfoLeft">
                  <p>CODIGO </p>
                  <p>TIPO</p>
                  <p>MARCA</p>
                  <p>MODELO</p>
                  <p>SERIE</p>
                  <p>AREA</p>
                </div>
                <div className="divInfoRight">
                  <p>{equipo.codigoIdentificacion}</p>
                  <p>{equipo.Tipo}</p>
                  <p>{equipo.Marca}</p>
                  <p>{equipo.Modelo}</p>
                  <p>{equipo.Serie}</p>
                  <p>{equipo.area}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default SubirDocumentos;
