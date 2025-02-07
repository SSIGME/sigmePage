import React, { useState } from 'react';
import CrearAdministrador from "../routes/NuevoAdministrador";
import "./nuevoAdminstrador.css";
import MapSelector from "./MapSelector";

interface Coordinates {
  lat: number;
  lng: number;
}

interface HospitalData {
  // Define aquí las propiedades existentes de hospitalData
  nombre?: string;
  direccion?: string;
  // etc.
}

interface AddHospitalProps {
  hospitalData: HospitalData;
}

interface LocationData {
  lat: number;
  lng: number;
  city: string;
  state: string;
}

function AddHospital({ hospitalData }: AddHospitalProps): JSX.Element {
  const [showCrearAdmin, setShowCrearAdmin] = useState<boolean>(false);
  const [updatedHospitalData, setUpdatedHospitalData] = useState<any>({});
  // Estado para saber si se ha seleccionado un punto
  const [pointSelected, setPointSelected] = useState<boolean>(false);

  // Actualizamos handleSelect para recibir un objeto LocationData
  const handleSelect = ({ lat, lng, city, state }: LocationData): void => {
    console.log("Coordenadas seleccionadas:", { lat, lng }, city, state);

    setUpdatedHospitalData({
      ...hospitalData,
      ciudad: city,
      departamento: state,
      coordenadas: { lat, lng }
    });
    // Indicamos que se ha seleccionado un punto
    setPointSelected(true);
  };

  // Función que se ejecuta al hacer clic en el botón "Siguiente"
  const handleContinue = (): void => {
    if (!pointSelected) {
      alert('Debes seleccionar un punto en el mapa para continuar');
      return;
    }
    setShowCrearAdmin(true);
  };

  if (showCrearAdmin) {
    return <CrearAdministrador hospitalData={updatedHospitalData} />;
  }

  return (
    <div className="background">
      <div className="background"></div>
      <div className="clienteDetailContainer4 fadeIn">
        <h1 style={{ width: "100%", textAlign: "center" }}>Selecciona la ubicación</h1>
        <MapSelector onSelect={handleSelect} />
        <div className="clienteButtonContainer1">
          <button onClick={handleContinue} className="clienteButton3">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddHospital;
