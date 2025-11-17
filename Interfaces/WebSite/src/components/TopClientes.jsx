import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; 
import SinAcceso from "./ui/sinAccesoAdm.jsx";

export default function TopClientes() {

  const { rol } = useAuth(); 

  if (rol !== "Corporativo") {
    return (
      <SinAcceso />
    );
  }
  const [rangos, setRangos] = useState({ año_inicio: "", año_fin: "" });
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(5);

  const ajustarFilas = () => {
    const alturaDisponible = window.innerHeight * 0.65;
    setFilasPorPagina(Math.max(Math.floor(alturaDisponible / 40), 1));
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setRangos({ ...rangos, [name]: value });
  };

  const obtenerDatos = async () => {
    setCargando(true);
    try {
      const params = new URLSearchParams(rangos);
      const respuesta = await fetch(`http://localhost:3000/Estadisticas/top_clientes?${params}`);
      const data = await respuesta.json();
      setDatos(data);
      setPaginaActual(1);
    } catch (error) {
      console.error("Error al obtener top clientes:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    ajustarFilas();
    window.addEventListener("resize", ajustarFilas);
    obtenerDatos();
    return () => window.removeEventListener("resize", ajustarFilas);
  }, []);

  const totalPaginas = Math.max(Math.ceil(datos.length / filasPorPagina), 1);
  const filasActuales = datos.slice((paginaActual - 1) * filasPorPagina, paginaActual * filasPorPagina);

  return (
    <main className="content">
      <div className="Sup-contenedor">
        <h1 className="Tablas-header">Top 5 Clientes por Facturas</h1>

        {/* Filtros */}
        <div className="Tablas-filtros">
          <input type="number" name="año_inicio" placeholder="Año inicio" value={rangos.año_inicio} onChange={manejarCambio} />
          <input type="number" name="año_fin" placeholder="Año fin" value={rangos.año_fin} onChange={manejarCambio} />
          <div className="flex gap-2">
            <button onClick={obtenerDatos}>Buscar</button>
            <button onClick={() => { setRangos({ año_inicio: "", año_fin: "" }); obtenerDatos(); }}>Restaurar</button>
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
                  <th>ID Cliente</th>
                  <th>Cliente</th>
                  <th>Facturas</th>
                  <th>Monto Total</th>
                  <th>Posición</th>
                </tr>
              </thead>
              <tbody>
                {filasActuales.length > 0 ? (
                  filasActuales.map((fila, i) => (
                    <tr key={i}>
                      <td>{fila.año}</td>
                      <td>{fila.id_cliente}</td>
                      <td>{fila.cliente}</td>
                      <td>{fila.cantidad_facturas}</td>
                      <td>{Number(fila.monto_total ?? 0).toLocaleString()}</td>
                      <td>{fila.posicion}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="text-center py-4 text-gray-500">No hay resultados.</td></tr>
                )}
              </tbody>
            </table>

            {/* Paginación */}
            <div className="Tablas-paginacion">
              <button onClick={() => setPaginaActual(p => Math.max(p - 1, 1))} disabled={paginaActual === 1}>Anterior</button>
              <span>{paginaActual} / {totalPaginas}</span>
              <button onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))} disabled={paginaActual === totalPaginas}>Siguiente</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
