import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function WeatherMap({ lat, lon, city }) {
  if (!lat || !lon) return null;

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg">
      <MapContainer
        center={[lat, lon]}
        zoom={10}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lon]}>
          <Popup>{city}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}