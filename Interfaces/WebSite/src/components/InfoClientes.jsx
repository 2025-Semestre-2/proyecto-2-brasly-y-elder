import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ClienteInfo = () => {
  const { id } = useParams(); 
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await fetch(`http://localhost:3000/info/clientes?id=${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCliente(data[0] || null);
      } catch (error) {
        console.error('Error al obtener datos del cliente:', error);
      }
    };
    fetchCliente();
  }, [id]); 

  const navigate = useNavigate();

  if (!cliente) return <p>Cargando cliente...</p>;

  return (
    <main className="content">
      <div className="Sup-contenedor">
        <h2 className="titulo">{cliente.Cliente} (ID: {cliente.ID})</h2>
        <p className="subtitulo">{cliente.Categoria}</p>
        <button className="boton-volver" onClick={() => navigate(-1)}>Volver</button>


        <div className="grid-contenedor">

          <section className="card">
            <h3><i className="icon">ℹ️</i> Información General</h3>
            <p><strong>Grupo de compra:</strong> {cliente.GrupoDeCompras}</p>
            <p><strong>Cliente para facturar:</strong> {cliente.ClienteFacturarID}</p>
            <p><strong>Categoría:</strong> {cliente.Categoria}</p>
          </section>


          <section className="card">
            <h3><i className="icon">📞</i> Detalles de Contacto</h3>
            <p><strong>Teléfono:</strong> {cliente.Telefono}</p>
            <p><strong>Fax:</strong> {cliente.Fax}</p>
            <p><strong>Sitio Web:</strong> <a href={cliente.SitioWeb} target="_blank" rel="noreferrer">{cliente.SitioWeb}</a></p>
          </section>


          <section className="card card-mapa">
            <h3><i className="icon">📍</i> Localización de Entrega</h3>
            <div className="mapa-contenedor">
              <MapContainer
                center={[cliente.Latitud, cliente.Longitud]}
                zoom={13}
                style={{ height: "40vh", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                />
                <Marker position={[cliente.Latitud, cliente.Longitud]}>
                  <Popup>{cliente.CiudadEntrega}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </section>

          <section className="card">
            <h3><i className="icon">👥</i> Contactos</h3>
            <p><strong>Primario:</strong> {cliente.ContactoPrimario}</p>
            <p><strong>Alternativo:</strong> {cliente.ContactoAlternativo}</p>
          </section>

          <section className="card">
            <h3><i className="icon">🚚</i> Información de Envío</h3>
            <p><strong>Método de entrega:</strong> {cliente.MetodoEntrega}</p>
            <p><strong>Ciudad:</strong> {cliente.CiudadEntrega}</p>
            <p><strong>Código postal:</strong> {cliente.CodigoPostal}</p>
          </section>


          <section className="card">
            <h3><i className="icon">💰</i> Pago</h3>
            <p><strong>Días de gracia para pagar:</strong> {cliente.DiasGraciaPago}</p>
          </section>

          <section className="card">
            <h3><i className="icon">📬</i> Direcciones</h3>
            <p><strong>Dirección de entrega:</strong> {cliente.DireccionEntrega}</p>
            <p><strong>Dirección postal:</strong> {cliente.DireccionPostal}</p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ClienteInfo;
