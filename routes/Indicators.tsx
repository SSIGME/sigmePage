import React, { useState } from "react";
import EB1 from "./Indicators/EB1";
import EB2 from "./Indicators/EB2";
import EB3 from "./Indicators/EB3";
import EB4 from "./Indicators/EB4";
import EB5 from "./Indicators/EB5";
import useStore from "../src/utils/useStore";
const Indicators = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>("");
  const hospitalCode = useStore((state) => state.hospitalCode);

  const renderComponent = () => {
    switch (selectedComponent) {
      case "EB1":
        return <EB1 />;
      case "EB2":
        return <EB2 />;
      case "EB3":
        return <EB3 />;
      case "EB4":
        return <EB4 />;
      case "EB5":
        return <EB5 />;
      default:
        return <></>;
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" ,marginTop:"3%"}}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Indicadores</h1>
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
            border: "1px solid #ccc",
            outline: "none",
            backgroundColor: "#505050",
            cursor: "pointer",
          }}
        >
          <option value="">
            Selecciona un indicador para mostrar las estadisticas
          </option>
          <option value="EB1">EB1</option>
          <option value="EB2">EB2</option>
          <option value="EB3">EB3</option>
          <option value="EB4">EB4</option>
          <option value="EB5">EB5</option>
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

export default Indicators;
