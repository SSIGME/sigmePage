import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
export default function MapSelector({ onSelect }) {
    const [position, setPosition] = useState(null);
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    async function getLocationInfo(lat, lng) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            // Intenta obtener la ciudad con varias propiedades
            const cityName = data.address.city ||
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
        }
        catch (error) {
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
        return position ? React.createElement(Marker, { position: position }) : null;
    }
    return (React.createElement("div", null,
        React.createElement(MapContainer, { center: [4.570868, -74.297333], zoom: 6, style: { height: "50vh", width: "100%" } },
            React.createElement(TileLayer, { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }),
            React.createElement(LocationMarker, null)),
        React.createElement("div", { style: { marginTop: "4px", display: "flex" } },
            React.createElement("p", { style: { width: "100%", textAlign: "left", fontWeight: "200" } },
                React.createElement("strong", null, "Ciudad/Municipio:"),
                " ",
                city || "Haz clic en el mapa"),
            React.createElement("p", { style: { width: "100%", textAlign: "left", fontWeight: "200" } },
                React.createElement("strong", null, "Departamento:"),
                " ",
                state || "Haz clic en el mapa"))));
}
