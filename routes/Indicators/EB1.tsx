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
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
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
        Indicador EB1
      </h1>

      <p
        style={{
          fontSize: "20px",
          color: "#555",
          textAlign: "center",
          lineHeight: "1.6",
        }}
      >
        <span style={{ fontWeight: "bold", color: "#333" }}>
          Nombre del indicador:
        </span>{" "}
        Cantidad de equipos en la institución clasificado por riesgo
      </p>
      <p
        style={{
          fontSize: "20px",
          color: "#555",
          textAlign: "center",
          lineHeight: "1.6",
        }}
      >
        <span style={{ fontWeight: "bold", color: "#333" }}>
          Objetivo del indicador:
        </span>{" "}
        Clasificar los equipos de las instituciones por la clasificación de
        riesgo
      </p>
      <table
        style={{
          borderCollapse: "collapse",
          width: "80%",
          marginTop: "20px",
          backgroundColor: "#fff",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #333", padding: "8px" }}>Riesgo</th>
            <th style={{ border: "1px solid #333", padding: "8px" }}>
              Cantidad
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Example rows, replace with dynamic data */}
          <tr>
            <td style={{ border: "1px solid #333", padding: "8px" }}>
              Riesgo I
            </td>
            <td style={{ border: "1px solid #333", padding: "8px" }}>
              {riesgoI}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #333", padding: "8px" }}>
              Riesgo IIA
            </td>
            <td style={{ border: "1px solid #333", padding: "8px" }}>
              {riesgoIIA}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #333", padding: "8px" }}>
              Riesgo IIB
            </td>
            <td style={{ border: "1px solid #333", padding: "8px" }}>
              {riesgoIIB}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #333", padding: "8px" }}>
              Riesgo III
            </td>
            <td style={{ border: "1px solid #333", padding: "8px" }}>
              {riesgoIII}
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid #333",
                padding: "8px",
                fontWeight: "bold",
              }}
            >
              Total de equipos clasificados
            </td>
            <td
              style={{
                border: "1px solid #333",
                padding: "8px",
                fontWeight: "bold",
              }}
            >
              {total}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
