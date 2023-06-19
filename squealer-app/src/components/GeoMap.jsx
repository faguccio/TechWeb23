import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function GeoMap({ geolocation }) {
  return (
    <MapContainer
      className="rounded-lg z-0"
      center={[geolocation[0].lat, geolocation[0].lon]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geolocation.map((geo) => {
        return (
          <Marker
            position={[geo.lat, geo.lon]}
            key={String(crypto.getRandomValues(new Uint32Array(10)))}
          >
            <Popup>
              {geo.timestamp
                ? `Post made at ${geo.timestamp}`
                : "The post was made here"}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default GeoMap;
