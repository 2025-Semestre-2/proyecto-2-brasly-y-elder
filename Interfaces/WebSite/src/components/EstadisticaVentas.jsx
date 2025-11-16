import React, { useEffect, useState } from "react";

export default function EstadisticasVentas() {
  const [filtros, setFiltros] = useState({ nombre_cliente: "", categoria: "" , sucursal: ""});
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [categoria, setCategorias] = useState([]);
  const [sucursales, setSucursales] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(5);


  const ajustarFilas = () => {
    const alturaDisponible = window.innerHeight * 0.65;
    const altoFila = 40;
    const filas = Math.max(Math.floor(alturaDisponible / altoFila), 1);
    setFilasPorPagina(filas);
  };
    const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/inventario/categorias");
      const data = await respuesta.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };


  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const obtenerEstadisticas = async () => {
    setCargando(true);
    try {
      setSucursales(filtros.sucursal);
      const params = new URLSearchParams({
        nombre_cliente: filtros.nombre_cliente,
        categoria: filtros.categoria,
        sucursal: filtros.sucursal,
      });
      const respuesta = await fetch(`http://localhost:3000/estadisticas/ventas?${params}`);
      const data = await respuesta.json();
      setDatos(data);
      setPaginaActual(1);
    } catch (error) {
      console.error("Error al obtener estadísticas de ventas:", error);
    } finally {
      setCargando(false);
    }
  };


  useEffect(() => {
    obtenerEstadisticas();
  }, [filtros]);

  const restaurarFiltros = () => {
    setFiltros({ nombre_cliente: "", categoria: "", sucursal: "" });
    setSucursales("");
    toastr.info("Filtros restaurados");
  };

  useEffect(() => {
    ajustarFilas();
    obtenerCategorias();
    window.addEventListener("resize", ajustarFilas);
    obtenerEstadisticas();
    return () => window.removeEventListener("resize", ajustarFilas);
  }, []);

  // cálculo de paginación
  const totalPaginas = Math.max(Math.ceil(datos.length / filasPorPagina), 1);
  const indiceUltimaFila = paginaActual * filasPorPagina;
  const indicePrimeraFila = indiceUltimaFila - filasPorPagina;
  const filasActuales = datos.slice(indicePrimeraFila, indiceUltimaFila);

  return (
    <main className="content">
      <div className="Sup-contenedor">
        <h1 className="Tablas-header">Estadísticas de Ventas</h1>

        {/* Filtros */}
        <div className="Tablas-filtros">
          <select
            name="sucursal"
            value={filtros.sucursal}
            onChange={manejarCambio}
          >
            <option value="">Todas las sucursales</option>
            <option value="Limón">Limón</option>
            <option value="San José">San José</option>
          </select>
          <input type="text" name="nombre_cliente" placeholder="Nombre del cliente" value={filtros.nombre_cliente} onChange={manejarCambio}/>
          <select
            name="categoria"
            value={filtros.categoria}
            onChange={manejarCambio}
          >
            <option value="">Todas las categorías</option>
            {categoria.map((cat, index) => (
              <option key={index} value={cat.categoria}>
                {cat.categoria}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button onClick={obtenerEstadisticas}>Buscar</button>
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
                  <th>Categoría</th>
                  <th>Cliente</th>
                  {sucursales !== "" && <th>Sucursal</th>}
                  <th>Facturas</th>
                  <th>Mín</th>
                  <th>Máx</th>
                  <th>Prom</th>
                </tr>
              </thead>
              <tbody>
                {filasActuales.length > 0 ? (
                  filasActuales.map((fila, i) => (
                    <tr key={i}>
                      <td>{fila.categoria}</td>
                      <td>{fila.cliente}</td>
                      {sucursales !== "" && <td>{sucursales}</td>}
                      <td>{fila.facturas}</td>
                      <td>{Number(fila.venta_min ?? 0).toLocaleString()}</td>
                      <td>{Number(fila.venta_max ?? 0).toLocaleString()}</td>
                      <td>{Number(fila.venta_prom ?? 0).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">No se encontraron resultados.</td>
                  </tr>
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
