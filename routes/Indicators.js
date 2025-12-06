import React, { useState } from "react";
import EB1 from "./Indicators/EB1";
import EB2 from "./Indicators/EB2";
import EB3 from "./Indicators/EB3";
import EB4 from "./Indicators/EB4";
import EB5 from "./Indicators/EB5";
import useStore from "../src/utils/useStore";
const Indicators = () => {
    const [selectedComponent, setSelectedComponent] = useState("");
    const hospitalCode = useStore((state) => state.hospitalCode);
    const renderComponent = () => {
        switch (selectedComponent) {
            case "EB1":
                return React.createElement(EB1, null);
            case "EB2":
                return React.createElement(EB2, null);
            case "EB3":
                return React.createElement(EB3, null);
            case "EB4":
                return React.createElement(EB4, null);
            case "EB5":
                return React.createElement(EB5, null);
            default:
                return React.createElement(React.Fragment, null);
        }
    };
    return (React.createElement("div", { style: { fontFamily: "Arial, sans-serif", padding: "20px", marginTop: "3%" } },
        React.createElement("h1", { style: { textAlign: "center", color: "#333" } }, "Indicadores"),
        React.createElement("div", { style: {
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
            } },
            React.createElement("select", { value: selectedComponent, onChange: (e) => setSelectedComponent(e.target.value), style: {
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    outline: "none",
                    backgroundColor: "#505050",
                    cursor: "pointer",
                } },
                React.createElement("option", { value: "" }, "Selecciona un indicador para mostrar las estadisticas"),
                React.createElement("option", { value: "EB1" }, "EB1"),
                React.createElement("option", { value: "EB2" }, "EB2"),
                React.createElement("option", { value: "EB3" }, "EB3"),
                React.createElement("option", { value: "EB4" }, "EB4"),
                React.createElement("option", { value: "EB5" }, "EB5"))),
        React.createElement("div", { style: {
                textAlign: "center",
                marginTop: "-12%",
            } }, renderComponent())));
};
export default Indicators;
