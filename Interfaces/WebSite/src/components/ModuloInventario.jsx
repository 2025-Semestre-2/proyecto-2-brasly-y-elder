import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

toastr.options = {
  closeButton: true,
  progressBar: true,
  newestOnTop: true,
  positionClass: "toast-bottom-right",
  timeOut: 3500,
  extendedTimeOut: 1500,
  preventDuplicates: true,
};


import { useAuth } from "../context/AuthContext"; 
import SinAcceso from "./ui/sinAccesoCorp.jsx";

export default function ModuloInventario() {

  const { rol } = useAuth(); 

  if (rol !== "Administrador") {
    return (
      <SinAcceso />
    );
  }


  const [filtros, setFiltros] = useState({ nombre: "", Grupo: "" });
  const [productos, setproductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [grupos, setGrupo] = useState([]);
  const [sucursales, setSucursales] = useState(""); 

  // Paginación dinámica
  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(5);

  const navigate = useNavigate();

  const readMaybeJson = async (resp) => {
    const ct = resp.headers.get("content-type") || "";
    if (ct.includes("application/json")) return await resp.json();
    const text = await resp.text();
    try { return JSON.parse(text); } catch { return { error: text }; }
  };

  const ajustarFilas = () => {
    const alturaDisponible = window.innerHeight * 0.50;
    const altoFila = 40;
    const filas = Math.max(Math.floor(alturaDisponible / altoFila), 1);
    setFilasPorPagina(filas);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const obtenerInventario = async () => {
    setCargando(true);

    try {
      setSucursales(filtros.sucursal);
      const params = new URLSearchParams({
        nombre: filtros.nombre,
        Grupo: filtros.Grupo,
        sucursal: filtros.sucursal,  
      });

      const respuesta = await fetch(`http://localhost:3000/inventario?${params}`);
      const data = await readMaybeJson(respuesta);

      if (!respuesta.ok) {
        throw new Error(data?.error || "Error al obtener inventario.");
      }

      setproductos(Array.isArray(data) ? data : []);
      setPaginaActual(1);

      toastr.info(
        `Se cargaron ${Array.isArray(data) ? data.length : 0} productos`,
        "Inventario actualizado"
      );

    } catch (error) {
      console.error("Error al obtener inventario:", error);
      await Swal.fire({
        icon: "error",
        title: "No se pudo cargar el inventario",
        text: error.message || "Error desconocido",
        confirmButtonText: "Entendido",
      });
    } finally {
      setCargando(false);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      const r = await Swal.fire({
        icon: "warning",
        title: "¿Eliminar producto?",
        text: "Esta acción no se puede deshacer.",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!r.isConfirmed) return;

      const resp = await fetch(`http://localhost:3000/inventario/eliminar/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await readMaybeJson(resp);

      if (!resp.ok) {
        throw new Error(data?.error || "Error al eliminar el producto.");
      }

      toastr.success("Producto eliminado correctamente", "Éxito");
      await obtenerInventario();
      return data;

    } catch (err) {
      console.error("❌ Error al eliminar:", err);
      await Swal.fire({
        icon: "error",
        title: "No se pudo eliminar",
        text:"Error, este producto está asociado a una o más órdenes de compra.",
        confirmButtonText: "Entendido",
      });
      throw err;
    }
  };
    useEffect(() => {
    obtenerInventario();
  }, [filtros]);

  const restaurarFiltros = () => {
    setFiltros({ nombre: "", Grupo: "", sucursal: "" });
    setSucursales(""); 
    toastr.info("Filtros restaurados");
  };

  const Agregar = () => {
    navigate(`/InsertarInventario`);
  };

  const irADetalle = (id) => {
    navigate(`/InfoInventario/${id}`);
  };

  const modificar = (id) => {
    navigate(`/ModificarInventario/${id}`);
  };

  const obtenerGrupos = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/inventario/grupos");
      const data = await readMaybeJson(respuesta);

      if (!respuesta.ok) {
        throw new Error(data?.error || "Error al obtener categorías");
      }

      setGrupo(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("Error al obtener categorías:", error);
      toastr.error("No se pudieron cargar las categorías", "Error");
    }
  };

  useEffect(() => {
    ajustarFilas();
    window.addEventListener("resize", ajustarFilas);
    (async () => {
      await Promise.all([obtenerInventario(), obtenerGrupos()]);
    })();
    return () => window.removeEventListener("resize", ajustarFilas);
  }, []);

  const totalPaginas = Math.max(Math.ceil(productos.length / filasPorPagina), 1);
  const indiceUltimaFila = paginaActual * filasPorPagina;
  const indicePrimeraFila = indiceUltimaFila - filasPorPagina;
  const productosActuales = productos.slice(indicePrimeraFila, indiceUltimaFila);

  return (
    <main className="content">
      <div className="Sup-contenedor">
        <h1 className="Tablas-header">Módulo de Inventario</h1>

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

          <input
            type="text"
            name="nombre"
            placeholder="Nombre del Producto"
            value={filtros.nombre}
            onChange={manejarCambio}
          />

          <select name="Grupo" value={filtros.Grupo} onChange={manejarCambio}>
            <option value="">Todas las categorías</option>
            {grupos.map((cat, index) => (
              <option key={index} value={cat.Grupos}>
                {cat.Grupos}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button onClick={obtenerInventario}>Buscar</button>
            <button onClick={restaurarFiltros}>Restaurar</button>
            <button onClick={Agregar}>Agregar</button>
          </div>
        </div>

        {/* Tabla */}
        {cargando ? (
          <p className="Tablas-empty">Cargando inventario…</p>
        ) : (
          <>
            <table className="Tablas-tabla">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  {sucursales !== "" && <th>Sucursal</th>}
                  <th>Grupos</th>
                  <th>Cantidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {productosActuales.length > 0 ? (
                  productosActuales.map((c) => (
                    <tr
                      key={c.ID}
                      onClick={() => irADetalle(c.ID)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{c.ID}</td>
                      <td>{c.NombreProducto}</td>
                      {sucursales !== "" && <td>{sucursales}</td>}                      
                      <td>{c.Grupos}</td>
                      <td>{c.Cantidad}</td>

                      <td className="acciones" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => modificar(c.ID)}
                          className="btn-editar"
                          title="Editar"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => eliminarProducto(c.ID)}
                          className="btn-eliminar"
                          title="Eliminar"
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
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
