import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import officeMarker from '../images/custom-marker.png'; // update path as needed
import 'leaflet/dist/leaflet.css';

// Create a custom icon using your PNG image
const customIcon = new L.Icon({
  iconUrl: officeMarker,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  className: 'office-icon'
});

// Dummy data for offices on different continents
const offices = [
  {
    position: [40.7128, -74.0060],
    name: "New York Office",
    address: "123 Fifth Avenue",
    city: "New York",
    officeImage: "https://picsum.photos/seed/office1/300/200"
  },
  {
    position: [34.0522, -118.2437],
    name: "Los Angeles Office",
    address: "456 Hollywood Blvd",
    city: "Los Angeles",
    officeImage: "https://picsum.photos/seed/office2/300/200"
  },
  {
    position: [41.8781, -87.6298],
    name: "Chicago Office",
    address: "789 Michigan Ave",
    city: "Chicago",
    officeImage: "https://picsum.photos/seed/office3/300/200"
  },
  {
    position: [51.5074, -0.1278],
    name: "London Office",
    address: "10 Downing Street",
    city: "London",
    officeImage: "https://picsum.photos/seed/office4/300/200"
  },
  {
    position: [52.5200, 13.4050],
    name: "Berlin Office",
    address: "Unter den Linden 77",
    city: "Berlin",
    officeImage: "https://picsum.photos/seed/office5/300/200"
  },
  {
    position: [48.8566, 2.3522],
    name: "Paris Office",
    address: "Champs-Élysées 50",
    city: "Paris",
    officeImage: "https://picsum.photos/seed/office6/300/200"
  },
  {
    position: [35.6895, 139.6917],
    name: "Tokyo Office",
    address: "1 Chome-1-2 Oshiage",
    city: "Tokyo",
    officeImage: "https://picsum.photos/seed/office7/300/200"
  },
  {
    position: [1.3521, 103.8198],
    name: "Singapore Office",
    address: "1 Raffles Place",
    city: "Singapore",
    officeImage: "https://picsum.photos/seed/office8/300/200"
  },
  {
    position: [-33.8688, 151.2093],
    name: "Sydney Office",
    address: "200 George Street",
    city: "Sydney",
    officeImage: "https://picsum.photos/seed/office9/300/200"
  },
  {
    position: [-33.9249, 18.4241],
    name: "Cape Town Office",
    address: "5 Long Street",
    city: "Cape Town",
    officeImage: "https://picsum.photos/seed/office10/300/200"
  },
  {
    position: [-23.5505, -46.6333],
    name: "São Paulo Office",
    address: "Av. Paulista, 1000",
    city: "São Paulo",
    officeImage: "https://picsum.photos/seed/office11/300/200"
  },
  {
    position: [25.2048, 55.2708],
    name: "Dubai Office",
    address: "Downtown Dubai",
    city: "Dubai",
    officeImage: "https://picsum.photos/seed/office12/300/200"
  }
];

const MapComponent = () => {
  return (
    <div className="office-overview-container">
      <h2 className="overview-heading">Offices Overview</h2>
      <hr className="overview-divider" />
      <div className="map-container">
        <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="© OpenStreetMap contributors © CARTO"
          />
          {offices.map((office, idx) => (
            <Marker key={idx} position={office.position} icon={customIcon}>
              <Popup>
                <img
                  src={office.officeImage}
                  alt={office.name}
                  style={{ width: '100%', marginBottom: '8px', borderRadius: '8px' }}
                />
                <strong>{office.name}</strong><br />
                {office.address}<br />
                {office.city}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
