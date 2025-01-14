import React, { useState, useRef } from "react";
import { HotTable, HotColumn } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { registerLanguageDictionary, esMX } from "handsontable/i18n";
import "handsontable/dist/handsontable.full.css";
import "./CrearEquipos.css";
import equiposData from "./equipos.json";

registerAllModules();
registerLanguageDictionary(esMX);

function App() {
  const [equipos, setEquipos] = useState(equiposData);
  const hotTableComponent = useRef(null);
  const tiposEquipos = [...new Set(equiposData.map((equipo) => equipo.EQUIPO))];

  const obtenerMarcasPorEquipo = (equipoNombre) => {
    if (!equipoNombre) return [];
    return [
      ...new Set(
        equiposData.filter((equipo) => equipo.EQUIPO === equipoNombre).map((equipo) => equipo.MARCA)
      ),
    ];
  };

  const obtenerModelosPorEquipoYMarca = (equipoNombre, marcaNombre) => {
    if (!equipoNombre || !marcaNombre) return [];
    return [
      ...new Set(
        equiposData
          .filter(
            (equipo) => equipo.EQUIPO === equipoNombre && equipo.MARCA === marcaNombre
          )
          .map((equipo) => equipo.MODELO)
      ),
    ];
  };

  const agregarFila = () => {
    const nuevaFila = {
      equipo: "",
      marca: "",
      modelo: "",
      serie: "",
      inv_act: "",
      servicio: "",
      ubicacion: "",
      registro_sanitario: "",
      vida_util: "",
      tipo_equipo: "",
      forma_adquisicion: "",
      fabricante: "",
      fecha_compra: "",
      fecha_operacion: "",
      vencimiento_garantia: "",
      fuente_alimentacion: "",
      voltaje_max: "",
      voltaje_min: "",
      potencia: "",
      frecuencia: "",
      corriente_max: "",
      corriente_min: "",
      temperatura: "",
      presion: "",
      otros: "",
    };
    setEquipos([...equipos, nuevaFila]);
  };

  const obtenerDatosPorEquipoMarcaYModelo = (equipoNombre, marcaNombre, modeloNombre) => {
    if (!equipoNombre || !marcaNombre || !modeloNombre) return null;
    return equiposData.find(
      (equipo) =>
        equipo.EQUIPO === equipoNombre &&
        equipo.MARCA === marcaNombre &&
        equipo.MODELO === modeloNombre
    );
  };
  const llenarDatosFila = (row, equipoSeleccionado, marcaSeleccionada, modeloSeleccionado) => {
    const datos = obtenerDatosPorEquipoMarcaYModelo(
      equipoSeleccionado,
      marcaSeleccionada,
      modeloSeleccionado
    );

    if (datos) {
      const hot = hotTableComponent.current.hotInstance;

      // Actualiza las demás columnas de la fila
 
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
      <h1 className="titleAdd">Agregar Equipos</h1>
      <div className="button-group">
        <button
          className="custom-button"
          onClick={() =>
            hotTableComponent.current.hotInstance.getPlugin("exportFile").downloadFile("csv", {
              filename: "registro_equipos",
              fileExtension: "csv",
              mimeType: "text/csv",
              columnHeaders: true,
            })
          }
        >
          Descargar CSV
        </button>
        <button className="custom-button1" onClick={agregarFila}>
          Crear Equipos
        </button>
      </div>
      <HotTable
        ref={hotTableComponent}
        className="custom-table"
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
          "Fecha de Compra",
          "Fecha de Operación",
          "Vencimiento Garantía",
          "Forma de Adquisición",
          "Componentes",
          "Certificado de Calibración",  
          "Imagen",     
          "Registro Sanitario o PC",
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
          "Velocidad",
          "Peso",
          "Tec. Predominante",
          "Presión",
          "Otros",
          "Rango de Voltaje",
          "Rango de Corriente",
          "Rango de Potencia",
          "Rango de Temperatura",
          "Rango de Humedad",
          "Otros Rangos",
          "Clasificación Biomedica",
          "Clasificación Riesgo",
        ]}
        rowHeaders={true}
        columnSorting={true}
        contextMenu={["row_above", "row_below"]}
        stretchH="all"
        afterChange={(changes, source) => {
            if (!changes) return;
            const [row, col, oldValue, newValue] = changes[0];
            const hot = hotTableComponent.current.hotInstance;
          
            // Si cambia el equipo
            if (col === "equipo" && oldValue !== newValue) {
              const marcasDisponibles = obtenerMarcasPorEquipo(newValue);
              hot.getCellMeta(row, 1).source = marcasDisponibles; // Actualiza las marcas para la fila
              hot.setDataAtCell(row, 1, ""); // Limpia la celda de marca
              hot.setDataAtCell(row, 2, ""); // Limpia la celda de modelo
            }
          
            // Si cambia la marca
            if (col === "marca" && oldValue !== newValue) {
              const equipoSeleccionado = hot.getDataAtCell(row, 0); // Obtiene el equipo de la fila
              const modelosDisponibles = obtenerModelosPorEquipoYMarca(equipoSeleccionado, newValue);
              hot.getCellMeta(row, 2).source = modelosDisponibles; // Actualiza los modelos para la fila
              hot.setDataAtCell(row, 2, ""); // Limpia la celda de modelo
            }
          
            // Si cambia el modelo
            if (col === "modelo" && oldValue !== newValue) {
              const equipoSeleccionado = hot.getDataAtCell(row, 0); // Obtiene equipo
              const marcaSeleccionada = hot.getDataAtCell(row, 1); // Obtiene marca
              llenarDatosFila(row, equipoSeleccionado, marcaSeleccionada, newValue);
            }
          }}
        licenseKey="non-commercial-and-evaluation"
      >
        <HotColumn data="equipo" editor="dropdown" source={tiposEquipos} />
        <HotColumn
          data="marca"
          editor="dropdown"
          source={(query, callback) => {
            const hot = hotTableComponent.current.hotInstance;
            const rowData = hot.getDataAtRow(query.row);
            const equipoSeleccionado = rowData[0];
            const marcasDisponibles = obtenerMarcasPorEquipo(equipoSeleccionado);
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
        <HotColumn data="ubicacion" />
    
        <HotColumn data="fecha_compra" type="date" />
        <HotColumn data="fecha_operacion" type="date" />
        <HotColumn data="vencimiento_garantia" type="date" />
        <HotColumn data="forma_adquisicion" />
        <HotColumn
          data="Certficado_calibración"
          renderer={(instance, td) => {
            td.innerHTML = `<input type="file" style="width: 100%; border: none; padding: 5px;" />`;
          }}
        />
           <HotColumn
          data="Imagen"
          renderer={(instance, td) => {
            td.innerHTML = `<input type="file" style="width: 100%; border: none; padding: 5px;" />`;
          }}
        />
        <HotColumn data="registro_sanitario" />
        <HotColumn data="vida_util" />
    
        <HotColumn data="tipo_equipo" editor="dropdown" source={["Móvil", "Fijo"]} />
    
     
 
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
        <HotColumn data="otros" />
      </HotTable>
    </div>
  );
}

export default App;
