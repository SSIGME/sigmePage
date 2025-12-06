import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import url from "../../url.json";
import useStore from "../../src/utils/useStore";
const OtherDocuments = () => {
    const { codigoIdentificacion } = useParams();
    const hospitalCode = useStore((state) => state.hospitalCode);
    const [isUploading, setIsUploading] = React.useState(false);
    //   const hospitalCode = useStore((state) => state.hospitalCode);
    const [documentos, setDocumentos] = React.useState([]);
    const getDocumentos = async () => {
        const response = await fetch(`${url.url}/documento/otros/${hospitalCode}/${codigoIdentificacion}`);
        if (response.ok) {
            const data = await response.json();
            const newDocumentos = data.map((documento) => {
                const nombre = documento.nombre;
                const enlace = documento.enlace;
                return { nombre, enlace };
            });
            setDocumentos(newDocumentos);
        }
        else if (response.status === 404) {
            console.warn("No documents found.");
            setDocumentos([]); // Clear the list if no documents are found
        }
        else {
            console.error("Error fetching documentos:", response.statusText);
        }
    };
    const deleteDocumento = async (documento) => {
        console.log("Deleting documento:", documento);
        const response = await fetch(`${url.url}/documento/otros/${hospitalCode}/${codigoIdentificacion}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(documento),
        });
        if (response.ok) {
            console.log("Documento deleted successfully");
            getDocumentos(); // Refresh the list after deletion
        }
        else {
            console.error("Error deleting documento:", response.statusText);
        }
    };
    const uploadDocumento = async () => {
        setIsUploading(true);
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "*/*";
        fileInput.onchange = async (event) => {
            const file = event.target.files?.[0];
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                try {
                    const response = await fetch(`${url.url}/documento/otros/${hospitalCode}/${codigoIdentificacion}`, {
                        method: "POST",
                        body: formData,
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Documento uploaded:", data);
                        getDocumentos(); // Refresh the list after upload
                        setIsUploading(false);
                    }
                    else {
                        console.error("Error uploading documento:", response.statusText);
                    }
                }
                catch (error) {
                    console.error("Error uploading documento:", error);
                }
            }
        };
        fileInput.click();
    };
    useEffect(() => {
        getDocumentos();
    }, []);
    return (React.createElement("div", { style: {
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "#f8f9fa",
            padding: "40px",
            fontFamily: "'Roboto', sans-serif",
        } },
        React.createElement("h1", { style: { color: "#343a40", marginBottom: "20px" } }, "Otros documentos del equipo"),
        React.createElement("p", { style: { color: "#6c757d", marginBottom: "30px" } }, "Aqu\u00ED puedes ver y subir documentos relacionados con el equipo."),
        React.createElement("div", { style: {
                width: "100%",
                maxWidth: "800px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
            } },
            React.createElement("table", { style: {
                    width: "100%",
                    borderCollapse: "collapse",
                } },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { style: {
                                padding: "15px",
                                backgroundColor: "#007bff",
                                color: "#ffffff",
                                textAlign: "left",
                                fontWeight: "bold",
                            } }, "Nombre del documento"),
                        React.createElement("th", { style: {
                                padding: "15px",
                                backgroundColor: "#007bff",
                                color: "#ffffff",
                                textAlign: "left",
                                fontWeight: "bold",
                            } }, "Enlace al documento"),
                        React.createElement("th", { style: {
                                padding: "15px",
                                backgroundColor: "#007bff",
                                color: "#ffffff",
                                textAlign: "left",
                                fontWeight: "bold",
                            } }, "Opciones"))),
                React.createElement("tbody", null, documentos.map((documento, index) => (React.createElement("tr", { key: index, style: {
                        backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#ffffff",
                    } },
                    React.createElement("td", { style: {
                            padding: "15px",
                            borderBottom: "1px solid #dee2e6",
                            color: "#495057",
                        } }, documento.nombre),
                    React.createElement("td", { style: {
                            padding: "15px",
                            borderBottom: "1px solid #dee2e6",
                        } },
                        React.createElement("a", { href: documento.enlace, target: "_blank", rel: "noopener noreferrer", style: {
                                color: "#007bff",
                                textDecoration: "none",
                                fontWeight: "bold",
                            } }, "Ir al documento")),
                    React.createElement("td", { style: {
                            padding: "15px",
                            borderBottom: "1px solid #dee2e6",
                        } },
                        React.createElement("div", { style: { display: "flex", gap: "10px" } },
                            React.createElement("button", { onClick: () => {
                                    const link = document.createElement("a");
                                    link.href = documento.enlace;
                                    link.download = documento.enlace;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }, style: {
                                    padding: "10px 15px",
                                    backgroundColor: "#28a745",
                                    color: "#ffffff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    transition: "background-color 0.3s",
                                }, onMouseOver: (e) => (e.currentTarget.style.backgroundColor = "#218838"), onMouseOut: (e) => (e.currentTarget.style.backgroundColor = "#28a745") }, "Descargar"),
                            React.createElement("button", { onClick: () => {
                                    if (window.confirm("¿Estás seguro de que deseas eliminar este documento?")) {
                                        deleteDocumento(documento);
                                    }
                                }, style: {
                                    padding: "10px 15px",
                                    backgroundColor: "#dc3545",
                                    color: "#ffffff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    transition: "background-color 0.3s",
                                }, onMouseOver: (e) => (e.currentTarget.style.backgroundColor = "#c82333"), onMouseOut: (e) => (e.currentTarget.style.backgroundColor = "#dc3545") }, "Eliminar documento"))))))))),
        React.createElement("button", { onClick: uploadDocumento, style: {
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "#ffffff",
                border: "none",
                borderRadius: "5px",
                cursor: isUploading ? "not-allowed" : "pointer",
                fontWeight: "bold",
                transition: "background-color 0.3s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
            }, onMouseOver: (e) => {
                if (!isUploading)
                    e.currentTarget.style.backgroundColor = "#0056b3";
            }, onMouseOut: (e) => {
                if (!isUploading)
                    e.currentTarget.style.backgroundColor = "#007bff";
            }, disabled: isUploading }, isUploading ? (React.createElement(React.Fragment, null,
            React.createElement("span", { style: {
                    width: "16px",
                    height: "16px",
                    border: "2px solid #ffffff",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                } }),
            "Cargando...")) : ("Subir nuevo documento")),
        React.createElement("style", null, `
        @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
        }
      `)));
};
export default OtherDocuments;
