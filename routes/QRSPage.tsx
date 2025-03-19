import React, { useEffect, useState, useRef, useCallback } from "react";
import QRCodeStyling, {
  DotType,
  CornerSquareType,
  CornerDotType,
} from "qr-code-styling";
import "./qr.css"
import logo from "../src/assets/logo.png"; // Ruta relativa
import axios from "axios";
import jsPDF from "jspdf";
import url from "../url.json"
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
const QRSPage = () => {
  const [isAreaGetted, setIsAreaGetted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [search, setSearch] = useState("");
  const [searchEquipment, setSearchEquipment] = useState("");
  const [data, setData] = useState<string[]>([]);
  const [tipos, setTipos] = useState<string[]>([]);
  const [filteredTipos, setFilteredTipos] = useState<string[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<Area[]>([]);
  const [selectedTipo, setSelectedTipo] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedCodeArea, setSelectedCodeArea] = useState<string>("");
  const [areas, setAreas] = useState<Area[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);

  const [filteredEquipos, setFilteredEquipos] = useState<Equipo[]>([]);
  const [selectedEquipo, setSelectedEquipo] = useState<string>("");
  const [currentQRIndex, setCurrentQRIndex] = useState<number>(0);
  const [dotColor, setDotColor] = useState("#00040f");
  const [cornerColor, setCornerColor] = useState("#000000");
  const [cornerDotColor, setCornerDotColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [option, setOption] = useState("");
  const qrRefs = useRef<(HTMLDivElement | null)[]>([]);
  const getAreas = async () => {
    try {
      const response = await axios.get(`${url.url}/areas/YCPI`);
      console.log("Areas:", response.data); // Verifica la respuesta
      response.data.map((area: Area) => {
        console.log("Nombre:", area.nombre);
        console.log("Código:", area.codigoIdentificacion);
        setAreas((prev) => [
          ...prev,
          {
            nombre: area.nombre,
            codigoIdentificacion: area.codigoIdentificacion,
          },
        ]);
        setFilteredAreas((prev) => [
          ...prev,
          {
            nombre: area.nombre,
            codigoIdentificacion: area.codigoIdentificacion,
          },
        ]);
      });
    } catch (error) {
      console.error("Error obteniendo areas:", error);
    }
  };
  const getEquipmentInArea = async (codigoIdentificacion: string) => {
    try {
      const response = await axios.get(
        `${url.url}/getequipos/YCPI/${codigoIdentificacion}`
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

  const getTipos = async () => {
    try {
      const response = await axios.get(`${url.url}/tipos/YCPI`);
      console.log("Tipos:", response.data); // Verifica la respuesta
      setTipos(response.data);
      setFilteredTipos(response.data);
    } catch (error) {
      console.error("Error obteniendo tipos:", error);
    }
  };
  const searchFilterFunctionArea = (text: string) => {
    if (text) {
      const newData = areas;
      const filteredData = newData.filter((item) => {
        const itemData = item.nombre.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredAreas(filteredData);
    } else {
      setFilteredAreas(areas);
    }
  };
  const searchFilterFunctionEquipment = (text: string) => {
    if (text) {
      const filteredData = equipos.filter((item) => {
        const itemData =
          `${item.codigoIdentificacion} ${item.Tipo} ${item.Marca} ${item.Modelo} ${item.Serie}`.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredEquipos(filteredData);
    } else {
      setFilteredEquipos(equipos);
    }
  };
  const searchFilterFunction = (text: string) => {
    if (text) {
      const newData = tipos;
      const filteredData = newData.filter((item) => {
        const itemData = item.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredTipos(filteredData);
    }
  };
  const generateTypeQRCodes = useCallback(async () => {
    try {
      const response = await axios.get(
        `${url.url}/typeqrs/YCPI/${selectedTipo}`
      );
      const data: string[] = response.data;
      setData(data);
      const pdf = new jsPDF();
      const batchSize = 10;
      if (data.length > 0) {
        setIsStarted(true);
      }
      for (let i = 0; i < data.length; i += batchSize) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        for (let j = i; j < i + batchSize && j < data.length; j++) {
          setCurrentQRIndex((prev) => prev + 1);
          const qrCode = new QRCodeStyling({
            width: 250,
            height: 250,
            margin: 0,
            image: logo,
            dotsOptions: { color: dotColor, type: "dots" as DotType },
            cornersSquareOptions: {
              type: "square" as CornerSquareType,
              color: cornerColor,
            },
            cornersDotOptions: {
              type: "dot" as CornerDotType,
              color: cornerDotColor,
            },
            backgroundOptions: { color: backgroundColor },
            imageOptions: { imageSize: 0.3, margin: 0 },
            qrOptions: { errorCorrectionLevel: "H", typeNumber: 4 },
            data: data[j],
          });

          if (!qrRefs.current[j]) {
            qrRefs.current[j] = document.createElement("div");
          }
          if (qrRefs.current[j]) {
            qrCode.append(qrRefs.current[j]);
          }
          const qrCodeCanvas = qrRefs.current[j]?.querySelector("canvas");
          if (qrCodeCanvas) {
            const imgData = qrCodeCanvas.toDataURL("image/png");
            const x = (j % 5) * 40 + 10;
            const y = Math.floor((j % 25) / 5) * 40 + 10;
            pdf.addImage(imgData, "PNG", x, y, 30, 30);
          }
          if ((j + 1) % 25 === 0 && j < data.length - 1) {
            pdf.addPage();
          }
        }
      }
      pdf.save("EquiposTipo" + selectedTipo + ".pdf");
    } catch (error) {
      console.error("Error generando QR:", error);
    } finally {
      setData([]);
      setCurrentQRIndex(0);
      setIsStarted(false);
    }
  }, [dotColor, cornerColor, cornerDotColor, backgroundColor, selectedTipo]);
  const generateImage = useCallback(async () => {
    try {
      const qrCode = new QRCodeStyling({
        width: 250,
        height: 250,
        margin: 0,
        image: logo,
        dotsOptions: { color: dotColor, type: "dots" as DotType },
        cornersSquareOptions: {
          type: "square" as CornerSquareType,
          color: cornerColor,
        },
        cornersDotOptions: {
          type: "dot" as CornerDotType,
          color: cornerDotColor,
        },
        backgroundOptions: { color: backgroundColor },
        imageOptions: { imageSize: 0.3, margin: 0 },
        qrOptions: { errorCorrectionLevel: "H", typeNumber: 4 },
        data: selectedEquipo,
      });

      if (!qrRefs.current[0]) {
        qrRefs.current[0] = document.createElement("div");
      }
      qrCode.append(qrRefs.current[0]);

      await new Promise((resolve) => setTimeout(resolve, 300));

      const qrCodeCanvas = qrRefs.current[0]?.querySelector("canvas");
      if (qrCodeCanvas) {
        const imgData = qrCodeCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "Equipo-" + selectedEquipo + ".png";
        link.click();
      }
    } catch (error) {
      console.error("Error generando QR:", error);
    } finally {
      setData([]);
      setCurrentQRIndex(0);
      setIsStarted(false);
    }
  }, [dotColor, cornerColor, cornerDotColor, backgroundColor, selectedEquipo]);
  const generateOneQRtoPdf = useCallback(async () => {
    try {
      const qrCode = new QRCodeStyling({
        width: 250,
        height: 250,
        margin: 0,
        image: logo,
        dotsOptions: { color: dotColor, type: "dots" as DotType },
        cornersSquareOptions: {
          type: "square" as CornerSquareType,
          color: cornerColor,
        },
        cornersDotOptions: {
          type: "dot" as CornerDotType,
          color: cornerDotColor,
        },
        backgroundOptions: { color: backgroundColor },
        imageOptions: { imageSize: 0.3, margin: 0 },
        qrOptions: { errorCorrectionLevel: "H", typeNumber: 4 },
        data: selectedEquipo,
      });

      const pdf = new jsPDF();
      if (!qrRefs.current[0]) {
        qrRefs.current[0] = document.createElement("div");
      }
      qrCode.append(qrRefs.current[0]);

      await new Promise((resolve) => setTimeout(resolve, 300));

      const qrCodeCanvas = qrRefs.current[0]?.querySelector("canvas");
      if (qrCodeCanvas) {
        const imgData = qrCodeCanvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 10, 10, 30, 30);
      }
      pdf.save("Equipo-" + selectedEquipo + ".pdf");
    } catch (error) {
      console.error("Error generando QR:", error);
    } finally {
      setData([]);
      setCurrentQRIndex(0);
      setIsStarted(false);
    }
  }, [dotColor, cornerColor, cornerDotColor, backgroundColor, selectedEquipo]);

  const generateAllQRCodes = useCallback(async () => {
    try {
      const response = await axios.get(`${url.url}/allqrs/YCPI`);
      const data: string[] = response.data;
      setData(data);
      const pdf = new jsPDF();
      const batchSize = 10;

      if (data.length > 0) {
        setIsStarted(true);
      }

      for (let i = 0; i < data.length; i += batchSize) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        for (let j = i; j < i + batchSize && j < data.length; j++) {
          setCurrentQRIndex((prev) => prev + 1);

          const qrCode = new QRCodeStyling({
            width: 250,
            height: 250,
            margin: 0,
            image: logo,
            dotsOptions: { color: dotColor, type: "dots" as DotType },
            cornersSquareOptions: {
              type: "square" as CornerSquareType,
              color: cornerColor,
            },
            cornersDotOptions: {
              type: "dot" as CornerDotType,
              color: cornerDotColor,
            },
            backgroundOptions: { color: backgroundColor },
            imageOptions: { imageSize: 0.3, margin: 0 },
            qrOptions: { errorCorrectionLevel: "H", typeNumber: 4 },
            data: data[j],
          });

          if (!qrRefs.current[j]) {
            qrRefs.current[j] = document.createElement("div");
          }
          qrCode.append(qrRefs.current[j]);

          await new Promise((resolve) => setTimeout(resolve, 300));

          const qrCodeCanvas = qrRefs.current[j]?.querySelector("canvas");
          if (qrCodeCanvas) {
            const imgData = qrCodeCanvas.toDataURL("image/png");
            const x = (j % 5) * 40 + 10;
            const y = Math.floor((j % 35) / 5) * 40 + 10;
            pdf.addImage(imgData, "PNG", x, y, 30, 30);
          }
          if ((j + 1) % 35 === 0 && j < data.length - 1) {
            pdf.addPage();
          }
        }
      }
      pdf.save("TodoslosEquipos.pdf");
    } catch (error) {
      console.error("Error generando QR:", error);
    } finally {
      setData([]);
      setCurrentQRIndex(0);
      setIsStarted(false);
    }
  }, [dotColor, cornerColor, cornerDotColor, backgroundColor]);
  const generateQRSAreas = useCallback(async () => {
    try {
      const response = await axios.get(
        `${url.url}/areaqrs/YCPI/${selectedCodeArea}`
      );
      const data: string[] = response.data;
      setData(data);
      const pdf = new jsPDF();
      const batchSize = 10;

      if (data.length > 0) {
        setIsStarted(true);
      }

      for (let i = 0; i < data.length; i += batchSize) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        for (let j = i; j < i + batchSize && j < data.length; j++) {
          setCurrentQRIndex((prev) => prev + 1);

          const qrCode = new QRCodeStyling({
            width: 250,
            height: 250,
            margin: 0,
            image: logo,
            dotsOptions: { color: dotColor, type: "dots" as DotType },
            cornersSquareOptions: {
              type: "square" as CornerSquareType,
              color: cornerColor,
            },
            cornersDotOptions: {
              type: "dot" as CornerDotType,
              color: cornerDotColor,
            },
            backgroundOptions: { color: backgroundColor },
            imageOptions: { imageSize: 0.3, margin: 0 },
            qrOptions: { errorCorrectionLevel: "H", typeNumber: 4 },
            data: data[j],
          });

          if (!qrRefs.current[j]) {
            qrRefs.current[j] = document.createElement("div");
          }
          qrCode.append(qrRefs.current[j]);

          await new Promise((resolve) => setTimeout(resolve, 300));

          const qrCodeCanvas = qrRefs.current[j]?.querySelector("canvas");
          if (qrCodeCanvas) {
            const imgData = qrCodeCanvas.toDataURL("image/png");
            const x = (j % 5) * 40 + 10;
            const y = Math.floor((j % 35) / 5) * 40 + 10;
            pdf.addImage(imgData, "PNG", x, y, 30, 30);
          }
          if ((j + 1) % 35 === 0 && j < data.length - 1) {
            pdf.addPage();
          }
        }
      }
      pdf.save("EquiposArea" + selectedArea + ".pdf");
    } catch (error) {
      console.error("Error generando QR:", error);
    } finally {
      setData([]);
      setCurrentQRIndex(0);
      setIsStarted(false);
    }
  }, [dotColor, cornerColor, cornerDotColor, backgroundColor, selectedArea]);
  const generateSomeQRCodes = useCallback(async () => {
    try {
      const pdf = new jsPDF();
      const batchSize = 10;

      if (data.length > 0) {
        setIsStarted(true);
      }

      for (let i = 0; i < data.length; i += batchSize) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        for (let j = i; j < i + batchSize && j < data.length; j++) {
          setCurrentQRIndex((prev) => prev + 1);

          const qrCode = new QRCodeStyling({
            width: 250,
            height: 250,
            margin: 0,
            image: logo,
            dotsOptions: { color: dotColor, type: "dots" as DotType },
            cornersSquareOptions: {
              type: "square" as CornerSquareType,
              color: cornerColor,
            },
            cornersDotOptions: {
              type: "dot" as CornerDotType,
              color: cornerDotColor,
            },
            backgroundOptions: { color: backgroundColor },
            imageOptions: { imageSize: 0.3, margin: 0 },
            qrOptions: { errorCorrectionLevel: "H", typeNumber: 4 },
            data: data[j],
          });

          if (!qrRefs.current[j]) {
            qrRefs.current[j] = document.createElement("div");
          }

          // Asegurar que el QR se renderiza completamente antes de continuar
          await qrCode.append(qrRefs.current[j]);
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Obtener el canvas del QR generado
          const qrCodeCanvas = qrRefs.current[j]?.querySelector("canvas");

          if (qrCodeCanvas) {
            console.log(`QR generado correctamente para ${data[j]}`);

            // Convertir el canvas en imagen
            const imgData = qrCodeCanvas.toDataURL("image/png");

            // Calcular posición en el PDF
            const x = (j % 5) * 40 + 10;
            const y = Math.floor((j % 35) / 5) * 40 + 10;

            pdf.addImage(imgData, "PNG", x, y, 30, 30);
          } else {
            console.error(
              `Error: No se pudo obtener el canvas del QR para ${data[j]}`
            );
          }

          if ((j + 1) % 35 === 0 && j < data.length - 1) {
            pdf.addPage();
          }
        }
      }

      console.log("Guardando PDF con", pdf.internal.pages.length, "páginas");
      pdf.save("TodoslosEquipos.pdf");
    } finally {
      setIsStarted(false);
      setCurrentQRIndex(0)
    }
  }, [dotColor, cornerColor, cornerDotColor, backgroundColor, data]);

  const handleAddSomeEquipment = (codigoEquipo: string) => {
    setData((prev) => [...prev, codigoEquipo]);
  };

  const handleDeleteSomeEquipment = (codigoEquipo: string) => {
    setData((prev) => prev.filter((equipo) => equipo !== codigoEquipo));
  };
  useEffect(() => {
    console.log(option);
    if (option === "typeEquipment") {
      getTipos();
    }
    if (
      option === "areaEquipment" ||
      option === "singleEquipment" ||
      option === "someEquipment"
    ) {
      getAreas();
    }
  }, [option]);

  useEffect(() => {
    console.log("Progreso actualizado:", currentQRIndex);
  }, [currentQRIndex]);

  return (
    <div className="dashboard-container7">
  
      <div className="divtitle">
        <h1 className="texttile">Generador de códigos QR</h1>
      </div>
      <div className="divqrs">
        <div className="picker">
          <label htmlFor="fileExt">¿Qué deseas generar?</label>
          <select onChange={(e) => setOption(e.target.value)}>
            <option value="">Selecciona aquí</option>
            <option value="singleEquipment">Un único equipo</option>
            <option value="areaEquipment">Todos los equipos de un área</option>
            <option value="typeEquipment">Todos los equipos de un tipo</option>
            <option value="allEquipment">Todos los equipos del hospital</option>
            <option value="someEquipment">Generar varios equipos</option>
          </select>
        </div>
      </div>
      <div className="containerChoice">
        {option === "allEquipment" && (
          <div className="allEquipmentContainer">
            <h1 className="titleContainer">
              Crear todos los equipos del hospital
            </h1>
            <button className="bottonDownload" onClick={generateAllQRCodes}>
              GENERAR PDF Y DESCARGAR
            </button>
            {isStarted ? (
              <p className="progressText">
                Progreso: {currentQRIndex} de {data.length} QRS
              </p>
            ) : null}
          </div>
        )}
        {option === "typeEquipment" && (
          <div className="typeEquipmentContainer">
            <h1 className="titleContainer">
              Crear todos los equipos de un tipo
            </h1>
            <input
              type="text"
              className="searchInput"
              placeholder={
                selectedTipo === ""
                  ? "Buscar tipo"
                  : "Tipo seleccionado: " + selectedTipo
              }
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                searchFilterFunction(e.target.value);
              }}
            />
            <div className="divOptions">
              {filteredTipos.map((tipo, index) => (
                <button
                  key={index}
                  className="option"
                  onClick={() => {
                    setSelectedTipo(tipo);
                    setSearch("");
                    setFilteredTipos([]);
                  }}
                >
                  {tipo}
                </button>
              ))}
            </div>
            {selectedTipo === "" ? null : (
              <button onClick={generateTypeQRCodes} className="bottonDownload">
                GENERAR PDF Y DESCARGAR
              </button>
            )}
            {isStarted ? (
              <p className="progressText">
                Progreso: {currentQRIndex} de {data.length} QRS
              </p>
            ) : null}
          </div>
        )}
        {option === "singleEquipment" && (
          <div className="singleEquipmentContainer">
            <h1 className="titleContainer">Crear un único equipo</h1>
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
            ) : null}
            <div className="divOptions">
              {filteredEquipos.map((equipo, index) => (
                <div
                  onClick={() => {
                    setSelectedEquipo(equipo.codigoIdentificacion);
                    setSearchEquipment("");
                    setFilteredEquipos([]);
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
            {selectedEquipo !== "" ? (
              <div className="divButtons">
                <button onClick={generateImage} className="bottonDownload">
                  GENERAR IMAGEN Y DESCARGAR
                </button>
                <button onClick={generateOneQRtoPdf} className="bottonDownload">
                  GENERAR PDF Y DESCARGAR
                </button>
              </div>
            ) : null}
          </div>
        )}
        {option === "areaEquipment" && (
          <div className="areaEquipmentContainer">
            <h1 className="titleContainer">
              Crear todos los equipos de un área
            </h1>
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
                    setSearch("");
                    setFilteredAreas([]);
                  }}
                >
                  {area.nombre}
                </button>
              ))}
            </div>
            {selectedCodeArea === "" ? null : (
              <button
                onClick={() => {
                  generateQRSAreas();
                }}
                className="bottonDownload"
              >
                GENERAR PDF Y DESCARGAR
              </button>
            )}
            {isStarted ? (
              <p className="progressText">
                Progreso: {currentQRIndex} de {data.length} QRS
              </p>
            ) : null}
          </div>
        )}
        {option === "someEquipment" ? (
          <div className="someEquipmentContainer">
            <h1>Crear varios equipos </h1>
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
            ) : null}
            <div className="someEquipmentOptions">
              {data.map((equipo, index) => (
                <div className="optionSome">
                  <p>{data[index]}</p>
                  <button
                    className="buttonDelete"
                    onClick={() => handleDeleteSomeEquipment(equipo)}
                  >
                    <img
                      src="https://img.icons8.com/ios-glyphs/30/000000/delete-sign.png"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </button>
                </div>
              ))}
            </div>

            {data.length > 0 ? (
              <div>
                <button
                  onClick={generateSomeQRCodes}
                  className="bottonDownload"
                >
                  GENERAR PDF Y DESCARGAR
                </button>
              </div>
            ) : null}
            {isStarted ? (
              <p className="progressText">
                Progreso: {currentQRIndex} de {data.length} QRS
              </p>
            ) : null}
            <div className="divOptions">
              {filteredEquipos.map((equipo, index) => (
                <div
                  onClick={() => {
                    handleAddSomeEquipment(equipo.codigoIdentificacion);
                    setSearchEquipment("");
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
    </div>
 
  );
};

export default QRSPage;
