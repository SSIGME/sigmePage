import React, { useEffect } from "react";
import useStore from "../../src/utils/useStore";
import url from "../../url.json";
import axios from "axios";
const EB4 = () => {
  const [totalOrdenes, setTotalOrdenes] = React.useState(0);
  const [ordenedesResueltas, setOrdenesResueltas] = React.useState(0);
  const [porcentajeCumplimiento, setPorcentajeCumplimiento] = React.useState(0);
  useEffect(() => {
    getIndicator();
  }, []);

  const getIndicator = async () => {
    const response = await axios.get(`${url.url}/indicators/PALM/EB4`);
    if (response.status === 200) {
      console.log(response.data);
      setTotalOrdenes(response.data.total_ordenes_servicio);
      setOrdenesResueltas(response.data.ordenes_resueltas);
      setPorcentajeCumplimiento(response.data.porcentaje_cumplimiento);
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
        Indicador EB4
      </h1>

      <table
        style={{
          borderCollapse: "collapse",
          width: "80%",
          margin: "0 auto",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
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
              Métrica
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
                textAlign: "center",
                backgroundColor: "#f4f4f4",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Total de Órdenes
            </td>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "center",
                backgroundColor: "#f4f4f4",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              {totalOrdenes}
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "center",
                backgroundColor: "#f4f4f4",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Órdenes Resueltas
            </td>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "center",
                backgroundColor: "#f4f4f4",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              {ordenedesResueltas}
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "center",
                backgroundColor: "#f4f4f4",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Porcentaje de Cumplimiento
            </td>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "center",
                backgroundColor: "#f4f4f4",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              {porcentajeCumplimiento}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EB4;
