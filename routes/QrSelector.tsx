import React, { useState } from "react";
import QRGenerator from "./NuevoQr";
import QREditor from "./QRSPage";
import "./qrSelector.css";

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <>
      {!selectedOption ? (
        <div className="dashboard-container6">
          <h2 className="optioTitle">Opciones de códigos QR</h2>
          <div className="selection-screen6">
            <div
              className="option-container6"
              onClick={() => setSelectedOption("generator")}
            >
              <div className="option-content6">
                <img
                  src="/src/assets/QrSelector.png"
                  alt="Editor de código QR"
                  className="option-image6"
                  style={{marginLeft:"7px"}}
                />
                <button className="option-button6">Editor de códigos QR</button>
              </div>
            </div>
            <div
              className="option-container6"
              onClick={() => setSelectedOption("editor")}
            >
              <div className="option-content6">
                <img
                  src="/src/assets/scan_10210809.png"
                  alt="Generar QR de Equipos"
                  className="option-image6"
                />
                <button className="option-button6">Generar QR de Equipos</button>
              </div>
            </div>
          </div>
        </div>
      ) : selectedOption === "editor" ? (
        <QREditor onBack={() => setSelectedOption(null)} />
      ) : (
        <QRGenerator onBack={() => setSelectedOption(null)} />
      )}
    </>
  );
};

export default Dashboard;
