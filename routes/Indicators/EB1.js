import React, { useEffect } from "react";
import useStore from "../../src/utils/useStore";
import url from "../../url.json";
import axios from "axios";
export default function EB1() {
    const [riesgoI, setRiesgoI] = React.useState(0);
    const [riesgoIIA, setRiesgoIIA] = React.useState(0);
    const [riesgoIIB, setRiesgoIIB] = React.useState(0);
    const [riesgoIII, setRiesgoIII] = React.useState(0);
    const [total, setTotal] = React.useState(0);
    const hospitalCode = useStore((state) => state.hospitalCode);
    useEffect(() => {
        getIndicator();
    }, []);
    const getIndicator = async () => {
        const response = await axios.get(`${url.url}/indicators/PALM/EB1`);
        if (response.status == 200) {
            setRiesgoI(response.data.riesgo_I);
            setRiesgoIIA(response.data.riesgo_IIA);
            setRiesgoIIB(response.data.riesgo_IIB);
            setRiesgoIII(response.data.riesgo_III);
            setTotal(response.data.total);
        }
    };
    return (React.createElement("div", { style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
        } },
        React.createElement("h1", { style: {
                fontSize: "24px",
                color: "#333",
                textAlign: "center",
                marginBottom: "20px",
            } }, "Indicador EB1"),
        React.createElement("p", { style: {
                fontSize: "20px",
                color: "#555",
                textAlign: "center",
                lineHeight: "1.6",
            } },
            React.createElement("span", { style: { fontWeight: "bold", color: "#333" } }, "Nombre del indicador:"),
            " ",
            "Cantidad de equipos en la instituci\u00F3n clasificado por riesgo"),
        React.createElement("p", { style: {
                fontSize: "20px",
                color: "#555",
                textAlign: "center",
                lineHeight: "1.6",
            } },
            React.createElement("span", { style: { fontWeight: "bold", color: "#333" } }, "Objetivo del indicador:"),
            " ",
            "Clasificar los equipos de las instituciones por la clasificaci\u00F3n de riesgo"),
        React.createElement("table", { style: {
                borderCollapse: "collapse",
                width: "80%",
                marginTop: "20px",
                backgroundColor: "#fff",
            } },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", { style: { border: "1px solid #333", padding: "8px" } }, "Riesgo"),
                    React.createElement("th", { style: { border: "1px solid #333", padding: "8px" } }, "Cantidad"))),
            React.createElement("tbody", null,
                React.createElement("tr", null,
                    React.createElement("td", { style: { border: "1px solid #333", padding: "8px" } }, "Riesgo I"),
                    React.createElement("td", { style: { border: "1px solid #333", padding: "8px" } }, riesgoI)),
                React.createElement("tr", null,
                    React.createElement("td", { style: { border: "1px solid #333", padding: "8px" } }, "Riesgo IIA"),
                    React.createElement("td", { style: { border: "1px solid #333", padding: "8px" } }, riesgoIIA)),
                React.createElement("tr", null,
                    React.createElement("td", { style: { border: "1px solid #333", padding: "8px" } }, "Riesgo IIB"),
                    React.createElement("td", { style: { border: "1px solid #333", padding: "8px" } }, riesgoIIB)),
                React.createElement("tr", null,
                    React.createElement("td", { style: { border: "1px solid #333", padding: "8px" } }, "Riesgo III"),
                    React.createElement("td", { style: { border: "1px solid #333", padding: "8px" } }, riesgoIII)),
                React.createElement("tr", null,
                    React.createElement("td", { style: {
                            border: "1px solid #333",
                            padding: "8px",
                            fontWeight: "bold",
                        } }, "Total de equipos clasificados"),
                    React.createElement("td", { style: {
                            border: "1px solid #333",
                            padding: "8px",
                            fontWeight: "bold",
                        } }, total))))));
}
