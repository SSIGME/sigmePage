import React, { useEffect } from "react";
import useStore from "../../src/utils/useStore";
import url from "../../url.json";
import axios from "axios";
const EB5 = () => {
  const [totalOrdenes, setTotalOrdenes] = React.useState(0);
  const [ordenedesNoResueltas, setOrdenesNoResueltas] = React.useState(0);
  const [ordenedesResueltas, setOrdenesResueltas] = React.useState(0);
  const [horasDisponibles, setHorasDisponibles] = React.useState(0);
  const [horasParadas, setHorasParadass] = React.useState(0);
  const [totalHorasDisponibles, setTotalHorasDisponibles] = React.useState(0);
  const [porcentajeDisponibilidad, setPorcentajeDisponibilidad] =
    React.useState(0);
  useEffect(() => {
    getIndicator();
  }, []);

  const getIndicator = async () => {
    const response = await axios.get(`${url.url}/indicators/PALM/EB5`);
    if (response.status === 200) {
      setTotalOrdenes(response.data.total_ordenes);
      setOrdenesResueltas(response.data.total_ordenes_resueltas);
      setOrdenesNoResueltas(response.data.total_ordenes_no_resueltas);
      setHorasDisponibles(response.data.total_horas_disponibles);
      setHorasParadass(response.data.total_horas_parada);
      setTotalHorasDisponibles(response.data.horas_disponibles_hoy);
      setPorcentajeDisponibilidad(response.data.porcentaje_disponibilidad);
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
      <h2
        style={{
          fontSize: "24px",
          color: "#333",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Indicador EB5
      </h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                textAlign: "center",
                backgroundColor: "#f4f4f4",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Total Órdenes
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
              Órdenes No Resueltas
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
              {ordenedesNoResueltas}
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
              Horas Disponibles
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
              {horasDisponibles}
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
              Horas Paradas
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
              {horasParadas}
            </td>
          </tr>
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
            Total Horas disponibles hasta hoy
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
            {totalHorasDisponibles}
          </td>
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
              Porcentaje de Disponibilidad
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
              {porcentajeDisponibilidad}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EB5;
