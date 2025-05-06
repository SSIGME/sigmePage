import React, { useEffect } from "react";
import useStore from "../../src/utils/useStore";
import url from "../../url.json";
import axios from "axios";

const EB2 = () => {
  const [balance, setBalance] = React.useState(0);
  const [costoMantenimiento, setCostoMantenimiento] = React.useState(0);
  const [presupuestoEquipoBiomedico, setPresupuestoEquipoBiomedico] =
    React.useState(0);

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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          color: "#333",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Indicador EB2
      </h1>

      <p
        style={{
          fontSize: "20px",
          color: "#555",
          textAlign: "center",
          lineHeight: "1.6",
          marginBottom: "20px",
        }}
      >
        <span style={{ fontWeight: "bold", color: "#333" }}>
          Nombre del indicador:
        </span>{" "}
        Costo total de actividades de mantenimiento en el año
      </p>
      <p
        style={{
          fontSize: "20px",
          color: "#555",
          textAlign: "center",
          lineHeight: "1.6",
          marginBottom: "20px",
        }}
      >
        <span style={{ fontWeight: "bold", color: "#333" }}>
          Objetivo del indicador:
        </span>{" "}
        Clasificación de las instituciones por costos de mantenimiento
      </p>

      <table
        style={{
          width: "80%",
          borderCollapse: "collapse",
          marginTop: "20px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "center",
                backgroundColor: "#f4f4f4",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Indicador
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "center",
                backgroundColor: "#f4f4f4",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Valor
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                color: "#555",
              }}
            >
              Costo de Mantenimiento
            </td>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                color: "#555",
              }}
            >
             $ {costoMantenimiento.toLocaleString("en-US")}
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                color: "#555",
              }}
            >
              Presupuesto Equipo Biomédico
            </td>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                color: "#555",
              }}
            >
               $ {presupuestoEquipoBiomedico.toLocaleString("en-US")}
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                color: "#555",
              }}
            >
              Balance
            </td>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                color: "#555",
              }}
            >
              $ {balance.toLocaleString("en-US")}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EB2;
