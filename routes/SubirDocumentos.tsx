import "../routes/qr.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
      const response = await axios.get("https://interference-subcommittee-destroyed-portable.trycloudflare.com/areas/PALM");
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
        `https://interference-subcommittee-destroyed-portable.trycloudflare.com/getequipos/PALM/${codigoIdentificacion}`
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
    <div className="dashboard-container7">
      <p>Subir documentos para los equipos</p>
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
      <div className="divOptions">
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
      <div className="divOptions">
        {isAreaGetted ? (
          <div className="divOptions">
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
        ) : (
          <button className="option">Selecciona un área</button>
        )}
      </div>
    </div>
  );
};
export default SubirDocumentos;
