import React, { useState, useEffect, useRef } from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { registerLanguageDictionary, esMX } from "handsontable/i18n";
import "handsontable/dist/handsontable.full.css";
import ComponentDialog from './ComponentDialog'


import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,

  FormControlLabel,
  Checkbox,

} from "@mui/material";
import "./CrearEquipos.css";
// Define el tipo de hotTableComponent y su instancia


import url from "../url.json";
import { useNavigate } from "react-router-dom";
import equiposData from "./equipos.json";


registerAllModules();
registerLanguageDictionary(esMX);
const opciones = [
  "Operación",
  "Mantenimiento",
  "Servicio",
  "Físico",
  "Digital",
];
const opcionesPlanos = ["Electrónico", "Eléctrico", "Mecánico"];
function App() {
  const [areas, setAreas] = useState([])
  const [data, setData] = useState(Array(999).fill({ manuales: "" })); // 10 filas vacías
  const [planosData, setPlanosData] =useState(Array(999).fill({ planos: "" }));
  const [modalOpen, setModalOpen] = useState(false);
  const [modalComponentesOpen, setModalComponentesOpen] = useState(false);
  const [modalPlanosOpen, setModalPlanosOpen] = useState(false);
  const [componentes, setComponentes] = useState([]);
  const [currentCell, setCurrentCell] = useState({ row: null, value: "" });
  const handleCellClick = ( coords:any) => {
    if (coords.col === 40) {
      // Ajusta la columna donde quieres que funcione
      setCurrentCell({
        row: coords.row,
        value: data[coords.row].manuales
          ? data[coords.row].manuales.split(", ")
          : [],
      });
      setModalOpen(true);
    }
    if (coords.col === 41) {
      // Ajusta la columna donde quieres que funcione
      setCurrentCell({
        row: coords.row,
        value: planosData[coords.row].planos
          ? planosData[coords.row].planos.split(", ")
          : [],
      });
      setModalPlanosOpen(true);
    }
    if (coords.col === 11) {
      // Ajusta la columna donde quieres que funcione
      setCurrentCell({
        row: coords.row,
        value: planosData[coords.row].planos
          ? planosData[coords.row].planos.split(", ")
          : [],
      });
      setModalComponentesOpen(true);
    }
  };

  const handleCheckboxChange = (opcion: any) => {
    setCurrentCell((prev) => {
      // Asegurarse de que prev.value sea un array
      const prevValueArray = Array.isArray(prev.value) ? prev.value : [];
  
      const newValue = prevValueArray.includes(opcion)
        ? prevValueArray.filter((v) => v !== opcion)  // Si ya estaba, lo quita
        : [...prevValueArray, opcion];  // Si no estaba, lo agrega
  
      return { ...prev, value: newValue };
    });
  };
  

  const handleSave = () => {
    const hot = hotTableComponent.current?.hotInstance;
    const nuevoValor = currentCell.value.join(", "); // Convierte el array a string separado por comas

    setData((prevData) => {
      const newData = [...prevData];
      newData[currentCell.row].manuales = nuevoValor;
      return newData;
    });
 
 
    hot.setDataAtCell(currentCell.row, 40, nuevoValor); // Actualiza la tabla
    setModalOpen(false);
  }

    const handleSave2 = () => {
      const hot = hotTableComponent.current.hotInstance;
      const nuevoValor = currentCell.value.join(", "); // Convierte el array a string separado por comas
  
      setPlanosData((prevData) => {
        const newData = [...prevData];
        newData[currentCell.row].planos = nuevoValor;
        return newData;
      });
  

    hot.setDataAtCell(currentCell.row, 41, nuevoValor); // Actualiza la tabla
    setModalPlanosOpen(false);
  };
  const handleSave3= (data) => {
    const jsonData = JSON.stringify(data);
    setComponentes(data);
    const hot = hotTableComponent.current.hotInstance;
    hot.setDataAtCell(currentCell.row, 11, jsonData)
    setModalComponentesOpen(false)
    console.log("Datos guardados:", data);
  };
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [equipos, setEquipos] = useState(equiposData);
  const [isFixed, setIsFixed] = useState(false);
  const hotTableComponent = useRef(null);
  const navigate = useNavigate();

  const tiposEquipos = [...new Set(equiposData.map((equipo) => equipo.EQUIPO))];

  const toggleModal = () => setIsOpen(!isOpen);
  const enviarTodosLosEquipos = async () => {
    if (!hotTableComponent.current) return;

    const hot = hotTableComponent.current.hotInstance;
    const equiposEnTabla = hot.getData();
    const colHeaders = hot.getColHeader();

    // Convertimos cada fila en un objeto con los nombres de columna correctos
    const equiposFormateados = equiposEnTabla.map((fila, rowIndex) => {
      let equipoObj = {};
      colHeaders.forEach((key, colIndex) => {
        equipoObj[key] = fila[colIndex] !== null ? fila[colIndex] : ""; // Reemplazamos `null` por `""`
      });
      return { ...equipoObj, rowIndex }; // Agregamos índice de fila
    });

    // Filtrar filas que tienen al menos un campo lleno (excluyendo valores null o "")
    const equiposNoVacios = equiposFormateados.filter((equipo) =>
      Object.values(equipo).some((valor) => valor !== "" && valor !== null)
    );

    if (equiposNoVacios.length === 0) {
      alert("No hay equipos con información para enviar.");
      return;
    }

    const formData = new FormData();

    equiposNoVacios.forEach((equipo, index) => {
      Object.entries(equipo).forEach(([key, value]) => {
        if (key !== "rowIndex" && value !== "") {
          formData.append(`equipos[${index}][${key}]`, value);
        }
      });

      // 🔹 Extraer archivo manualmente desde el input en la celda
      const fileInput = document.querySelector(`#fileInput${equipo.rowIndex}`);
      if (fileInput && fileInput.files.length > 0) {
        formData.append(`file[${equipo.rowIndex}]`, fileInput.files[0]);
      }
    });

    try {
      const response = await fetch(`${url.url}/equipos/${selectedOption}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Equipos enviados exitosamente");
      } else {
        alert("Error al enviar los equipos: " + response.statusText);
      }
    } catch (error) {
      alert("Error al conectar con la API: " + error.message);
    }
  };
  const fetchAreas = async (dataBase) => {
    try {
      const response = await fetch(`${url.url}/areas/${dataBase}`);
      if (response.ok) {
        const data = await response.json();
        setAreas(data.areas);
        console.log(data.areas)
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
  const handleSelect = (option) => {
    setSelectedOption(option);
    fetchAreas(option)
   
    setIsOpen(false);
  };

  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const response = await fetch(`${url.url}/databases`);
        if (response.ok) {
          const data = await response.json();
          setOptions(data.databases);
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

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const obtenerMarcasPorEquipo = (equipoNombre) => {
    if (!equipoNombre) return [];
    return [
      ...new Set(
        equiposData
          .filter((equipo) => equipo.EQUIPO === equipoNombre)
          .map((equipo) => equipo.MARCA)
      ),
    ];
  };

  const obtenerModelosPorEquipoYMarca = (equipoNombre, marcaNombre) => {
    if (!equipoNombre || !marcaNombre) return [];
    return [
      ...new Set(
        equiposData
          .filter(
            (equipo) =>
              equipo.EQUIPO === equipoNombre && equipo.MARCA === marcaNombre
          )
          .map((equipo) => equipo.MODELO)
      ),
    ];
  };



  const obtenerDatosPorEquipoMarcaYModelo = (
    equipoNombre:string,
    marcaNombre:string,
    modeloNombre:string
  ) => {
    if (!equipoNombre || !marcaNombre || !modeloNombre) return null;
    return equiposData.find(
      (equipo) =>
        equipo.EQUIPO === equipoNombre &&
        equipo.MARCA === marcaNombre &&
        equipo.MODELO === modeloNombre
    );
  };

  const llenarDatosFila = (
    row:any,
    equipoSeleccionado:string,
    marcaSeleccionada:string,
    modeloSeleccionado:string
  ) => {
    const datos = obtenerDatosPorEquipoMarcaYModelo(
      equipoSeleccionado,
      marcaSeleccionada,
      modeloSeleccionado
    );

    if (datos) {
      const hot = hotTableComponent.current.hotInstance;

      hot.setDataAtCell(row, 13, datos["REGISTRO_SANITARIO_O_PC"]);
      hot.setDataAtCell(row, 14, datos["VIDA_ÚTIL"]);
      hot.setDataAtCell(row, 16, datos["FABRICANTE"]);
      hot.setDataAtCell(row, 17, datos["FUENTE_DE_ALIMENTACIÓN"]);
      hot.setDataAtCell(row, 18, datos["VOLTAJE_MAX"]);
      hot.setDataAtCell(row, 19, datos["VOLTAJE_MIN"]);
      hot.setDataAtCell(row, 20, datos["POTENCIA"]);
      hot.setDataAtCell(row, 21, datos["FRECUENCIA"]);
      hot.setDataAtCell(row, 22, datos["CORRIENTE_MAX"]);
      hot.setDataAtCell(row, 23, datos["CORRIENTE_MIN"]);
      hot.setDataAtCell(row, 24, datos["TEMPERATURA"]);
      hot.setDataAtCell(row, 25, datos["PRESIÓN"]);
      hot.setDataAtCell(row, 26, datos["OTROS"]);
    }
  };

  return (
    <div className="app-container">
      <img
        onClick={() => navigate("/")}
        className="logoDashboard1"
        src="../src/assets/logo.png"
        alt="Logo Dashboard"
      />
      <div className={`button-group ${isFixed ? "fixed" : ""}`}>
        <div style={{ zIndex: 1 }}>
          <h3
            style={{ fontSize: "16px", fontWeight: "200", marginBottom: "8px" }}
          >
            Selecciona el centro medico
          </h3>
          <div>
            <div className="picker-header" onClick={toggleModal}>
              <span>{selectedOption || "Selecciona una opción"}</span>
            </div>

            {isOpen && (
              <div className="picker-modal-overlay" onClick={closeModal}>
                <div
                  className="picker-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    placeholder="Buscar opciones..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <ul className="picker-options">
                    {options
                      .filter((option) =>
                        option.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((option, index) => (
                        <li
                          key={index}
                          className="picker-option"
                          onClick={() => handleSelect(option)}
                        >
                          {option}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          className="custom-button"
          onClick={() =>
            hotTableComponent.current.hotInstance
              .getPlugin("exportFile")
              .downloadFile("csv", {
                filename: "registro_equipos",
                fileExtension: "csv",
                mimeType: "text/csv",
                columnHeaders: true,
              })
          }
        >
          Descargar CSV
        </button>
        <button className="custom-button1" onClick={enviarTodosLosEquipos}>
          Crear Equipos
        </button>
      </div>

      <HotTable
        ref={hotTableComponent}
        className="custom-table"
        style={{ zIndex: isOpen ? 0 : 1 }}
        data={equipos}
        language={esMX.languageCode}
        colHeaders={[
          "Equipo",
          "Marca",
          "Modelo",
          "Serie",
          "INV/ACT",
          "Servicio",
          "Ubicación",
          "Fecha de Instalación",
          "Fecha de Operación",
          "Vencimiento Garantía",
          "Forma de Adquisición",
          "Componentes",
          "Certificado de Calibración",
          "Imagen",
          "Protocolo de limpieza y desinfección",
          "Registro Sanitario",
          "Vida Útil",
          "Tipo de Equipo",
          "Fabricante",
          "Fuente de Alimentación",
          "Voltaje Máx.",
          "Voltaje Mín.",
          "Potencia",
          "Frecuencia",
          "Corriente Máx.",
          "Corriente Mín.",
          "Temperatura",
          "Presión",
          "Información Adicional Instalacion",
        
          "Tec. Predominante",
          "Velocidad",
          "Peso",
          "Rango Voltaje",
          "Rango Corriente",
          "Rango Frecuencia",
          "Rango Potencia",
          "Rango Presión",
          "Rango Temperatura",
          "Rango Humedad",
          "Otros Registro de Funcionamiento",
          "Manuales",
          "Planos",
          "Clasificación Biomédica",
          "Clasificación de Riesgo",
          "Clasificación de Uso",
          "Periodicidad de Mantenimiento",
          "Requiere Calibración",
          "Periodicidad de Calibración",
        ]}
        rowHeaders={true}
        columnSorting={true}
        contextMenu={["row_above", "row_below"]}
        stretchH="all"
        afterOnCellMouseDown={(event, coords, TD) => {
          console.log("Clic en celda:", coords);
          console.log(`Fila: ${coords.row}, Columna: ${coords.col}`);
          handleCellClick(coords);
        }}
        afterChange={(changes, source) => {
          if (!changes) return;
          const [row, col, oldValue, newValue] = changes[0];
          const hot = hotTableComponent.current.hotInstance;

          if (col === "equipo" && oldValue !== newValue) {
            const marcasDisponibles = obtenerMarcasPorEquipo(newValue);
            hot.getCellMeta(row, 1).source = marcasDisponibles;
            hot.setDataAtCell(row, 1, "");
            hot.setDataAtCell(row, 2, "");
          }

          if (col === "marca" && oldValue !== newValue) {
            const equipoSeleccionado = hot.getDataAtCell(row, 0);
            const modelosDisponibles = obtenerModelosPorEquipoYMarca(
              equipoSeleccionado,
              newValue
            );
            hot.getCellMeta(row, 2).source = modelosDisponibles;
            hot.setDataAtCell(row, 2, "");
          }

          if (col === "modelo" && oldValue !== newValue) {
            const equipoSeleccionado = hot.getDataAtCell(row, 0);
            const marcaSeleccionada = hot.getDataAtCell(row, 1);
            llenarDatosFila(
              row,
              equipoSeleccionado,
              marcaSeleccionada,
              newValue
            );
          }
        }}
        licenseKey="non-commercial-and-evaluation"
      >
        <HotColumn data="equipo" editor="dropdown" source={tiposEquipos} />
        <HotColumn
          data="marca"
          editor="dropdown"
          source={(query, callback) => {
            const hot = hotTableComponent.current?.hotInstance;
            const rowData = hot.getDataAtRow(query.row);
            const equipoSeleccionado = rowData[0];
            const marcasDisponibles =
              obtenerMarcasPorEquipo(equipoSeleccionado);
            callback(marcasDisponibles);
          }}
        />
        <HotColumn
          data="modelo"
          editor="dropdown"
          source={(query, callback) => {
            const hot = hotTableComponent.current.hotInstance;
            const rowData = hot.getDataAtRow(query.row);
            const equipoSeleccionado = rowData[0];
            const marcaSeleccionada = rowData[1];
            const modelosDisponibles = obtenerModelosPorEquipoYMarca(
              equipoSeleccionado,
              marcaSeleccionada
            );
            callback(modelosDisponibles);
          }}
        />
        <HotColumn data="serie" />
        <HotColumn data="inv_act" />
        <HotColumn data="servicio" />
        <HotColumn         type="dropdown"         // Define la columna como dropdown.
        source={areas}
        data="ubicacion" />
        <HotColumn data="fecha_instalacion" type="date" />
        <HotColumn data="fecha_operacion" type="date" />
        <HotColumn data="vencimiento_garantia" type="date" />
        <HotColumn data="forma_adquisicion" />
        <HotColumn  width={120}  data="componentes" />
        <HotColumn
          data="Certficado_calibración"
          renderer={(instance, td) => {
            td.innerHTML = `<input type="file" style="width: 100%; border: none; padding: 5px;" />`;
          }}
        />
        <HotColumn
          data="Imagen"
          renderer={(instance, td, row) => {
            td.innerHTML = `<input id="fileInput${row}" type="file" style="width: 100%; border: none; padding: 5px;" />`;
          }}
        />
        <HotColumn
          data="protocolo_de_limpieza_y_desinfección"
          renderer={(instance, td) => {
            td.innerHTML = `<input type="file" style="width: 100%; border: none; padding: 5px;" />`;
          }}
        />
        <HotColumn data="registro_sanitario" />
        <HotColumn data="vida_util" />
        <HotColumn
          data="tipo_equipo"
          editor="dropdown"
          source={["Móvil", "Fijo"]}
        />
        <HotColumn data="fabricante" />
        <HotColumn data="fuente_alimentacion" />
        <HotColumn data="voltaje_max" />
        <HotColumn data="voltaje_min" />
        <HotColumn data="potencia" />
        <HotColumn data="frecuencia" />
        <HotColumn data="corriente_max" />
        <HotColumn data="corriente_min" />
        <HotColumn data="temperatura" />
        <HotColumn data="presion" />
        <HotColumn data="informacion_adicional_instalacion" />
        <HotColumn data="tec_predominante" />
        <HotColumn data="velocidad" />
        <HotColumn data="peso" />
        <HotColumn data="rango_voltaje" />
        <HotColumn data="rango_corriente" />
        <HotColumn data="rango_frecuencia" />
        <HotColumn data="rango_potencia" />
        <HotColumn data="rango_presion" />
        <HotColumn data="rango_temperatura" />
        <HotColumn data="rango_humedad" />
        <HotColumn data="otros_registroFuncionamiento" />
        <HotColumn data="manuales" />
        <HotColumn data="planos" />
        <HotColumn 
           
                type="dropdown"         // Define la columna como dropdown.
                source={["Diagnostico", "Prevención", "Análisis Laboratorio", "Tratamiento de vida","Rehabilitación", "Otros"]}  
        data="clasificacion_biomedica" />
        <HotColumn
        data="clasificacion_riesgo"
        type="dropdown"         // Define la columna como dropdown.
        source={["I", "II", "III", "IV"]}      // Asigna las opciones para el dropdown.
      />
              <HotColumn
        data="clasificacion_Uso"
        type="dropdown"         // Define la columna como dropdown.
        source={["Medico", "Básico", "Apoyo", "Otros"]}      // Asigna las opciones para el dropdown.
      />
        <HotColumn       type="dropdown"         // Define la columna como dropdown.
     source={["Mensual", "Anual", "Semestral", "Trimestral", "Quincenal", "Bimestral", "Semanal", "Cuatrimestral", "Cada dos años"]}
     data="periocidad_mantenimiento" />
        <HotColumn         type="dropdown"         // Define la columna como dropdown.
        source={["SI" , "NO"]}  data="requiere_calibracion" />
        <HotColumn  type="dropdown"         // Define la columna como dropdown.
     source={["Mensual", "Anual", "Semestral", "Trimestral", "Quincenal", "Bimestral", "Semanal", "Cuatrimestral", "Cada dos años"]} data="periocidad_calibracion" />
      </HotTable>




      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Seleccionar Manuales</DialogTitle>
        <DialogContent>
          {opciones.map((opcion) => (
            <FormControlLabel
              key={opcion}
              control={
                <Checkbox
                  checked={currentCell.value.includes(opcion)}
                  onChange={() => handleCheckboxChange(opcion)}
                />
              }
              label={<span className="customLabel">{opcion}</span>}
            />
          ))}
          <Button
            onClick={handleSave}
            className="clienteButton2"
            style={{
              width: "100%",
              height: "60px",
              fontSize: "16px",
              fontFamily: "fantasy",
              fontWeight: "200",
              backgroundColor: "#000000",
              border: "none",
              borderRadius: "15px",
              marginRight: "auto",
              marginTop: "20px",
              color: "#ffffff",
              alignSelf: "center",
            }}
          >
            Guardar
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={modalPlanosOpen} onClose={() => setModalPlanosOpen(false)}>
        <DialogTitle>Seleccionar Manuales</DialogTitle>
        <DialogContent>
          {opcionesPlanos.map((opcion) => (
            <FormControlLabel
              key={opcion}
              control={
                <Checkbox
                  checked={currentCell.value.includes(opcion)}
                  onChange={() => handleCheckboxChange(opcion)}
                />
              }
              label={<span className="customLabel">{opcion}</span>}
            />
          ))}
          <Button
            onClick={handleSave2}
            className="clienteButton2"
            style={{
              width: "100%",
              height: "60px",
              fontSize: "16px",
              fontFamily: "fantasy",
              fontWeight: "200",
              backgroundColor: "#000000",
              border: "none",
              borderRadius: "15px",
              marginRight: "auto",
              marginTop: "20px",
              color: "#ffffff",
              alignSelf: "center",
            }}
          >
            Guardar
          </Button>
        </DialogContent>
      </Dialog>

      <ComponentDialog 
        open={modalComponentesOpen} 
        onClose={() => setModalComponentesOpen(false)} 
        onSave={handleSave3} 
      />

      
    
    </div>
  );
}

export default App;
