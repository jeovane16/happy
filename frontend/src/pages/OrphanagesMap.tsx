import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiArrowRight } from "react-icons/fi";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import Leaflet from "leaflet";

import "leaflet/dist/leaflet.css";
import "../styles/pages/orphanages-map.css";
import mapMarkerImg from "../assets/map-marker.svg";
import api from "../services/api";

const mapIcon = Leaflet.icon({
  iconUrl: mapMarkerImg,
  iconSize: [48, 58],
  iconAnchor: [24, 58],
  popupAnchor: [160, 10],
});

interface Orphanage {
  id: number,
  name: string,
  latitude: number,
  longitude: number
}

const OrphanagesMap = () => {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  useEffect(()=>{
    api.get("orphanages").then(response => {
      setOrphanages(response.data);
    });
  }, []);

  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="Logo" />
          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>

        <footer>
          <strong>Curitiba</strong>
          <span>Paraná</span>
        </footer>
      </aside>

      <Map
        center={[-25.4492096, -49.3032869]}
        zoom={15}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {orphanages.map(orphanage => {
          return (
            <Marker key={orphanage.id} icon={mapIcon} position={[orphanage.latitude, orphanage.longitude]}>
              <Popup
                className="map-popup"
                closeButton={false}
                minWidth={240}
                maxWidth={240}
              >
                {orphanage.name}
                <Link to={`/orphanages/${orphanage.id}`}>
                  <FiArrowRight size={20} color="#FFFFFF" />
                </Link>
              </Popup>
            </Marker>
          )
        })}
      </Map>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#FFFFFF" />
      </Link>
    </div>
  );
};

export default OrphanagesMap;
