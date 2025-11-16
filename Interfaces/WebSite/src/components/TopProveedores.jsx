import React, { useEffect, useState } from "react";
import toastr from "toastr";

export default function TopProveedores() {

  const [rangos, setRangos] = useState({
    año_inicio: "",
    año_fin: "",
    sucursal: ""     
  });

  const [sucursales, setSucursales] = useState(""); 
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
      setSucursales(rangos.sucursal);
      const params = new URLSearchParams(rangos);
      const respuesta = await fetch(
        `http://localhost:3000/Estadisticas/top_proveedores?${params}`
      );

      const data = await respuesta.json();
      setDatos(data);
      setPaginaActual(1);

    } catch (error) {
      console.error("Error al obtener top proveedores:", error);
    } finally {
      setCargando(false);
    }
  };

  // 👉 SOLO carga inicial, no recarga cuando cambias select
  useEffect(() => {
    ajustarFilas();
    window.addEventListener("resize", ajustarFilas);
    obtenerDatos(); // carga inicial
    return () => window.removeEventListener("resize", ajustarFilas);
  }, []);

  // paginación
  const totalPaginas = Math.max(Math.ceil(datos.length / filasPorPagina), 1);
  const filasActuales = datos.slice(
    (paginaActual - 1) * filasPorPagina,
    paginaActual * filasPorPagina
  );

  const restaurarFiltros = () => {
    setRangos({ año_inicio: "", año_fin: "", sucursal: "" });
    setSucursales("");
    toastr.info("Filtros restaurados");
    obtenerDatos();
  };

  return (
    <main className="content">
      <div className="Sup-contenedor">
        <h1 className="Tablas-header">Top 5 Proveedores por Órdenes</h1>

        {/* Filtros */}
        <div className="Tablas-filtros">

         <select
            name="sucursal"
            value={rangos.sucursal}
            onChange={manejarCambio}
          >
            <option value="">Todas las sucursales</option>
            <option value="Limón">Limón</option>
            <option value="San José">San José</option>
          </select>

          <input
            type="number"
            name="año_inicio"
            placeholder="Año inicio"
            value={rangos.año_inicio}
            onChange={manejarCambio}
          />

          <input
            type="number"
            name="año_fin"
            placeholder="Año fin"
            value={rangos.año_fin}
            onChange={manejarCambio}
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
                  <th>ID Proveedor</th>
                   {sucursales !== "" && <th>Sucursal</th>}
                  <th>Proveedor</th>
                  <th>Órdenes</th>
                  <th>Monto Total</th>
                  <th>Posición</th>
                </tr>
              </thead>

              <tbody>
                {filasActuales.length > 0 ? (
                  filasActuales.map((fila, i) => (
                    <tr key={i}>
                      <td>{fila.año}</td>
                      <td>{fila.id_proveedor}</td>
                      {sucursales !== "" && <td>{sucursales}</td>}
                      <td>{fila.proveedor}</td>
                      <td>{fila.cantidad_ordenes}</td>
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
