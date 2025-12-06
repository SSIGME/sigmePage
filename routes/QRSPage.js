import React, { useEffect, useState, useRef, useCallback } from "react";
import QRCodeStyling from "qr-code-styling";
import "./QRSPage.css";
import logo from "../src/assets/logo.png"; // Ruta relativa
import axios from "axios";
import jsPDF from "jspdf";
import url from "../url.json";
import useStore from "../src/utils/useStore";
const QRSPage = () => {
    const hospitalCode = useStore((state) => state.hospitalCode);
    const [isAreaGetted, setIsAreaGetted] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [search, setSearch] = useState("");
    const [searchEquipment, setSearchEquipment] = useState("");
    const [data, setData] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [filteredTipos, setFilteredTipos] = useState([]);
    const [filteredAreas, setFilteredAreas] = useState([]);
    const [selectedTipo, setSelectedTipo] = useState("");
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedCodeArea, setSelectedCodeArea] = useState("");
    const [areas, setAreas] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [filteredEquipos, setFilteredEquipos] = useState([]);
    const [selectedEquipo, setSelectedEquipo] = useState("");
    const [currentQRIndex, setCurrentQRIndex] = useState(0);
    const [dotColor, setDotColor] = useState("#00040f");
    const [cornerColor, setCornerColor] = useState("#000000");
    const [cornerDotColor, setCornerDotColor] = useState("#000000");
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [option, setOption] = useState("");
    const qrRefs = useRef([]);
    const generateCsv = async (param) => {
        try {
            let response;
            let resultData = [];
            if (param === "allEquipment") {
                response = await axios.get(`${url.url}/allqrs/${hospitalCode}`);
                resultData = response.data;
            }
            else if (param === "typeEquipment") {
                response = await axios.get(`${url.url}/typeqrs/${hospitalCode}/${selectedTipo}`);
                resultData = response.data;
            }
            else if (param === "equipmentArea") {
                console.log(selectedCodeArea);
                response = await axios.get(`${url.url}/areaqrs/${hospitalCode}/${selectedCodeArea}`);
                resultData = response.data;
            }
            else if (param === "oneQr" || param === "someEquipment") {
                resultData = data;
            }
            else {
                console.error("Parámetro no válido para generar CSV.");
                return;
            }
            setData(resultData);
            if (!resultData || resultData.length === 0) {
                console.log("Data aquí", resultData);
                console.error("No hay datos para generar el archivo CSV.");
                return;
            }
            setIsStarted(true);
            let csvContent = resultData.map((code) => `"${code}"`).join("\n");
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", blobUrl);
            link.setAttribute("download", "codigos_equipos.csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        catch (error) {
            console.error("Error generando CSV:", error);
        }
        finally {
            setIsStarted(false);
        }
    };
    const getAreas = async () => {
        try {
            const response = await axios.get(`${url.url}/areas/${hospitalCode}`);
            console.log("Areas:", response.data); // Verifica la respuesta
            response.data.map((area) => {
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
    const getTipos = async () => {
        try {
            const response = await axios.get(`${url.url}/tipos/${hospitalCode}`);
            console.log("Tipos:", response.data); // Verifica la respuesta
            setTipos(response.data);
            setFilteredTipos(response.data);
        }
        catch (error) {
            console.error("Error obteniendo tipos:", error);
        }
    };
    const searchFilterFunctionArea = (text) => {
        if (text) {
            const newData = areas;
            const filteredData = newData.filter((item) => {
                const itemData = item.nombre.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredAreas(filteredData);
        }
        else {
            setFilteredAreas(areas);
        }
    };
    const searchFilterFunctionEquipment = (text) => {
        if (text) {
            const filteredData = equipos.filter((item) => {
                const itemData = `${item.codigoIdentificacion} ${item.Tipo} ${item.Marca} ${item.Modelo} ${item.Serie}`.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredEquipos(filteredData);
        }
        else {
            setFilteredEquipos(equipos);
        }
    };
    const searchFilterFunction = (text) => {
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
            const response = await axios.get(`${url.url}/typeqrs/${hospitalCode}/${selectedTipo}`);
            const data = response.data;
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
                        dotsOptions: { color: dotColor, type: "dots" },
                        cornersSquareOptions: {
                            type: "square",
                            color: cornerColor,
                        },
                        cornersDotOptions: {
                            type: "dot",
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
        }
        catch (error) {
            console.error("Error generando QR:", error);
        }
        finally {
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
                dotsOptions: { color: dotColor, type: "dots" },
                cornersSquareOptions: {
                    type: "square",
                    color: cornerColor,
                },
                cornersDotOptions: {
                    type: "dot",
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
        }
        catch (error) {
            console.error("Error generando QR:", error);
        }
        finally {
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
                dotsOptions: { color: dotColor, type: "dots" },
                cornersSquareOptions: {
                    type: "square",
                    color: cornerColor,
                },
                cornersDotOptions: {
                    type: "dot",
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
        }
        catch (error) {
            console.error("Error generando QR:", error);
        }
        finally {
            setData([]);
            setCurrentQRIndex(0);
            setIsStarted(false);
        }
    }, [dotColor, cornerColor, cornerDotColor, backgroundColor, selectedEquipo]);
    const generateAllQRCodes = useCallback(async () => {
        try {
            const response = await axios.get(`${url.url}/allqrs/${hospitalCode}`);
            const data = response.data;
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
                        dotsOptions: { color: dotColor, type: "dots" },
                        cornersSquareOptions: {
                            type: "square",
                            color: cornerColor,
                        },
                        cornersDotOptions: {
                            type: "dot",
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
        }
        catch (error) {
            console.error("Error generando QR:", error);
        }
        finally {
            setData([]);
            setCurrentQRIndex(0);
            setIsStarted(false);
        }
    }, [dotColor, cornerColor, cornerDotColor, backgroundColor]);
    const generateQRSAreas = useCallback(async () => {
        try {
            const response = await axios.get(`${url.url}/areaqrs/${hospitalCode}/${selectedCodeArea}`);
            const data = response.data;
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
                        dotsOptions: { color: dotColor, type: "dots" },
                        cornersSquareOptions: {
                            type: "square",
                            color: cornerColor,
                        },
                        cornersDotOptions: {
                            type: "dot",
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
        }
        catch (error) {
            console.error("Error generando QR:", error);
        }
        finally {
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
                        dotsOptions: { color: dotColor, type: "dots" },
                        cornersSquareOptions: {
                            type: "square",
                            color: cornerColor,
                        },
                        cornersDotOptions: {
                            type: "dot",
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
                    }
                    else {
                        console.error(`Error: No se pudo obtener el canvas del QR para ${data[j]}`);
                    }
                    if ((j + 1) % 35 === 0 && j < data.length - 1) {
                        pdf.addPage();
                    }
                }
            }
            console.log("Guardando PDF con", pdf.internal.pages.length, "páginas");
            pdf.save("TodoslosEquipos.pdf");
        }
        finally {
            setIsStarted(false);
            setCurrentQRIndex(0);
        }
    }, [dotColor, cornerColor, cornerDotColor, backgroundColor, data]);
    const handleAddSomeEquipment = (codigoEquipo) => {
        setData((prev) => [...prev, codigoEquipo]);
    };
    const handleDeleteSomeEquipment = (codigoEquipo) => {
        setData((prev) => prev.filter((equipo) => equipo !== codigoEquipo));
    };
    useEffect(() => {
        console.log(option);
        if (option === "typeEquipment") {
            getTipos();
        }
        if (option === "areaEquipment" ||
            option === "singleEquipment" ||
            option === "someEquipment") {
            getAreas();
        }
    }, [option]);
    useEffect(() => {
        console.log("Data", data);
    }, [data]);
    useEffect(() => {
        console.log("Progreso actualizado:", currentQRIndex);
    }, [currentQRIndex]);
    return (React.createElement("div", { className: "container-qrs" },
        React.createElement("div", { className: "divtitle" },
            React.createElement("h1", { className: "texttile" }, "Generador de c\u00F3digos QR")),
        React.createElement("div", { className: "divqrs" },
            React.createElement("div", { className: "picker" },
                React.createElement("label", { htmlFor: "fileExt" }, "\u00BFQu\u00E9 deseas generar?"),
                React.createElement("select", { onChange: (e) => setOption(e.target.value) },
                    React.createElement("option", { value: "" }, "Selecciona aqu\u00ED"),
                    React.createElement("option", { value: "singleEquipment" }, "Un \u00FAnico equipo"),
                    React.createElement("option", { value: "areaEquipment" }, "Todos los equipos de un \u00E1rea"),
                    React.createElement("option", { value: "typeEquipment" }, "Todos los equipos de un tipo"),
                    React.createElement("option", { value: "allEquipment" }, "Todos los equipos del hospital"),
                    React.createElement("option", { value: "someEquipment" }, "Generar varios equipos")))),
        React.createElement("div", { className: "containerChoice" },
            option === "allEquipment" && (React.createElement("div", { className: "allEquipmentContainer" },
                React.createElement("h1", { className: "titleContainer" }, "Crear todos los equipos del hospital"),
                React.createElement("button", { className: "bottonDownload", onClick: generateAllQRCodes }, "GENERAR PDF Y DESCARGAR"),
                React.createElement("button", { className: "bottonDownload", onClick: () => generateCsv("allEquipment") }, "GENERAR CSV Y DESCARGAR"),
                isStarted ? (React.createElement("p", { className: "progressText" },
                    "Progreso: ",
                    currentQRIndex,
                    " de ",
                    data.length,
                    " QRS")) : null)),
            option === "typeEquipment" && (React.createElement("div", { className: "typeEquipmentContainer" },
                React.createElement("h1", { className: "titleContainer" }, "Crear todos los equipos de un tipo"),
                React.createElement("input", { type: "text", className: "searchInput", placeholder: selectedTipo === ""
                        ? "Buscar tipo"
                        : "Tipo seleccionado: " + selectedTipo, value: search, onChange: (e) => {
                        setSearch(e.target.value);
                        searchFilterFunction(e.target.value);
                    } }),
                React.createElement("div", { className: "divOptions" }, filteredTipos.map((tipo, index) => (React.createElement("button", { key: index, className: "option", onClick: () => {
                        setSelectedTipo(tipo);
                        setSearch("");
                        setFilteredTipos([]);
                    } }, tipo)))),
                selectedTipo === "" ? null : (React.createElement("div", null,
                    React.createElement("button", { onClick: generateTypeQRCodes, className: "bottonDownload" }, "GENERAR PDF Y DESCARGAR"),
                    React.createElement("button", { className: "bottonDownload", onClick: () => generateCsv("typeEquipment") }, "GENERAR CSV Y DESCARGAR"))),
                isStarted ? (React.createElement("p", { className: "progressText" },
                    "Progreso: ",
                    currentQRIndex,
                    " de ",
                    data.length,
                    " QRS")) : null)),
            option === "singleEquipment" && (React.createElement("div", { className: "singleEquipmentContainer" },
                React.createElement("h1", { className: "titleContainer" }, "Crear un \u00FAnico equipo"),
                React.createElement("input", { type: "text", value: search, onChange: (e) => {
                        setSearch(e.target.value);
                        searchFilterFunctionArea(e.target.value);
                    }, className: "searchInput", placeholder: selectedArea === ""
                        ? "Buscar área"
                        : "Área seleccionada: " + selectedArea }),
                React.createElement("div", { className: "divOptions" }, filteredAreas.map((area, index) => (React.createElement("button", { key: index, className: "option", onClick: () => {
                        setSelectedArea(area.nombre);
                        getEquipmentInArea(area.codigoIdentificacion);
                        setSearch("");
                        setFilteredAreas([]);
                    } }, area.nombre)))),
                isAreaGetted ? (React.createElement("input", { type: "text", value: searchEquipment, onChange: (e) => {
                        setSearchEquipment(e.target.value);
                        searchFilterFunctionEquipment(e.target.value);
                    }, className: "searchInput", placeholder: selectedEquipo === ""
                        ? "Escribe los ultimos 4 digitos del codigo del equipo"
                        : "Equipo seleccionado: " + selectedEquipo })) : null,
                React.createElement("div", { className: "divEquipos" }, filteredEquipos.map((equipo, index) => (React.createElement("div", { onClick: () => {
                        setSelectedEquipo(equipo.codigoIdentificacion);
                        setSearchEquipment("");
                        setFilteredEquipos([]);
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
                        React.createElement("p", null, equipo.area)))))),
                selectedEquipo !== "" ? (React.createElement("div", { className: "divButtons" },
                    React.createElement("button", { onClick: generateImage, className: "bottonDownload" }, "GENERAR IMAGEN Y DESCARGAR"),
                    React.createElement("button", { onClick: generateOneQRtoPdf, className: "bottonDownload" }, "GENERAR PDF Y DESCARGAR"),
                    React.createElement("button", { className: "bottonDownload", onClick: () => generateCsv("oneQr") }, "GENERAR CSV Y DESCARGAR"))) : null)),
            option === "areaEquipment" && (React.createElement("div", { className: "areaEquipmentContainer" },
                React.createElement("h1", { className: "titleContainer" }, "Crear todos los equipos de un \u00E1rea"),
                React.createElement("input", { type: "text", value: search, onChange: (e) => {
                        setSearch(e.target.value);
                        searchFilterFunctionArea(e.target.value);
                    }, className: "searchInput", placeholder: selectedArea === ""
                        ? "Buscar área"
                        : "Área seleccionada: " + selectedArea }),
                React.createElement("div", { className: "divOptions" }, filteredAreas.map((area, index) => (React.createElement("button", { key: index, className: "option", onClick: () => {
                        setSelectedArea(area.nombre);
                        setSelectedCodeArea(area.codigoIdentificacion);
                        setSearch("");
                        setFilteredAreas([]);
                    } }, area.nombre)))),
                selectedCodeArea === "" ? null : (React.createElement("div", null,
                    React.createElement("button", { onClick: () => {
                            generateQRSAreas();
                        }, className: "bottonDownload" }, "GENERAR PDF Y DESCARGAR"),
                    React.createElement("button", { className: "bottonDownload", onClick: () => generateCsv("equipmentArea") }, "GENERAR CSV Y DESCARGAR"))),
                isStarted ? (React.createElement("p", { className: "progressText" },
                    "Progreso: ",
                    currentQRIndex,
                    " de ",
                    data.length,
                    " QRS")) : null)),
            option === "someEquipment" ? (React.createElement("div", { className: "someEquipmentContainer" },
                React.createElement("h1", null, "Crear varios equipos "),
                React.createElement("input", { type: "text", value: search, onChange: (e) => {
                        setSearch(e.target.value);
                        searchFilterFunctionArea(e.target.value);
                    }, className: "searchInput", placeholder: selectedArea === ""
                        ? "Buscar área"
                        : "Área seleccionada: " + selectedArea }),
                React.createElement("div", { className: "divOptions" }, filteredAreas.map((area, index) => (React.createElement("button", { key: index, className: "option", onClick: () => {
                        setSelectedArea(area.nombre);
                        getEquipmentInArea(area.codigoIdentificacion);
                        setSearch("");
                        setFilteredAreas([]);
                    } }, area.nombre)))),
                isAreaGetted ? (React.createElement("input", { type: "text", value: searchEquipment, onChange: (e) => {
                        setSearchEquipment(e.target.value);
                        searchFilterFunctionEquipment(e.target.value);
                    }, className: "searchInput", placeholder: selectedEquipo === ""
                        ? "Escribe los ultimos 4 digitos del codigo del equipo"
                        : "Equipo seleccionado: " + selectedEquipo })) : null,
                React.createElement("div", { className: "someEquipmentOptions" }, data.map((equipo, index) => (React.createElement("div", { className: "optionSome" },
                    React.createElement("p", null, data[index]),
                    React.createElement("button", { className: "buttonDelete", onClick: () => handleDeleteSomeEquipment(equipo) },
                        React.createElement("img", { src: "https://img.icons8.com/ios-glyphs/30/000000/delete-sign.png", style: { width: "20px", height: "20px" } })))))),
                data.length > 0 ? (React.createElement("div", null,
                    React.createElement("button", { onClick: generateSomeQRCodes, className: "bottonDownload" }, "GENERAR PDF Y DESCARGAR"),
                    React.createElement("button", { className: "bottonDownload", onClick: () => generateCsv("someEquipment") }, "GENERAR CSV Y DESCARGAR"))) : null,
                isStarted ? (React.createElement("p", { className: "progressText" },
                    "Progreso: ",
                    currentQRIndex,
                    " de ",
                    data.length,
                    " QRS")) : null,
                React.createElement("div", { className: "divEquipos" }, filteredEquipos.map((equipo, index) => (React.createElement("div", { onClick: () => {
                        handleAddSomeEquipment(equipo.codigoIdentificacion);
                        setSearchEquipment("");
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
                        React.createElement("p", null, equipo.area)))))))) : null)));
};
export default QRSPage;
