import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import SinAcceso from "./ui/sinAccesoCorp.jsx";

export default function ModuloCliente() {

  const { rol } = useAuth(); 

  if (rol !== "Administrador") {
    return (
      <SinAcceso />
    );
  }

  const [filtros, setFiltros] = useState({ nombre: "", categoria: "", entrega: "" });
  const [clientes, setClientes] = useState([]);
  const [categorias, setCategorias] = useState([]); 
  const [cargando, setCargando] = useState(false);


  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(5);

  const navigate = useNavigate();

  const irADetalle = (id) => {
    navigate(`/InfoClientes/${id}`);
  };



  const ajustarFilas = () => {
    const alturaDisponible = window.innerHeight * 0.65;
    const altoFila = 40;
    const filas = Math.max(Math.floor(alturaDisponible / altoFila), 1);
    setFilasPorPagina(filas);
  };


  useEffect(() => {
    ajustarFilas();
    window.addEventListener("resize", ajustarFilas);
    obtenerCategorias();
    obtenerClientes();
    return () => window.removeEventListener("resize", ajustarFilas);
  }, []);

  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/clientes/categorias");
      const data = await respuesta.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };


  const obtenerClientes = async () => {
    setCargando(true);
    try {
      const params = new URLSearchParams({
        nombre: filtros.nombre,
        categoria: filtros.categoria,
        entrega: filtros.entrega
      });
      const respuesta = await fetch(`http://localhost:3000/clientes?${params}`);
      const data = await respuesta.json();
      setClientes(data);
      setPaginaActual(1);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const restaurarFiltros = () => {
    setFiltros({ nombre: "", categoria: "", entrega: "" });
    obtenerClientes();
  };


  const indiceUltimaFila = paginaActual * filasPorPagina;
  const indicePrimeraFila = indiceUltimaFila - filasPorPagina;
  const clientesActuales = clientes.slice(indicePrimeraFila, indiceUltimaFila);
  const totalPaginas = Math.ceil(clientes.length / filasPorPagina);

  return (
    <main className="content">
      <div className="Sup-contenedor">
        <h1 className="Tablas-header">Módulo de Clientes</h1>

        {/* Filtros */}
        <div className="Tablas-filtros">
          <input type="text" name="nombre" placeholder="Nombre del cliente" value={filtros.nombre} onChange={manejarCambio}/>
          <select
            name="categoria"
            value={filtros.categoria}
            onChange={manejarCambio}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat, index) => (
              <option key={index} value={cat.Categorias}>
                {cat.Categorias}
              </option>
            ))}
          </select>

          <input type="text" name="entrega" placeholder="Método de entrega" value={filtros.entrega} onChange={manejarCambio}/>
          <div className="flex gap-2">
            <button onClick={obtenerClientes}>Buscar</button>
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
                {clientesActuales.length > 0 ? (
                  clientesActuales.map((c) => (
                    <tr key={c.id} onClick={() => irADetalle(c.id)} style={{ cursor: "pointer" }}>
                      <td>{c.id}</td>
                      <td>{c.nombre_cliente}</td>
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
