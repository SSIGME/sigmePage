import React, { useState } from "react";
import MantenimientosFecha from "./mantenimientosFecha";
import DocumentoMantenimientos from "./documentoMantenimientos";
import useStore from "../../src/utils/useStore";
const Reports = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>("");
  const hospitalCode = useStore((state) => state.hospitalCode);

  const renderComponent = () => {
    switch (selectedComponent) {
      case "matenimientosFecha":
        return <MantenimientosFecha />;
      case "documentoMantenimientos":
        return <DocumentoMantenimientos />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        marginTop: "3%",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333" }}>Generar Reportes</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <select
          value={selectedComponent}
          onChange={(e) => setSelectedComponent(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            marginBottom: "20px",
            border: "1px solid #ccc",
            outline: "none",
            backgroundColor: "#ffffff",
            cursor: "pointer",
          }}
        >
          <option value="">Selecciona el tipo de reporte a generar</option>
          <option value="matenimientosFecha">
            Mantenimientos preventivos por fecha
          </option>
          <option value="documentoMantenimientos">
            Reporte de correctivos por fecha
          </option>
        </select>
      </div>
      <div
        style={{
          textAlign: "center",
          marginTop: "-12%",
        }}
      >
        {renderComponent()}
      </div>
    </div>
  );
};

export default Reports;
