import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ModuloProveedor() {
  const [filtros, setFiltros] = useState({ nombre: "", categoria: "", entrega: "" });
  const [cargando, setCargando] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]); 

  // Paginación dinámica
  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(5);


  // Ajustar filas por página según el alto disponible
  const ajustarFilas = () => {
    const alturaDisponible = window.innerHeight * 0.65; 
    const altoFila = 40;
    const filas = Math.max(Math.floor(alturaDisponible / altoFila), 1);
    setFilasPorPagina(filas);
  };

    const navigate = useNavigate();
    const irADetalle = (id) => {
    navigate(`/InfoProveeder/${id}`);
  };


  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };
  const restaurarFiltros = () => {
    setFiltros({ nombre: "", categoria: "", entrega: "" });
    obtenerClientes();
  };
  const obtenerProveedor = async () => {
    setCargando(true);
    try {
      const params = new URLSearchParams({
        nombre: filtros.nombre,
        categoria: filtros.categoria,
        entrega: filtros.entrega
      });
      const respuesta = await fetch(`http://localhost:3000/proveedores?${params}`);
      const data = await respuesta.json();
      setProveedores(data);
      setPaginaActual(1);
    } catch (error) {
      console.error("Error al obtener proveedor:", error);
    } finally {
      setCargando(false);
    }
  };
  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/proveedores/categorias");
      const data = await respuesta.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };





  useEffect(() => {
    ajustarFilas();
    obtenerCategorias();
    obtenerProveedor();
    window.addEventListener("resize", ajustarFilas);
    return () => window.removeEventListener("resize", ajustarFilas);
  }, []);


  // Calcular filas visibles según la página
  const indiceUltimaFila = paginaActual * filasPorPagina;
  const indicePrimeraFila = indiceUltimaFila - filasPorPagina;
  const ProveedoresActuales = proveedores.slice(indicePrimeraFila, indiceUltimaFila);
  const totalPaginas = Math.ceil(proveedores.length / filasPorPagina);

  return (
    <main className="content">
      <div className="Sup-contenedor">
        <h1 className="Tablas-header">Módulo de Proveedores</h1>

        {/* Filtros */}
        <div className="Tablas-filtros">
          <input type="text" name="nombre" placeholder="Nombre del Proveedor" value={filtros.nombre} onChange={manejarCambio}/>
          <select
            name="categoria"
            value={filtros.categoria}
            onChange={manejarCambio}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat, index) => (
              <option key={index} value={cat.CatProveedores}>
                {cat.CatProveedores}
              </option>
            ))}
          </select>
          <input type="text" name="entrega" placeholder="Método de entrega" value={filtros.entrega} onChange={manejarCambio}/>
          <div className="flex gap-2">
            <button onClick={obtenerProveedor}>Buscar</button>
            <button onClick={restaurarFiltros}>Restaurar</button>
          </div>
        </div>

        {/* Tabla */}
        {cargando ? (
          <p className="Tablas-empty">No hay Tablas que coincidan con los filtros.</p>
        ) : (
          <>
            <table className="Tablas-tabla">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Método de entrega</th>
                </tr>
              </thead>
              <tbody>
                {ProveedoresActuales.length > 0 ? (
                  ProveedoresActuales.map((c) => (
                    <tr key={c.id_proveedor} onClick={() => irADetalle(c.id_proveedor)} style={{ cursor: "pointer" }}>
                      <td>{c.id_proveedor}</td>
                      <td>{c.nombre_proveedor}</td>
                      <td>{c.categoria}</td>
                      <td>{c.metodo_entrega}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">No se encontraron resultados.</td>
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
