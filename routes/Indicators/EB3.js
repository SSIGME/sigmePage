import React, { useEffect } from "react";
import url from "../../url.json";
import axios from "axios";
const EB3 = () => {
    const [mantenimientosProgramados, setMantenimientosProgramados] = React.useState(0);
    const [mantenimientosRealizados, setMantenimientosRealizados] = React.useState(0);
    const [porcentajeCumplimiento, setPorcentajeCumplimiento] = React.useState(0);
    useEffect(() => {
        getIndicator();
    }, []);
    const getIndicator = async () => {
        const response = await axios.get(`${url.url}/indicators/PALM/EB3`);
        if (response.status === 200) {
            console.log(response.data);
            setMantenimientosProgramados(response.data.total_programados);
            setMantenimientosRealizados(response.data.total_realizados);
            setPorcentajeCumplimiento(response.data.porcentaje_cumplimiento);
        }
    };
    return (React.createElement("div", { style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            padding: "20px",
        } },
        React.createElement("h1", { style: {
                fontSize: "24px",
                color: "#333",
                textAlign: "center",
                marginBottom: "20px",
            } }, "Indicador EB3"),
        React.createElement("p", { style: {
                fontSize: "20px",
                color: "#555",
                textAlign: "center",
                lineHeight: "1.6",
                marginBottom: "20px",
            } },
            React.createElement("span", { style: { fontWeight: "bold", color: "#333" } }, "Nombre del indicador:"),
            " ",
            "Porcentaje de cumplimiento de la programaci\u00F3n de mantenimiento"),
        React.createElement("table", { style: {
                borderCollapse: "collapse",
                width: "80%",
                margin: "20px 0",
                textAlign: "center",
            } },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", { style: {
                            border: "1px solid #ddd",
                            padding: "8px",
                            backgroundColor: "#f2f2f2",
                            fontWeight: "bold",
                        } }, "M\u00E9trica"),
                    React.createElement("th", { style: {
                            border: "1px solid #ddd",
                            padding: "8px",
                            backgroundColor: "#f2f2f2",
                            fontWeight: "bold",
                        } }, "Valor"))),
            React.createElement("tbody", null,
                React.createElement("tr", null,
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
                        } }, "Mantenimientos Programados"),
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
                        } }, mantenimientosProgramados)),
                React.createElement("tr", null,
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
                        } }, "Mantenimientos Realizados"),
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
                        } }, mantenimientosRealizados)),
                React.createElement("tr", null,
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
                        } }, "Porcentaje de Cumplimiento"),
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
                        } },
                        porcentajeCumplimiento,
                        "%")))),
        React.createElement("p", { style: {
                fontSize: "16px",
                color: "#555",
                textAlign: "center",
                lineHeight: "1.6",
                marginTop: "20px",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
            } },
            "El porcentaje de cumplimiento se calcula dividiendo el n\u00FAmero de mantenimientos realizados entre los mantenimientos programados ",
            "\n",
            "y multiplicando el resultado por 100.")));
};
export default EB3;
