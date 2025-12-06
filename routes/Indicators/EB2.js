import React, { useEffect } from "react";
import url from "../../url.json";
import axios from "axios";
const EB2 = () => {
    const [balance, setBalance] = React.useState(0);
    const [costoMantenimiento, setCostoMantenimiento] = React.useState(0);
    const [presupuestoEquipoBiomedico, setPresupuestoEquipoBiomedico] = React.useState(0);
    useEffect(() => {
        getIndicator();
    }, []);
    const getIndicator = async () => {
        const response = await axios.get(`${url.url}/indicators/PALM/EB2`);
        if (response.status === 200) {
            setBalance(response.data.balance);
            setCostoMantenimiento(response.data.costoMantenimiento);
            setPresupuestoEquipoBiomedico(response.data.presupuestoEquipoBiomedico);
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
            } }, "Indicador EB2"),
        React.createElement("p", { style: {
                fontSize: "20px",
                color: "#555",
                textAlign: "center",
                lineHeight: "1.6",
                marginBottom: "20px",
            } },
            React.createElement("span", { style: { fontWeight: "bold", color: "#333" } }, "Nombre del indicador:"),
            " ",
            "Costo total de actividades de mantenimiento en el a\u00F1o"),
        React.createElement("p", { style: {
                fontSize: "20px",
                color: "#555",
                textAlign: "center",
                lineHeight: "1.6",
                marginBottom: "20px",
            } },
            React.createElement("span", { style: { fontWeight: "bold", color: "#333" } }, "Objetivo del indicador:"),
            " ",
            "Clasificaci\u00F3n de las instituciones por costos de mantenimiento"),
        React.createElement("table", { style: {
                width: "80%",
                borderCollapse: "collapse",
                marginTop: "20px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            } },
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
                            color: "#555",
                        } }, "Costo de Mantenimiento"),
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            color: "#555",
                        } },
                        "$ ",
                        costoMantenimiento.toLocaleString("en-US"))),
                React.createElement("tr", null,
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            color: "#555",
                        } }, "Presupuesto Equipo Biom\u00E9dico"),
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            color: "#555",
                        } },
                        "$ ",
                        presupuestoEquipoBiomedico.toLocaleString("en-US"))),
                React.createElement("tr", null,
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            color: "#555",
                        } }, "Balance"),
                    React.createElement("td", { style: {
                            border: "1px solid #ddd",
                            padding: "12px",
                            color: "#555",
                        } },
                        "$ ",
                        balance.toLocaleString("en-US")))))));
};
export default EB2;
