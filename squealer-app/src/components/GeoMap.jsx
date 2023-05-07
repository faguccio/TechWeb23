import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function GeoMap({ geolocation }) {
  return (
    <MapContainer
      className="rounded-lg z-0"
      center={[geolocation.lat, geolocation.lon]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[geolocation.lat, geolocation.lon]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default GeoMap;
