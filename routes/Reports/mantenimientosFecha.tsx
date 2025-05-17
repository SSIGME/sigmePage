import React, { useState } from "react";
import url from "../../url.json";
import axios from "axios";
import useStore from "../../src/utils/useStore";
const MantenimientosFecha = () => {
  const hospitalCode = useStore((state) => state.hospitalCode);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [preventivo, setPreventivo] = useState("");
  const [correctivo, setCorrectivo] = useState("");
  const genenerarReporte = async () => {
    const response = await axios.get(
      `${url.url}/reports/${hospitalCode}/mantenimientosFecha`,
      {
        params: {
          fechaInicio: startDate,
          fechaFin: endDate,
        },
      }
    );
    if (response.status === 200) {
      const data = response.data;

      // Prepare data for CSV
      const headers = [
        "ID Mantenimiento",
        "Codigo Equipo",
        "Tipo",
        "Marca",
        "Modelo",
        "Serie",
        "Ubicacion",
        "Fecha",
        "Tipo Mantenimiento",
        "Tecnico / Ingeniero",
        "Duracion",
        "Observaciones",
        "Hallazgos",
      ];

      const rows = data.map((item: any) => [
        item.idMantenimiento,
        item.codigoEquipo,
        item.tipo,
        item.marca,
        item.modelo,
        item.serie,
        item.ubicacion,
        item.fecha,
        item.tipoMantenimiento,
        item.tecnico,
        item.duracion,
        item.observaciones,
        item.hallazgos,
      ]);

      const csvContent = [headers, ...rows]
        .map((row) =>
          row
            .map((cell) => `"${String(cell).replace(/"/g, '""')}"`) // Escapa comillas
            .join(",")
        )
        .join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Reporte_Mantenimientos.csv"; // .csv aquí

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    console.log(response.data);
  };
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handlePreventivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreventivo(e.target.value);
  };

  const handleCorrectivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCorrectivo(e.target.value);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "36%",
        width: "90%",
        height: "50%",
        justifyContent: "center",
        flexDirection: "column",
        display: "flex",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h1
        style={{
          position: "absolute",
          textAlign: "center",
          top: "10%",
          color: "#333",
          marginBottom: "20px",
          fontSize: "24px",
        }}
      >
        Seleccione la fecha para generar el reporte de mantenimientos
      </h1>
      <label style={{ marginBottom: "10px", fontSize: "16px", color: "#333" }}>
        Fecha de inicio:
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          style={{
            color: "#333",
            marginLeft: "10px",
            padding: "5px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
            backgroundColor: "#e4e4e4",
          }}
        />
      </label>
      <label style={{ marginBottom: "10px", fontSize: "16px", color: "#333" }}>
        Fecha de fin:
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          style={{
            color: "#333",

            marginLeft: "10px",
            padding: "5px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
            backgroundColor: "#e4e4e4",
          }}
        />
      </label>
      <label style={{ marginBottom: "10px", fontSize: "16px", color: "#333" }}>
        Valor Preventivo:
        <input
          type="number"
          value={preventivo}
          onChange={handlePreventivoChange}
          style={{
            color: "#333",

            marginLeft: "10px",
            padding: "5px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
            backgroundColor: "#e4e4e4",
          }}
        />
      </label>
      <label style={{ marginBottom: "10px", fontSize: "16px", color: "#333" }}>
        Valor Correctivo:
        <input
          type="number"
          value={correctivo}
          onChange={handleCorrectivoChange}
          style={{
            color: "#333",

            marginLeft: "10px",
            padding: "5px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
            backgroundColor: "#e4e4e4",
          }}
        />
      </label>
      <button
        style={{
          padding: "10px 20px",
          position: "absolute",
          top: "80%",
          fontSize: "16px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#005bbd",
          cursor: "pointer",
        }}
        onClick={() => {
          genenerarReporte();
        }}
      >
        Generar Reporte
      </button>
    </div>
  );
};

export default MantenimientosFecha;
