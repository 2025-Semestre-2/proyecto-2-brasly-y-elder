import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AgregarProducto() {
  const { sucursal } = useAuth(); // ← Sucursal desde el contexto

  const [proveedores, setProveedores] = useState([]);
  const [colores, setColores] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  // FORMULARIO BASE (NOMBRES EXACTOS COMO LOS PROCEDURES)
  const [form, setForm] = useState({
    stockitemname: "",
    brand: "",
    size: "",
    barcode: "",
    colorid: "",
    supplierid: "",
    unitpackageid: "",
    outerpackageid: "",
    quantityperouter: 1,
    leadtimedays: 0,
    typicalweightperunit: 0,
    ischillerstock: 0,
    marketingcomments: "",
    internalcomments: "",
    unitprice: 0,
    recommendedretailprice: null,
    taxrate: 0
  });

  // ============================
  // CARGAR CATÁLOGOS
  // ============================
  const cargarListas = async () => {
    try {
      const urls = [
        "/proveedores",
        "/colores",
        "/paquetes",
        "/grupos"
      ];

      const [p, c, pa, g] = await Promise.all(
        urls.map(u =>
          fetch("http://localhost:3000" + u).then(r => r.json())
        )
      );

      setProveedores(p);
      setColores(c);
      setPaquetes(pa);
      setGrupos(g);

    } catch (e) {
      console.error("Error cargando listas:", e);
    }
  };

  useEffect(() => { cargarListas(); }, []);


  // ============================
  // MANEJO DEL FORM
  // ============================
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value
    }));
  };

  // RESETEAR FORMULARIO
  const resetForm = () => {
    setForm({
      stockitemname: "",
      brand: "",
      size: "",
      barcode: "",
      colorid: "",
      supplierid: "",
      unitpackageid: "",
      outerpackageid: "",
      quantityperouter: 1,
      leadtimedays: 0,
      typicalweightperunit: 0,
      ischillerstock: 0,
      marketingcomments: "",
      internalcomments: "",
      unitprice: 0,
      recommendedretailprice: null,
      taxrate: 0
    });
  };


  // ============================
  // ENVIAR FORMULARIO
  // ============================
  const onSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const payload = {
        ...form,
        supplierid: Number(form.supplierid),
        unitpackageid: Number(form.unitpackageid),
        outerpackageid: Number(form.outerpackageid),
        colorid: form.colorid ? Number(form.colorid) : null,
        quantityperouter: Number(form.quantityperouter),
        leadtimedays: Number(form.leadtimedays),
        typicalweightperunit: Number(form.typicalweightperunit),
        unitprice: Number(form.unitprice),
        recommendedretailprice: form.recommendedretailprice ? Number(form.recommendedretailprice) : null,
        taxrate: Number(form.taxrate),
        ischillerstock: form.ischillerstock ? 1 : 0,
        sucursal: sucursal // ← MUY IMPORTANTE
      };

      const resp = await fetch("http://localhost:3000/inventario/insertar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();

      if (!resp.ok) throw new Error(data.error || "Error al insertar");

      alert("Producto insertado correctamente.");

      resetForm();

    } catch (err) {
      alert(err.message);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };


  // ============================================================
  //          INTERFAZ GRÁFICA CORREGIDA 100%
  // ============================================================
  return (
    <main className="content">
      <div className="Sup-contenedor">
        <form className="FormNuevoProducto" onSubmit={onSubmit}>
          <h1 className="titulo-pagina">Agregar Nuevo Producto</h1>
          <button className="boton-volver" onClick={() => navigate(-1)}>Volver</button>
          <p className="subtitulo-pagina">
            Ingrese los detalles del nuevo artículo de inventario.
          </p>

          <div className="grid-pagina">

            {/* ================= COLUMNA IZQUIERDA ================= */}
            <div className="col">

              {/* INFO BÁSICA */}
              <section className="card">
                <h2 className="card-title">Información Básica</h2>

                <div className="grid-2">
                  <div className="field">
                    <label>Nombre del Producto *</label>
                    <input
                      name="stockitemname"
                      value={form.stockitemname}
                      onChange={onChange}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Color</label>
                    <select name="colorid" value={form.colorid} onChange={onChange}>
                      <option value="">Seleccionar</option>
                      {colores.map(c =>
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="field">
                    <label>Marca</label>
                    <input name="brand" value={form.brand} onChange={onChange} />
                  </div>

                  <div className="field">
                    <label>Tamaño</label>
                    <input name="size" value={form.size} onChange={onChange} />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="field">
                    <label>Código de Barras</label>
                    <input name="barcode" value={form.barcode} onChange={onChange} />
                  </div>

                  <div className="field">
                    <label>Grupo</label>
                    <select name="grupo" onChange={onChange}>
                      <option value="">Seleccionar</option>
                      {grupos.map(g =>
                        <option key={g.id} value={g.id}>{g.nombre}</option>
                      )}
                    </select>
                  </div>
                </div>
              </section>

              {/* PROVEEDOR & EMPAQUE */}
              <section className="card">
                <h2 className="card-title">Proveedor y Empaque</h2>

                <div className="field">
                  <label>Proveedor *</label>
                  <select
                    name="supplierid"
                    value={form.supplierid}
                    onChange={onChange}
                    required
                  >
                    <option value="">Seleccionar proveedor</option>
                    {proveedores.map(p =>
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    )}
                  </select>
                </div>

                <div className="grid-2">
                  <div className="field">
                    <label>Paquete Unitario *</label>
                    <select
                      name="unitpackageid"
                      value={form.unitpackageid}
                      onChange={onChange}
                      required
                    >
                      <option value="">Seleccionar</option>
                      {paquetes.map(p =>
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                      )}
                    </select>
                  </div>

                  <div className="field">
                    <label>Paquete Exterior *</label>
                    <select
                      name="outerpackageid"
                      value={form.outerpackageid}
                      onChange={onChange}
                      required
                    >
                      <option value="">Seleccionar</option>
                      {paquetes.map(p =>
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="field">
                    <label>Cantidad Exterior *</label>
                    <input type="number"
                      name="quantityperouter"
                      value={form.quantityperouter}
                      onChange={onChange}
                      min="1"
                    />
                  </div>

                  <div className="field">
                    <label>Lead Time (días)</label>
                    <input type="number"
                      name="leadtimedays"
                      value={form.leadtimedays}
                      onChange={onChange}
                      min="0"
                    />
                  </div>
                </div>
              </section>

              {/* PRECIOS */}
              <section className="card">
                <h2 className="card-title">Precios e Impuestos</h2>

                <div className="grid-3">
                  <div className="field">
                    <label>Precio Unitario *</label>
                    <input
                      type="number"
                      name="unitprice"
                      step="0.01"
                      value={form.unitprice}
                      onChange={onChange}
                    />
                  </div>

                  <div className="field">
                    <label>Precio Venta</label>
                    <input
                      type="number"
                      name="recommendedretailprice"
                      step="0.01"
                      value={form.recommendedretailprice || ""}
                      onChange={onChange}
                    />
                  </div>

                  <div className="field">
                    <label>Impuesto *</label>
                    <input
                      type="number"
                      name="taxrate"
                      step="0.001"
                      value={form.taxrate}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* ================ COLUMNA DERECHA ================ */}
            <div className="col">

              {/* PROPIEDADES FÍSICAS */}
              <section className="card">
                <h2 className="card-title">Propiedades Físicas</h2>

                <div className="field">
                  <label>Peso Unitario *</label>
                  <input
                    type="number"
                    name="typicalweightperunit"
                    step="0.001"
                    value={form.typicalweightperunit}
                    onChange={onChange}
                  />
                </div>

                <div className="checkline">
                  <input
                    type="checkbox"
                    name="ischillerstock"
                    checked={form.ischillerstock === 1}
                    onChange={onChange}
                  />
                  <label>Requiere Refrigeración</label>
                </div>
              </section>


              {/* COMENTARIOS */}
              <section className="card">
                <h2 className="card-title">Información Adicional</h2>

                <div className="field">
                  <label>Marketing</label>
                  <textarea
                    name="marketingcomments"
                    rows={4}
                    value={form.marketingcomments}
                    onChange={onChange}
                  />
                </div>

                <div className="field">
                  <label>Comentarios Internos</label>
                  <textarea
                    name="internalcomments"
                    rows={3}
                    value={form.internalcomments}
                    onChange={onChange}
                  />
                </div>
              </section>
            </div>
          </div>

          <div className="acciones">
            <button type="submit" disabled={cargando} className="btn-primario">
              {cargando ? "Guardando..." : "Guardar Producto"}
            </button>

            <button type="button" onClick={resetForm} className="btn-secundario">
              Resetear Formulario
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}
