import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


const VentaInfo = () => {
  const { id } = useParams(); 
  const [encabezado, setEncabezado] = useState(null);
  const [detalle, setDetalle] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEncabezado = async () => {
      try {
        const response = await fetch(`http://localhost:3000/venta/encabezado?id=${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setEncabezado(data[0] || null);
      } catch (error) {
        console.error('Error al obtener encabezado de la venta:', error);
      }
    };

    const fetchDetalle = async () => {
      try {
        const response = await fetch(`http://localhost:3000/venta/detalle?id=${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setDetalle(data || []);
      } catch (error) {
        console.error('Error al obtener detalle de la venta:', error);
      }
    };

    fetchEncabezado();
    fetchDetalle();
  }, [id]);

  if (!encabezado) return <p>Cargando venta...</p>;

  return (
    <main className="content">
      <div className="Sup-contenedor">
        <button className="boton-volver" onClick={() => navigate(-1)}>Volver</button>
        <section className="card encabezado"style={{ backgroundColor: "#e0e1dd" }}>
          <h2>Factura #{encabezado.numero_factura}</h2>
          <p>{encabezado.nombre_cliente} (ID Cliente: {encabezado.id_cliente})</p>
          <p><strong>Fecha:</strong> {new Date(encabezado.fecha_factura).toLocaleDateString()}</p>
          <p><strong>Método de entrega:</strong> {encabezado.metodo_entrega}</p>
          <p><strong>Número de orden:</strong> {encabezado.numero_orden}</p>
          <p><strong>Persona contacto:</strong> {encabezado.persona_contacto}</p>
          <p><strong>Vendedor:</strong> {encabezado.nombre_vendedor}</p>
          <p><strong>Instrucciones:</strong> {encabezado.instrucciones_entrega}</p>
        </section>

        <section className="card detalle" style={{ backgroundColor: "#e0e1dd" }}>
          <h3>Detalle de Productos</h3>
          {detalle.length === 0 ? (
            <p>No hay productos en esta venta.</p>
          ) : (
            <table className="detalle-tabla">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Impuesto</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {detalle.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nombre_producto}</td>
                    <td>{item.cantidad}</td>
                    <td>{item.precio_unitario.toFixed(2)}</td>
                    <td>{item.monto_impuesto.toFixed(2)}</td>
                    <td>{item.total_por_linea.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
};

export default VentaInfo;
