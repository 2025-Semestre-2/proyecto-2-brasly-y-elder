import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function ModuloVentas() {
  const [filtros, setFiltros] = useState({
    nombre: "",
    fechamin: "",
    fechamax: "",
    montomin: "",
    montomax: "",
  });
  const [cargando, setCargando] = useState(false);
  const [facturas, setFacturas] = useState([]);

  // Paginación dinámica
  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(5);

  // Validaciones simples
  const errores = useMemo(() => {
    const errs = {};

    if (filtros.fechamin && !/^\d{4}-\d{2}-\d{2}$/.test(filtros.fechamin)) {
      errs.fechamin = "Formato AAAA-MM-DD";
    }
    if (filtros.fechamax && !/^\d{4}-\d{2}-\d{2}$/.test(filtros.fechamax)) {
      errs.fechamax = "Formato AAAA-MM-DD";
    }
    if (filtros.fechamin && filtros.fechamax && filtros.fechamin > filtros.fechamax) {
      errs.rangoFecha = "La fecha mínima no puede ser mayor que la máxima";
    }

    if (filtros.montomin && !/^\d+$/.test(filtros.montomin)) {
      errs.montomin = "Solo números enteros";
    }
    if (filtros.montomax && !/^\d+$/.test(filtros.montomax)) {
      errs.montomax = "Solo números enteros";
    }
    if (
      filtros.montomin && filtros.montomax &&
      parseInt(filtros.montomin, 10) > parseInt(filtros.montomax, 10)
    ) {
      errs.rangoMonto = "El monto mínimo no puede ser mayor que el máximo";
    }

    return errs;
  }, [filtros]);

  // Ajustar filas por página según el alto disponible
  const ajustarFilas = () => {
    const alturaDisponible = window.innerHeight * 0.65;
    const altoFila = 40;
    const filas = Math.max(Math.floor(alturaDisponible / altoFila), 1);
    setFilasPorPagina(filas);
  };

  // Handlers de entrada
  const manejarCambioTexto = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const manejarCambioEntero = (e) => {
    const { name, value } = e.target;
    // Solo dígitos; elimina cualquier carácter no numérico
    const soloDigitos = value.replace(/\D/g, "");
    setFiltros((prev) => ({ ...prev, [name]: soloDigitos }));
  };

  const manejarCambioFecha = (e) => {
    const { name, value } = e.target; // type="date" ya retorna AAAA-MM-DD
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const restaurarFiltros = () => {
    setFiltros({ nombre: "", fechamin: "", fechamax: "", montomin: "", montomax: "" });
    obtenerFacturas();
  };

  const navigate = useNavigate();
  const irADetalle = (id) => {
    navigate(`/InfoVenta/${id}`);
  };

  useEffect(() => {
    obtenerFacturas();
    ajustarFilas();
    window.addEventListener("resize", ajustarFilas);
    return () => window.removeEventListener("resize", ajustarFilas);
  }, []);

  const obtenerFacturas = async () => {
    setCargando(true);
    try {
      // Construimos los params omitiendo vacíos para que el API use defaults / NULL
      const params = new URLSearchParams();
      if (filtros.nombre) params.set("nombre_cliente", filtros.nombre);
      if (filtros.fechamin) params.set("fecha_inicio", filtros.fechamin); // AAAA-MM-DD
      if (filtros.fechamax) params.set("fecha_fin", filtros.fechamax);
      if (filtros.montomin) params.set("monto_min", filtros.montomin);
      if (filtros.montomax) params.set("monto_max", filtros.montomax);

      const respuesta = await fetch(`http://localhost:3000/ventas?${params.toString()}`);
      if (!respuesta.ok) throw new Error("Respuesta no OK del servidor");
      const data = await respuesta.json();
      setFacturas(Array.isArray(data) ? data : []);
      setPaginaActual(1);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      setFacturas([]);
    } finally {
      setCargando(false);
    }
  };

  // Calcular filas visibles según la página
  const indiceUltimaFila = paginaActual * filasPorPagina;
  const indicePrimeraFila = indiceUltimaFila - filasPorPagina;
  const filasVisibles = facturas.slice(indicePrimeraFila, indiceUltimaFila);
  const totalPaginas = Math.max(1, Math.ceil((facturas.length || 0) / filasPorPagina));

  const hayErrores = Object.keys(errores).length > 0;

  return (
    <main className="content">
      <div className="Sup-contenedor">
        <h1 className="Tablas-header">Módulo de Ventas</h1>

        {/* Filtros */}
        <div className="Tablas-filtros">
          <input type="text" name="nombre" placeholder="Nombre del Cliente" value={filtros.nombre} onChange={manejarCambioTexto} />
          <input type="date" name="fechamin" placeholder="Fecha mínima (AAAA-MM-DD)" value={filtros.fechamin} onChange={manejarCambioFecha} />
          <input type="date" name="fechamax" placeholder="Fecha máxima (AAAA-MM-DD)" value={filtros.fechamax} onChange={manejarCambioFecha} />
          <input type="text" inputMode="numeric" pattern="\\d*" name="montomin" placeholder="Monto mínimo (entero)" value={filtros.montomin} onChange={manejarCambioEntero} />
          <input type="text" inputMode="numeric" pattern="\\d*" name="montomax" placeholder="Monto máximo (entero)" value={filtros.montomax} onChange={manejarCambioEntero} />


          <div className="flex gap-2">
            <button onClick={obtenerFacturas} disabled={hayErrores}>
              Buscar
            </button>
            <button onClick={restaurarFiltros}>Restaurar</button>
          </div>
        </div>

        {/* Mensajes de validación */}
        {hayErrores && (
          <div className="Tablas-errores" style={{ color: "#b91c1c", marginTop: 8 }}>
            {Object.values(errores).map((msg, i) => (
              <div key={i}>• {msg}</div>
            ))}
          </div>
        )}

        {/* Tabla */}
        {cargando ? (
          <p className="Tablas-empty">Cargando ventas…</p>
        ) : (
          <>
            <table className="Tablas-tabla">
              <thead>
                <tr>
                  <th>Número de factura</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Método de entrega</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {filasVisibles.length > 0 ? (
                  filasVisibles.map((c) => (
                    <tr
                      key={c.numero_factura}
                      onClick={() => irADetalle(c.numero_factura)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{c.numero_factura}</td>
                      <td>{c.fecha}</td>
                      <td>{c.cliente}</td>
                      <td>{c.metodo_entrega}</td>
                      <td>{c.monto}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
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
