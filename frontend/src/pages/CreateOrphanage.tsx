import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import { useHistory } from 'react-router-dom';
import { Map, Marker, TileLayer } from "react-leaflet";
import L, {LeafletMouseEvent} from "leaflet";

import { FiPlus } from "react-icons/fi";

import mapMarkerImg from "../assets/map-marker.svg";

import Sidebar from "../components/Sidebar";

import "../styles/pages/create-orphanage.css";
import api from "../services/api";

const happyMapIcon = L.icon({
  iconUrl: mapMarkerImg,

  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [0, -60],
});

export default function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition] = useState({latitude: 0, longitude:0});
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [openOnWeekends, setOpenOnWeekends] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(position=>{
      const { latitude, longitude } = position.coords;
      setPosition({latitude, longitude});
    })
  },[]);

  const handleMapClick = (event: LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;
    setPosition({latitude: lat, longitude: lng});
  }

  const handleSelectImages = (event: ChangeEvent<HTMLInputElement>) => {
    if(!event.target.files){
      return;
    }

    const selectedImages = Array.from(event.target.files);

    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image);
    });

    setPreviewImages(selectedImagesPreview);
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const data = new FormData();
    data.append("name", name);
    data.append("latitude", String(position.latitude));
    data.append("longitude", String(position.longitude));
    data.append("about", about);
    data.append("instructions", instructions);
    data.append("opening_hours", openingHours);
    data.append("open_on_weekends", String(openOnWeekends));

    images.forEach(image => {
      data.append("images", image);
    });

    await api.post("orphanages", data);
    alert("Cadastro realizado com sucesso");

    history.push("/app");
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />
      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

            <Map
              onClick={handleMapClick}
              center={[position.latitude, position.longitude]}
              style={{ width: "100%", height: 280 }}
              zoom={15}
            >
              <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              { position.latitude !== 0 && (
                <Marker
                  interactive={false}
                  icon={happyMapIcon}
                  position={[position.latitude, position.longitude]}
                />
              )}

            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={(event)=>setName(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="about">
                Sobre <span>Máximo de 300 caracteres</span>
              </label>
              <textarea id="name" maxLength={300} value={about} onChange={(event) => {setAbout(event.target.value)}}/>
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map(image => {
                  return (
                    <img key={image} src={image} alt={name}/>
                  )
                })}
                <label htmlFor="image" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>
              <input multiple type="file" id="image" onChange={handleSelectImages}/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" value={instructions} onChange={(event)=>{setInstructions(event.target.value)}}/>
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horas de atendimento</label>
              <input id="opening_hours" value={openingHours} onChange={(event)=>{setOpeningHours(event.target.value)}}/>
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  onClick={()=>setOpenOnWeekends(!openOnWeekends)}
                  className={openOnWeekends ? "active" : ''}
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={()=>setOpenOnWeekends(!openOnWeekends)}
                  className={!openOnWeekends ? "active" : ''}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
