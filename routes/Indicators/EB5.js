import React, { useEffect } from "react";
import url from "../../url.json";
import axios from "axios";
const EB5 = () => {
    const [totalOrdenes, setTotalOrdenes] = React.useState(0);
    const [ordenedesNoResueltas, setOrdenesNoResueltas] = React.useState(0);
    const [ordenedesResueltas, setOrdenesResueltas] = React.useState(0);
    const [horasDisponibles, setHorasDisponibles] = React.useState(0);
    const [horasParadas, setHorasParadass] = React.useState(0);
    const [totalHorasDisponibles, setTotalHorasDisponibles] = React.useState(0);
    const [porcentajeDisponibilidad, setPorcentajeDisponibilidad] = React.useState(0);
    useEffect(() => {
        getIndicator();
    }, []);
    const getIndicator = async () => {
        const response = await axios.get(`${url.url}/indicators/PALM/EB5`);
        if (response.status === 200) {
            setTotalOrdenes(response.data.total_ordenes);
            setOrdenesResueltas(response.data.total_ordenes_resueltas);
            setOrdenesNoResueltas(response.data.total_ordenes_no_resueltas);
            setHorasDisponibles(response.data.total_horas_disponibles);
            setHorasParadass(response.data.total_horas_parada);
            setTotalHorasDisponibles(response.data.horas_disponibles_hoy);
            setPorcentajeDisponibilidad(response.data.porcentaje_disponibilidad);
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
        React.createElement("h2", { style: {
                fontSize: "24px",
                color: "#333",
                textAlign: "center",
                marginBottom: "20px",
            } }, "Indicador EB5"),
        React.createElement("table", { style: { width: "100%", borderCollapse: "collapse" } },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
                        } }, "Indicador"),
                    React.createElement("th", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
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
                        } }, "Total \u00D3rdenes"),
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
                        } }, totalOrdenes)),
                React.createElement("tr", null,
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
                        } }, "\u00D3rdenes Resueltas"),
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
                        } }, ordenedesResueltas)),
                React.createElement("tr", null,
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
                        } }, "\u00D3rdenes No Resueltas"),
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
                        } }, ordenedesNoResueltas)),
                React.createElement("tr", null,
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
                        } }, "Horas Disponibles"),
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
                        } }, horasDisponibles)),
                React.createElement("tr", null,
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
                        } }, "Horas Paradas"),
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
                        } }, horasParadas)),
                React.createElement("td", { style: {
                        border: "1px solid #ddd",
                        padding: "12px",
                        textAlign: "center",
                        backgroundColor: "#f4f4f4",
                        fontWeight: "bold",
                        color: "#333",
                    } }, "Total Horas disponibles hasta hoy"),
                React.createElement("td", { style: {
                        border: "1px solid #ddd",
                        padding: "12px",
                        textAlign: "center",
                        backgroundColor: "#f4f4f4",
                        fontWeight: "bold",
                        color: "#333",
                    } }, totalHorasDisponibles),
                React.createElement("tr", null,
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
                        } }, "Porcentaje de Disponibilidad"),
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            textAlign: "center",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            color: "#333",
                        } },
                        porcentajeDisponibilidad,
                        "%"))))));
};
export default EB5;
