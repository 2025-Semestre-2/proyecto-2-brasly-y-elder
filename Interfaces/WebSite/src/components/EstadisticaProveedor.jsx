import React, { useEffect, useState } from "react";

export default function EstadisticasProveedores() {
  const [filtros, setFiltros] = useState({
    nombre_proveedor: "",
    categoria: "",
  });

  const [datos, setDatos] = useState([]);        // SIEMPRE arreglo
  const [cargando, setCargando] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [errorApi, setErrorApi] = useState("");

  const token = localStorage.getItem("token");

  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(5);

  const ajustarFilas = () => {
    const alturaDisponible = window.innerHeight * 0.65;
    const altoFila = 40;
    setFilasPorPagina(Math.max(Math.floor(alturaDisponible / altoFila), 1));
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  // --------- ESTADÍSTICAS PROVEEDORES -------------
  const obtenerEstadisticas = async () => {
    setCargando(true);
    setErrorApi("");

    try {
      const params = new URLSearchParams({
        nombre_proveedor: filtros.nombre_proveedor,
        categoria: filtros.categoria,
      });

      const resp = await fetch(
        `http://localhost:4000/estadisticas/proveedores?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await resp.json();
      console.log("Respuesta /estadisticas/proveedores:", data);

      if (!resp.ok) {
        // vino error 4xx/5xx
        setErrorApi(data.message || "Error al obtener estadísticas");
        setDatos([]); // para que datos.slice no reviente
        return;
      }

      // nos aseguramos de que datos sea arreglo
      setDatos(Array.isArray(data) ? data : []);
      setPaginaActual(1);
    } catch (error) {
      console.error("Error al obtener estadísticas de proveedores:", error);
      setErrorApi("No se pudo conectar con el servidor de estadísticas");
      setDatos([]);
    } finally {
      setCargando(false);
    }
  };

  // --------- CATEGORÍAS PROVEEDOR -------------
  const obtenerCategorias = async () => {
    try {
      const resp = await fetch(
        "http://localhost:4000/proveedores/categorias",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await resp.json();
      console.log("Respuesta /proveedores/categorias:", data);

      if (!resp.ok) {
        setErrorApi(
          data.message || "Error al obtener categorías de proveedores"
        );
        setCategorias([]);
        return;
      }

      // esperamos algo como [{ categoria: 'Alimentos' }, ...]
      setCategorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      setErrorApi("No se pudo conectar con el servidor de categorías");
      setCategorias([]);
    }
  };

  // --- efectos ---
  useEffect(() => {
    ajustarFilas();
    obtenerCategorias();
    obtenerEstadisticas();

    window.addEventListener("resize", ajustarFilas);
    return () => window.removeEventListener("resize", ajustarFilas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    obtenerEstadisticas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros]);

  const restaurarFiltros = () => {
    setFiltros({ nombre_proveedor: "", categoria: "" });
    setPaginaActual(1);
  };

  // PAGINACIÓN
  const totalPaginas = Math.max(
    Math.ceil(datos.length / filasPorPagina),
    1
  );
  const indiceUltimaFila = paginaActual * filasPorPagina;
  const indicePrimeraFila = indiceUltimaFila - filasPorPagina;
  const filasActuales = datos.slice(indicePrimeraFila, indiceUltimaFila);

  return (
    <main className="content">
      <div className="Sup-contenedor">
        <h1 className="Tablas-header">Estadísticas de Proveedores</h1>

        {/* mensaje de error API */}
        {errorApi && (
          <p style={{ color: "red", marginBottom: "0.5rem" }}>{errorApi}</p>
        )}

        {/* Filtros */}
        <div className="Tablas-filtros">
          <input
            type="text"
            name="nombre_proveedor"
            placeholder="Nombre del proveedor"
            value={filtros.nombre_proveedor}
            onChange={manejarCambio}
          />

          <select
            name="categoria"
            value={filtros.categoria}
            onChange={manejarCambio}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat, index) => (
              <option key={index} value={cat.categoria}>
                {cat.categoria}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button type="button" onClick={obtenerEstadisticas}>
              Buscar
            </button>
            <button type="button" onClick={restaurarFiltros}>
              Restaurar
            </button>
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
                  <th>Proveedor</th>
                  <th>Órdenes</th>
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
                      <td>{fila.proveedor}</td>
                      <td>{fila.ordenes}</td>
                      <td>{Number(fila.monto_min ?? 0).toLocaleString()}</td>
                      <td>{Number(fila.monto_max ?? 0).toLocaleString()}</td>
                      <td>{Number(fila.monto_prom ?? 0).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No se encontraron resultados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Paginación */}
            <div className="Tablas-paginacion">
              <button
                onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
                disabled={paginaActual === 1}
              >
                Anterior
              </button>

              <span>
                {paginaActual} / {totalPaginas}
              </span>

              <button
                onClick={() =>
                  setPaginaActual((p) => Math.min(p + 1, totalPaginas))
                }
                disabled={paginaActual === totalPaginas}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
