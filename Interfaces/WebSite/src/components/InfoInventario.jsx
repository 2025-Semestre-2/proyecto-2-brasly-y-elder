import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const ProductoInfo = () => {
  const { id } = useParams(); 
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`http://localhost:3000/inventario/info?id=${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProducto(data[0] || null);
      } catch (error) {
        console.error('Error al obtener datos del producto:', error);
      }
    };
    fetchProducto();
  }, [id]);

  const navigate = useNavigate();

  if (!producto) return <p>Cargando producto...</p>;

  return (
    <main className="content">
      <div className="Sup-contenedor">
        <h2 className="titulo">{producto.nombreproducto} (ID: {producto.idproducto})</h2>
        <p className="subtitulo">{producto.categoria}</p>
        <button className="boton-volver" onClick={() => navigate(-1)}>Volver</button>
        <div className="grid-contenedor">

          <section className="card">
            <h3>ℹ️ Información General</h3>
            <p><strong>Proveedor:</strong> {producto.nombreproveedor}</p>
            <p><strong>Marca:</strong> {producto.marca}</p>
            <p><strong>Color:</strong> {producto.color}</p>
            <p><strong>Talla:</strong> {producto.talla}</p>
            <p><strong>Palabras clave:</strong> {producto.palabrasclave}</p>
          </section>

          <section className="card">
            <h3>💰 Precios y Stock</h3>
            <p><strong>Precio unitario:</strong> ${producto.preciounitario}</p>
            <p><strong>Precio de venta recomendado:</strong> ${producto.precioventa}</p>
            <p><strong>Impuesto:</strong> {producto.impuesto}%</p>
            <p><strong>Peso por unidad:</strong> {producto.peso} kg</p>
            <p><strong>Cantidad disponible:</strong> {producto.cantidaddisponible}</p>
            <p><strong>Ubicación:</strong> {producto.ubicacion}</p>
          </section>

          <section className="card">
            <h3>📦 Empaquetamiento</h3>
            <p><strong>Unidad de empaquetamiento:</strong> {producto.unidadempaquetamiento}</p>
            <p><strong>Cantidad por paquete:</strong> {producto.cantidadporempaquetamiento}</p>
          </section>

        </div>
      </div>
    </main>
  );
};

export default ProductoInfo;
