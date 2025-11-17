import React, { useEffect, useState } from "react";
import toastr from "toastr";
import { useAuth } from "../context/AuthContext"; 
import SinAcceso from "./ui/sinAccesoAdm.jsx";

export default function TopProductos() {

  const { rol } = useAuth(); 

  if (rol !== "Corporativo") {
    return (
      <SinAcceso />
    );
  }

  const [año, setAño] = useState("");
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [filtros, setFiltros] = useState({ sucursal: "" });
  const [sucursales, setSucursales] = useState("");

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(5);

  const ajustarFilas = () => {
    const alturaDisponible = window.innerHeight * 0.65;
    const altoFila = 40;
    setFilasPorPagina(Math.max(Math.floor(alturaDisponible / altoFila), 1));
  };

  const obtenerDatos = async () => {
    setCargando(true);
    try {
      setSucursales(filtros.sucursal);
      const params = new URLSearchParams({ anio: año, sucursal: filtros.sucursal });

   const respuesta = await fetch(
  `http://localhost:3000/estadisticas/top_productos?${params}`
);


      const data = await respuesta.json();
      setDatos(data);
      setPaginaActual(1);

    } catch (error) {
      console.error("Error al obtener top productos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, [sucursales, año]);

  const restaurarFiltros = () => {
    setFiltros({ sucursal: "" });
    setSucursales("");
    setAño("");
    toastr.info("Filtros restaurados");
  };

  useEffect(() => {
    ajustarFilas();
    window.addEventListener("resize", ajustarFilas);
    obtenerDatos();
    return () => window.removeEventListener("resize", ajustarFilas);
  }, []);


  const totalPaginas = Math.max(Math.ceil(datos.length / filasPorPagina), 1);
  const indiceUltima = paginaActual * filasPorPagina;
  const indicePrimera = indiceUltima - filasPorPagina;
  const filasActuales = datos.slice(indicePrimera, indiceUltima);

  return (
    <main className="content">
      <div className="Sup-contenedor">
        <h1 className="Tablas-header">Top 5 Productos por Ganancia</h1>

        {/* Filtros */}
        <div className="Tablas-filtros">
          <select
            name="sucursal"
            value={filtros.sucursal}
            onChange={manejarCambio}
          >
        <option value="LIMON">Limón</option>
<option value="SANJOSE">San José</option>
<option value="CORP">Corporativo</option>

          </select>

          <input
            type="number"
            placeholder="Año (opcional)"
            value={año}
            onChange={(e) => setAño(e.target.value)}
          />

          <div className="flex gap-2">
            <button onClick={obtenerDatos}>Buscar</button>
            <button onClick={restaurarFiltros}>Restaurar</button>
          </div>
        </div>

        {/* Tabla */}
        {cargando ? (
          <p className="Tablas-empty">Cargando...</p>
        ) : (
          <>
            <table className="Tablas-tabla">
              <thead>
                <tr>
                  <th>Año</th>
                  <th>ID Producto</th>
                    {sucursales !== "" && <th>Sucursal</th>}
                  <th>Producto</th>
                  <th>Ganancia Total</th>
                  <th>Posición</th>
                </tr>
              </thead>

              <tbody>
                {filasActuales.length > 0 ? (
                  filasActuales.map((fila, i) => (
                    <tr key={i}>
                      <td>{fila.año}</td>
                      <td>{fila.id_producto}</td>
                       {sucursales !== "" && <td>{sucursales}</td>}

                      <td>{fila.producto}</td>
                      <td>
                        {Number(fila.ganancia_total ?? 0).toLocaleString()}
                      </td>
                      <td>{fila.posicion}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No hay resultados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="Tablas-paginacion">
              <button onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))} disabled={paginaActual === 1}>Anterior</button>
              <span>{paginaActual} / {totalPaginas}</span>
              <button onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))} disabled={paginaActual === totalPaginas}>Siguiente</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
