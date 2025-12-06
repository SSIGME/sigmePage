import React, { useState } from "react";
import QRGenerator from "./NuevoQr";
import QREditor from "./QRSPage";
import "./qrSelector.css";
const Dashboard = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    return (React.createElement(React.Fragment, null, !selectedOption ? (React.createElement("div", { className: "dashboard-container6" },
        React.createElement("h2", { className: "optioTitle" }, "Opciones de c\u00F3digos QR"),
        React.createElement("div", { className: "selection-screen6" },
            React.createElement("div", { className: "option-container6", onClick: () => setSelectedOption("generator") },
                React.createElement("div", { className: "option-content6" },
                    React.createElement("img", { src: "/src/assets/QrSelector.png", alt: "Editor de c\u00F3digo QR", className: "option-image6", style: { marginLeft: "7px" } }),
                    React.createElement("button", { className: "option-button6" }, "Editor de c\u00F3digos QR"))),
            React.createElement("div", { className: "option-container6", onClick: () => setSelectedOption("editor") },
                React.createElement("div", { className: "option-content6" },
                    React.createElement("img", { src: "/src/assets/scan_10210809.png", alt: "Generar QR de Equipos", className: "option-image6" }),
                    React.createElement("button", { className: "option-button6" }, "Generar QR de Equipos")))))) : selectedOption === "editor" ? (React.createElement(QREditor, { onBack: () => setSelectedOption(null) })) : (React.createElement(QRGenerator, { onBack: () => setSelectedOption(null) }))));
};
export default Dashboard;
