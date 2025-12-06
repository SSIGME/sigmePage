import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./EquipoDetail.css";
import React from "react";
import url from "../url.json";
import useStore from "../src/utils/useStore";
import { useNavigate } from "react-router-dom";
const EquipoDetail = () => {
    const navigate = useNavigate();
    const hospitalCode = useStore((state) => state.hospitalCode);
    const { codigoIdentificacion } = useParams();
    const [isEquipoGetted, setIsEquipoGetted] = useState(false);
    const [documents, setDocuments] = useState({
        manual: false,
        protocolo: false,
        certificado: false,
        guia: false,
        planmantenimiento: false,
        imagen: false,
    });
    const [equipo, setEquipo] = useState({
        area: "",
        Imagen: "",
        codigoIdentificacion: "",
        Tipo: "",
        Marca: "",
        Modelo: "",
        Serie: "",
    });
    const uploadImage = async (codigoIdentificacion) => {
        console.log("Botón presionado, abriendo seleccionador de archivos...");
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (event) => {
            const file = event.target.files?.[0];
            if (!file)
                return;
            console.log("Archivo seleccionado:", file.name);
            const formData = new FormData();
            formData.append("file", file, file.name);
            try {
                const response = await axios.post(`${url.url}/upload_image/${hospitalCode}/${codigoIdentificacion}`, formData);
                console.log("Respuesta:", response);
                if (response.status === 200) {
                    console.log("Imagen subida correctamente:", response.data);
                }
            }
            catch (error) {
                console.error("Error subiendo imagen:", error);
            }
            finally {
                getEquipo(codigoIdentificacion);
                checkDocuments(codigoIdentificacion);
            }
        };
        input.click();
    };
    const pickDocument = (filename) => {
        console.log("Botón presionado, abriendo seleccionador de archivos...");
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/pdf";
        input.onchange = async (event) => {
            const file = event.target.files?.[0];
            if (!file)
                return;
            console.log("Archivo seleccionado:", file.name);
            const formData = new FormData();
            formData.append("file", file, filename);
            try {
                const response = await axios.post(`${url.url}/upload_pdf/${hospitalCode}/${codigoIdentificacion}`, formData);
                console.log("Respuesta:", response);
                if (response.status === 200) {
                    console.log("Documento subido correctamente:", response.data);
                }
            }
            catch (error) {
                console.error("Error subiendo documento:", error);
            }
            finally {
                checkDocuments(codigoIdentificacion);
            }
        };
        input.click();
    };
    const uploadDocument = async (codigoIdentificacion) => {
        try {
            const response = await axios.post(`${url.url}/upload_pdf/${hospitalCode}/${codigoIdentificacion}`);
            if (response.status === 200) {
                setDocuments(response.data);
                console.log("Documentos:", response.data); // Verifica la respuesta
            }
        }
        catch (error) {
            console.error("Error obteniendo equipo:", error);
        }
    };
    const checkDocuments = async (codigoIdentificacion) => {
        try {
            const response = await axios.get(`${url.url}/equipoDocuments/${hospitalCode}/${codigoIdentificacion}`);
            if (response.status === 200) {
                setDocuments(response.data);
                console.log("Documentos:", response.data); // Verifica la respuesta
            }
        }
        catch (error) {
            console.error("Error obteniendo equipo:", error);
        }
    };
    const getEquipo = async (codigoIdentificacion) => {
        try {
            const response = await axios.get(`${url.url}/equipo/${hospitalCode}/${codigoIdentificacion}`);
            if (response.status === 200) {
                setIsEquipoGetted(true);
                setEquipo(response.data);
                console.log("Equipo:", response.data.Imagen); // Verifica la respuesta
            }
        }
        catch (error) {
            console.error("Error obteniendo equipo:", error);
        }
    };
    useEffect(() => {
        getEquipo(codigoIdentificacion);
        checkDocuments(codigoIdentificacion);
    }, [codigoIdentificacion]);
    return (React.createElement("div", { className: "container", style: { height: "100vh" } },
        React.createElement("h1", { style: { color: "black" } }, "Detalles del equipo"),
        React.createElement("div", { className: "divEquipoo", style: {
                flexDirection: "row",
                backgroundColor: "#fff",
                padding: 10,
                maxHeight: "80vh",
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            } },
            React.createElement("div", { style: {
                    flexDirection: "column",
                    backgroundColor: "#fff",
                    padding: 20,
                    width: "90%",
                    height: "100%",
                    display: "flex",
                    borderRadius: 10,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                } },
                React.createElement("div", { className: "divImagen" }, documents.imagen ? (React.createElement("div", { style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "50%",
                        marginRight: "0%",
                        height: "100%",
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "10px",
                    } },
                    React.createElement("img", { src: equipo.Imagen, className: "Imagen" }),
                    React.createElement("button", { onClick: () => {
                            uploadImage(codigoIdentificacion);
                        }, className: "buttonPickImage" },
                        React.createElement("img", { className: "imagenPickImage", src: "https://img.icons8.com/ios-filled/50/FFFFFF/edit--v1.png" })))) : (React.createElement("button", { onClick: () => {
                        uploadImage(codigoIdentificacion);
                    }, className: "button" },
                    React.createElement("img", { className: "imageButton", src: "https://img.icons8.com/ios-filled/50/FFFFFF/upload--v1.png" })))),
                React.createElement("div", { className: "divInfoo" },
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
                        React.createElement("p", null, equipo.area)))),
            React.createElement("div", { className: "divButtons" },
                React.createElement("div", { className: "divButton" },
                    React.createElement("button", { onClick: () => {
                            pickDocument("Manual_de_uso.pdf");
                        }, className: "button" }, documents.manual ? (React.createElement("img", { className: "imageButton", src: "https://img.icons8.com/ios-filled/50/FFFFFF/edit--v1.png" })) : (React.createElement("img", { className: "imageButton", src: "https://img.icons8.com/ios/50/FFFFFF/upload--v1.png" }))),
                    React.createElement("p", null, "Manual de uso")),
                React.createElement("div", { className: "divButton" },
                    React.createElement("button", { className: "button", onClick: () => {
                            pickDocument("Protocolo_de_limpieza_y_desinfeccion.pdf");
                        } }, documents.protocolo ? (React.createElement("img", { className: "imageButton", src: "https://img.icons8.com/ios-filled/50/FFFFFF/edit--v1.png" })) : (React.createElement("img", { className: "imageButton", src: "https://img.icons8.com/ios/50/FFFFFF/upload--v1.png" }))),
                    React.createElement("p", null, "Protocolo de limpieza")),
                React.createElement("div", { className: "divButton" },
                    React.createElement("button", { className: "button", onClick: () => {
                            pickDocument("Certificado_de_calibracion.pdf");
                        } }, documents.certificado ? (React.createElement("img", { className: "imageButton", src: "https://img.icons8.com/ios-filled/50/FFFFFF/edit--v1.png" })) : (React.createElement("img", { className: "imageButton", src: "https://img.icons8.com/ios/50/FFFFFF/upload--v1.png" }))),
                    React.createElement("p", null, "Certificado de calibracion")),
                React.createElement("div", { className: "divButton" },
                    React.createElement("button", { className: "button", onClick: () => {
                            pickDocument("Guia_Rapida.pdf");
                        } }, documents.guia ? (React.createElement("img", { className: "imageButton", src: "https://img.icons8.com/ios-filled/50/FFFFFF/edit--v1.png" })) : (React.createElement("img", { className: "imageButton", src: "https://img.icons8.com/ios/50/FFFFFF/upload--v1.png" }))),
                    React.createElement("p", null, "Guia Rapida")),
                React.createElement("div", { className: "divButton" },
                    React.createElement("button", { className: "button", onClick: () => {
                            pickDocument("Plan_de_mantenimiento.pdf");
                        } }, documents.planmantenimiento ? (React.createElement("img", { className: "imageButton", src: "https://img.icons8.com/ios-filled/50/FFFFFF/edit--v1.png" })) : (React.createElement("img", { className: "imageButton", src: "https://img.icons8.com/ios/50/FFFFFF/upload--v1.png" }))),
                    React.createElement("p", null, "Plan de mantenimiento")),
                React.createElement("div", { className: "divButton" },
                    React.createElement("button", { className: "button", onClick: () => {
                            navigate(`/Documents/${codigoIdentificacion}`);
                        } },
                        React.createElement("img", { className: "imageButton", src: "https://img.icons8.com/ios-filled/50/FFFFFF/edit--v1.png" })),
                    React.createElement("p", null, "Otros documentos"))),
            React.createElement("button", { className: "modern-button", onClick: () => navigate(`/hojavida/${equipo.codigoIdentificacion}`) }, "Editar par\u00E1metros t\u00E9cnicos"))));
};
export default EquipoDetail;
