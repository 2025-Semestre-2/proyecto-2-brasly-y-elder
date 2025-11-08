import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

// Configurar íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ProveedorInfo = () => {
  const { id } = useParams(); 
  const [proveedor, setProveedor] = useState(null);

  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const response = await fetch(`http://localhost:3000/proveedores/info?id=${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProveedor(data[0] || null);
      } catch (error) {
        console.error('Error al obtener datos del proveedor:', error);
      }
    };
    fetchProveedor();
  }, [id]);

  const navigate = useNavigate();

  if (!proveedor) return <p>Cargando proveedor...</p>;

  return (
    <main className="content">
      <div className="Sup-contenedor">
        <h2 className="titulo">{proveedor.NombreProveedor} (ID: {proveedor.id})</h2>
        <p className="subtitulo">{proveedor.Categoria}</p>
        <button className="boton-volver" onClick={() => navigate(-1)}>Volver</button>

        <div className="grid-contenedor">

          <section className="card">
            <h3><i className="icon">ℹ️</i> Información General</h3>
            <p><strong>Referencia:</strong> {proveedor.referencia}</p>
            <p><strong>Categoría:</strong> {proveedor.Categoria}</p>
          </section>

          <section className="card">
            <h3><i className="icon">📞</i> Contacto Primario</h3>
            <p><strong>Nombre:</strong> {proveedor.PrimarioContactoNombre}</p>
            <p><strong>Teléfono:</strong> {proveedor.PrimarioContactoNumero}</p>
            <p><strong>Email:</strong> {proveedor.PrimarioContactoEmail}</p>
          </section>

          <section className="card">
            <h3><i className="icon">📞</i> Contacto Alternativo</h3>
            <p><strong>Nombre:</strong> {proveedor.AlternativoContactoNombre}</p>
            <p><strong>Teléfono:</strong> {proveedor.AlternativoContactoNumero}</p>
            <p><strong>Email:</strong> {proveedor.AlternativoContactoEmail}</p>
          </section>

          <section className="card">
            <h3><i className="icon">🚚</i> Información de Envío</h3>
            <p><strong>Método de entrega:</strong> {proveedor.MetodoEntrega}</p>
            <p><strong>Ciudad:</strong> {proveedor.CiudadEntrega}</p>
            <p><strong>Código postal:</strong> {proveedor.CodigoPostal}</p>
            <p><strong>Teléfono:</strong> {proveedor.Telefono}</p>
            <p><strong>Fax:</strong> {proveedor.Fax}</p>
            <p><strong>Sitio Web:</strong> <a href={proveedor.SitioWeb} target="_blank" rel="noreferrer">{proveedor.SitioWeb}</a></p>
          </section>

          <section className="card">
            <h3><i className="icon">💰</i> Información Bancaria</h3>
            <p><strong>Banco:</strong> {proveedor.NombreBanco}</p>
            <p><strong>Sucursal:</strong> {proveedor.SucursalBanco}</p>
            <p><strong>Código Banco:</strong> {proveedor.CodigoBanco}</p>
            <p><strong>Número de cuenta:</strong> {proveedor.NumeroCuenta}</p>
            <p><strong>Código Internacional:</strong> {proveedor.CodigoInternacional}</p>
            <p><strong>Días de pago:</strong> {proveedor.DiasPago}</p>
          </section>
          <section className="card card-mapa">
            <h3><i className="icon">📍</i> Localización de Entrega</h3>
            <div className="mapa-contenedor">
              <MapContainer
                center={[proveedor.Latitud, proveedor.Longitud]}
                zoom={13}
                style={{ height: "40vh", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                />
                <Marker position={[proveedor.Latitud, proveedor.Longitud]}>
                  <Popup>{proveedor.CiudadEntrega}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </section>

          <section className="card">
            <h3><i className="icon">📬</i> Direcciones</h3>
            <p><strong>Dirección de entrega 1:</strong> {proveedor.DeliveryAddressLine1}</p>
            <p><strong>Dirección de entrega 2:</strong> {proveedor.DeliveryAddressLine2}</p>
            <p><strong>Dirección postal 1:</strong> {proveedor.PostalAddressLine1}</p>
            <p><strong>Dirección postal 2:</strong> {proveedor.PostalAddressLine2}</p>
          </section>
          

        </div>
      </div>
    </main>
  );
};

export default ProveedorInfo;
