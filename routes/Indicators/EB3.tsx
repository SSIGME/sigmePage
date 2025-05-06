import React, { useEffect } from "react";
import useStore from "../../src/utils/useStore";
import url from "../../url.json";
import axios from "axios";

const EB3 = () => {
  const [mantenimientosProgramados, setMantenimientosProgramados] =
    React.useState(0);
  const [mantenimientosRealizados, setMantenimientosRealizados] =
    React.useState(0);
  const [porcentajeCumplimiento, setPorcentajeCumplimiento] = React.useState(0);
  useEffect(() => {
    getIndicator();
  }, []);

  const getIndicator = async () => {
    const response = await axios.get(`${url.url}/indicators/PALM/EB3`);
    if (response.status === 200) {
      console.log(response.data);
      setMantenimientosProgramados(response.data.total_programados);
      setMantenimientosRealizados(response.data.total_realizados);
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
        Indicador EB3
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
        Porcentaje de cumplimiento de la programación de mantenimiento
      </p>

      <table
        style={{
          borderCollapse: "collapse",
          width: "80%",
          margin: "20px 0",
          textAlign: "center",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#f2f2f2",
                fontWeight: "bold",
              }}
            >
              Métrica
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#f2f2f2",
                fontWeight: "bold",
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
              Mantenimientos Programados
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
              {mantenimientosProgramados}
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
              Mantenimientos Realizados
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
              {mantenimientosRealizados}
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

      <p
        style={{
          fontSize: "16px",
          color: "#555",
          textAlign: "center",
          lineHeight: "1.6",
          marginTop: "20px",
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
        }}
      >
        El porcentaje de cumplimiento se calcula dividiendo el número de
        mantenimientos realizados entre los mantenimientos programados {"\n"}y
        multiplicando el resultado por 100.
      </p>
    </div>
  );
};

export default EB3;
