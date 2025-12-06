import React, { useEffect, useState, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import "./nuevoQr.css";
import logo from "../src/assets/logo.png";
const Dashboard = () => {
    const [url, setUrl] = useState("AE3RH2D4HG7D");
    const [fileExt, setFileExt] = useState("png");
    const [dotType, setDotType] = useState("dots");
    const [cornerType, setCornerType] = useState("square");
    const [cornerDotType, setCornerDotType] = useState("dot");
    const [dotColor, setDotColor] = useState("#00040f");
    const [cornerColor, setCornerColor] = useState("#000000");
    const [cornerDotColor, setCornerDotColor] = useState("#000000");
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const ref = useRef(null);
    const qrCodeRef = useRef(null);
    useEffect(() => {
        qrCodeRef.current = new QRCodeStyling({
            width: 250,
            height: 250,
            margin: 4,
            image: logo,
            dotsOptions: {
                color: dotColor,
                type: dotType,
            },
            cornersSquareOptions: {
                type: cornerType,
                color: cornerColor,
            },
            cornersDotOptions: {
                type: cornerDotType,
                color: cornerDotColor,
            },
            backgroundOptions: {
                color: backgroundColor,
            },
            imageOptions: {
                imageSize: 0.3,
                margin: 0,
            },
            qrOptions: {
                errorCorrectionLevel: "H",
                typeNumber: 4,
            },
        });
        qrCodeRef.current.append(ref.current);
    }, []);
    useEffect(() => {
        qrCodeRef.current.update({
            data: url,
            dotsOptions: {
                color: dotColor,
                type: dotType,
            },
            cornersSquareOptions: {
                type: cornerType,
                color: cornerColor,
            },
            cornersDotOptions: {
                type: cornerDotType,
                color: cornerDotColor,
            },
            backgroundOptions: {
                color: backgroundColor,
            },
        });
    }, [url, dotColor, dotType, cornerType, cornerColor, cornerDotType, cornerDotColor, backgroundColor]);
    const onDownloadClick = () => {
        const fileName = url; // Cambia esto al nombre deseado
        qrCodeRef.current.download({ extension: fileExt, name: fileName });
    };
    return (React.createElement("div", { className: "containerDashboard" },
        React.createElement("div", { className: "background" }),
        React.createElement("div", { className: "containerContent" },
            React.createElement("div", { className: "clienteDetailContainer2" },
                React.createElement("div", { className: "modernForm" },
                    React.createElement("div", { className: "formRow" },
                        React.createElement("label", null,
                            "URL: ",
                            React.createElement("br", null)),
                        React.createElement("input", { value: url, onChange: (e) => setUrl(e.target.value), className: "inputBox" })),
                    React.createElement("div", { className: "formRow" },
                        React.createElement("label", { style: { width: "100%", marginBottom: "7px" } }, "Formato:"),
                        React.createElement("select", { onChange: (e) => setFileExt(e.target.value), value: fileExt, className: "selectBox" },
                            React.createElement("option", { value: "png" }, "PNG"),
                            React.createElement("option", { value: "jpeg" }, "JPEG"),
                            React.createElement("option", { value: "webp" }, "WEBP"))),
                    React.createElement("div", { className: "formRow" },
                        React.createElement("label", { style: { width: "100%", marginBottom: "7px" } }, "Dot Type:"),
                        React.createElement("select", { onChange: (e) => setDotType(e.target.value), value: dotType, className: "selectBox" },
                            React.createElement("option", { value: "dots" }, "Dots"),
                            React.createElement("option", { value: "rounded" }, "Rounded"),
                            React.createElement("option", { value: "classy" }, "Classy"),
                            React.createElement("option", { value: "classy-rounded" }, "Classy Rounded"))),
                    React.createElement("div", { style: { display: 'flex' } },
                        React.createElement("div", { className: "formRow" },
                            React.createElement("label", { style: { width: "100%", marginBottom: "7px" } }, "Dot Color:"),
                            React.createElement("input", { type: "color", value: dotColor, onChange: (e) => setDotColor(e.target.value), className: "colorPicker" })),
                        React.createElement("div", { className: "formRow" },
                            React.createElement("label", { style: { width: "100%", marginBottom: "7px" } }, "Corner Color:"),
                            React.createElement("input", { type: "color", value: cornerColor, onChange: (e) => setCornerColor(e.target.value), className: "colorPicker" }))),
                    React.createElement("div", { className: "formRow" },
                        React.createElement("label", { style: { width: "100%", marginBottom: "7px" } }, "Corner Type:"),
                        React.createElement("select", { onChange: (e) => setCornerType(e.target.value), value: cornerType, className: "selectBox" },
                            React.createElement("option", { value: "square" }, "Square"),
                            React.createElement("option", { value: "dot" }, "Dot"),
                            React.createElement("option", { value: "extra-rounded" }, "Extra Rounded"))),
                    React.createElement("div", { style: { display: 'flex' } },
                        "     ",
                        React.createElement("div", { className: "formRow" },
                            React.createElement("label", { style: { width: "100%", marginBottom: "7px" } }, "Corner Dot Color:"),
                            React.createElement("input", { type: "color", value: cornerDotColor, onChange: (e) => setCornerDotColor(e.target.value), className: "colorPicker" })),
                        React.createElement("div", { className: "formRow" },
                            React.createElement("label", { style: { width: "100%", marginBottom: "7px" } }, "Background Color:"),
                            React.createElement("input", { type: "color", value: backgroundColor, onChange: (e) => setBackgroundColor(e.target.value), className: "colorPicker" }))),
                    React.createElement("div", { className: "formRow" },
                        React.createElement("label", { style: { width: "100%", marginBottom: "7px" } }, "Corner Dot Type:"),
                        React.createElement("select", { onChange: (e) => setCornerDotType(e.target.value), value: cornerDotType, className: "selectBox" },
                            React.createElement("option", { value: "dot" }, "Dot"),
                            React.createElement("option", { value: "square" }, "Square"))),
                    React.createElement("button", { onClick: onDownloadClick, className: "downloadButton" }, "Descargar")),
                React.createElement("div", { className: "qr", ref: ref })))));
};
export default Dashboard;
