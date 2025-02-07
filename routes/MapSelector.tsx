import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";

export default function MapSelector({ onSelect }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");

  async function getLocationInfo(lat: number, lng: number) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      // Intenta obtener la ciudad con varias propiedades
      const cityName =
        data.address.city ||
        data.address.town ||
        data.address.municipality ||
        data.address.county ||
        data.address.region ||
        data.address.hamlet ||
        "No encontrado";
        
      const stateName = data.address.state || "Cundinamarca";

      setCity(cityName);
      setState(stateName);
      
      return { city: cityName, state: stateName };
    } catch (error) {
      console.error("Error obteniendo la ubicación:", error);
      setCity("Error");
      setState("Error");
      return { city: "Error", state: "Error" };
    }
  }

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        // Llama a getLocationInfo y, una vez resuelto, pasa los datos al callback onSelect
        getLocationInfo(lat, lng).then(({ city, state }) => {
          onSelect && onSelect({ lat, lng, city, state });
        });
      },
    });

    return position ? <Marker position={position} /> : null;
  }

  return (
    <div>
      <MapContainer center={[4.570868, -74.297333]} zoom={6} style={{ height: "50vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
      </MapContainer>
      <div style={{ marginTop: "4px", display: "flex" }}>
        <p style={{ width: "100%", textAlign: "left", fontWeight: "200" }}>
          <strong>Ciudad/Municipio:</strong> {city || "Haz clic en el mapa"}
        </p>
        <p style={{ width: "100%", textAlign: "left", fontWeight: "200" }}>
          <strong>Departamento:</strong> {state || "Haz clic en el mapa"}
        </p>
      </div>
    </div>
  );
}
