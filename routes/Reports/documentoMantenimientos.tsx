
import React, { useState } from "react";
import axios from "axios";
import url from "../../url.json";
import useStore from "../../src/utils/useStore";

const MantenimientosFecha = () => {
  const hospitalCode = useStore((state) => state.hospitalCode);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("todos");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateReport = async () => {
    setError("");
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        inicio: startDate,
        fin: endDate,
      });

      const apiUrl = `${url.url}/api/reporte/consolidado/${hospitalCode}/${maintenanceType}?${params.toString()}`;

      console.log(`Requesting PDF report from: ${apiUrl}`);

      const response = await axios.get(apiUrl, {
        responseType: "blob",
      });

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(pdfBlob);
      link.setAttribute("download", `reporte_consolidado_${hospitalCode}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error fetching PDF report:", err);
      if (err.response && err.response.status === 404) {
        setError(`No se encontraron datos de mantenimiento para el hospital '${hospitalCode}'.`);
      } else {
        setError("No se pudo generar el reporte. Verifique la conexión con el servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .report-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
          padding: 1rem;
          font-family: sans-serif;
        }
        .report-card {
          width: 100%;
          max-width: 56rem;
          margin: auto;
          background-color: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }
        .report-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .report-title {
          font-size: 1.875rem;
          font-weight: bold;
          color: #1f2937;
        }
        .report-subtitle {
          color: #6b7280;
          margin-top: 0.5rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
        }
        .form-input, .form-select {
          width: 100%;
          padding: 0.5rem 0.75rem;
          color: #374151;
          background-color: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          transition: all 0.2s ease-in-out;
          outline: none;
        }
        .form-input:focus, .form-select:focus {
          box-shadow: 0 0 0 2px #3b82f6;
          border-color: #3b82f6;
        }
        .error-message {
          text-align: center;
          background-color: #fee2e2;
          border: 1px solid #f87171;
          color: #b91c1c;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .button-container {
          text-align: center;
        }
        .action-button {
          padding: 0.75rem 2rem;
          color: white;
          font-weight: bold;
          background-color: #2563eb;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .action-button:hover {
          background-color: #1d4ed8;
        }
        .action-button:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }
        .loading-spinner {
          animation: spin 1s linear infinite;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          margin-right: 0.75rem;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (min-width: 768px) {
          .form-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .action-button {
            width: auto;
          }
        }
      `}</style>
      <div className="report-container">
        <div className="report-card">
          <div className="report-header">
            <h1 className="report-title">Reporte de Mantenimientos</h1>
            <p className="report-subtitle">
              Haga clic en el botón para generar un reporte consolidado de todos los equipos.
            </p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="start-date">Fecha de Inicio</label>
              <input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="end-date">Fecha de Fin</label>
              <input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="maintenance-type">Tipo de Mantenimiento</label>
              <select id="maintenance-type" value={maintenanceType} onChange={(e) => setMaintenanceType(e.target.value)} className="form-select" >
                <option value="todos">Preventivos y Correctivos</option>
                <option value="preventivo">Solo Preventivos</option>
                <option value="correctivo">Solo Correctivos</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}

          <div className="button-container">
            <button onClick={generateReport} disabled={isLoading || !startDate || !endDate} className="action-button">
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Generando...</span>
                </>
              ) : (
                'Generar Reporte Consolidado'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MantenimientosFecha;
