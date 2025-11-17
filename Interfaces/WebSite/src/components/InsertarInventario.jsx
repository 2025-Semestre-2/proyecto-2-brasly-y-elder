import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AgregarProducto() {
  const { sucursal } = useAuth(); // ← Sucursal del usuario

  const [proveedores, setProveedores] = useState([]);
  const [colores, setColores] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

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

  const cargarListas = async () => {
    try {
      const urls = [
        "/proveedores",
        "/colores",
        "/paquetes",
        "/grupos"
      ];

      const [p, c, pa, g] = await Promise.all(
        urls.map(u => fetch("http://localhost:3000" + u).then(r => r.json()))
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

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value
    }));
  };

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
        ischillerstock: form.ischillerstock ? 1 : 0 ,
        sucursal: sucursal  // ← MANDAR LA SUCURSAL
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

    return (
    <main className="content">
      <div className="Sup-contenedor">
        <form className="FormNuevoProducto" onSubmit={onSubmit}>
          <h1 className="titulo-pagina">Agregar Nuevo Producto</h1>
           <button className="boton-volver" onClick={() => navigate(-1)}>Volver</button>
          <p className="subtitulo-pagina">
            Ingrese los detalles del nuevo artículo de inventario. Los campos requeridos están marcados con asterisco.
          </p>

          <div className="grid-pagina">
            {/* Columna Izquierda */}
            <div className="col">
              {/* Información Básica */}
              <section className="card">
                <h2 className="card-title">Información Básica</h2>
                <p className="card-desc">Detalles esenciales del producto e identificación</p>

                <div className="grid-2">
                  <div className="field">
                    <label>Nombre del Producto *</label>
                    <input name="StockItemName" value={form.StockItemName} onChange={onChange} placeholder="ej., Camiseta de Algodón Premium" required />
                  </div>
                  <div className="field">
                    <label>Color</label>
                    <select name="ColorID" value={form.ColorID} onChange={onChange}>
                      <option value="">Seleccionar color</option>
                      {colores.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="field">
                    <label>Marca</label>
                    <input name="Brand" value={form.Brand} onChange={onChange} placeholder="ej., Nike" />
                  </div>
                  <div className="field">
                    <label>Tamaño</label>
                    <input name="Size" value={form.Size} onChange={onChange} placeholder="ej., XL, 42, 250ml" />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="field">
                    <label>Código de Barras</label>
                    <input name="Barcode" value={form.Barcode} onChange={onChange} placeholder="ej., 1234567890123" />
                  </div>
                  <div className="field">
                    <label>Grupo de Producto</label>
                    <select name="GrupoID" value={form.GrupoID} onChange={onChange}>
                      <option value="">Seleccionar grupo</option>
                      {grupos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                    </select>
                  </div>
                </div>
              </section>

              {/* Proveedor y Empaque */}
              <section className="card">
                <h2 className="card-title">Proveedor y Empaque</h2>
                <p className="card-desc">Detalles del proveedor y configuraciones de empaque</p>

                <div className="field">
                  <label>Proveedor *</label>
                  <select name="SupplierID" value={form.SupplierID} onChange={onChange} required>
                    <option value="">Seleccionar proveedor</option>
                    {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>

                <div className="grid-2">
                  <div className="field">
                    <label>Paquete Unitario *</label>
                    <select name="UnitPackageID" value={form.UnitPackageID} onChange={onChange} required>
                      <option value="">Seleccionar paquete unitario</option>
                      {paquetes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Paquete Exterior *</label>
                    <select name="OuterPackageID" value={form.OuterPackageID} onChange={onChange} required>
                      <option value="">Seleccionar paquete exterior</option>
                      {paquetes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="field">
                    <label>Cantidad por Exterior *</label>
                    <input type="number" min="1" name="QuantityPerOuter" value={form.QuantityPerOuter} onChange={onChange} />
                  </div>
                  <div className="field">
                    <label>Tiempo de Entrega (Días) *</label>
                    <input type="number" min="0" name="LeadTimeDays" value={form.LeadTimeDays} onChange={onChange} />
                  </div>
                </div>
              </section>

              {/* Precios e Impuestos */}
              <section className="card">
                <h2 className="card-title">Precios e Impuestos</h2>
                <p className="card-desc">Información de costos y precios</p>

                <div className="grid-3">
                  <div className="field">
                    <label>Precio Unitario ($) *</label>
                    <input type="number" step="0.01" min="0" name="UnitPrice" value={form.UnitPrice} onChange={onChange} required />
                  </div>
                  <div className="field">
                    <label>Precio de Venta ($)</label>
                    <input type="number" step="0.01" min="0" name="RecommendedRetailPrice" value={form.RecommendedRetailPrice} onChange={onChange} />
                  </div>
                  <div className="field">
                    <label>Tasa de Impuesto (%) *</label>
                    <input type="number" step="0.001" min="0" name="TaxRate" value={form.TaxRate} onChange={onChange} required />
                  </div>
                </div>
              </section>
            </div>

            {/* Columna Derecha */}
            <div className="col">
              {/* Propiedades Físicas */}
              <section className="card">
                <h2 className="card-title">Propiedades Físicas</h2>
                <p className="card-desc">Peso y requisitos de almacenamiento</p>

                <div className="field">
                  <label>Peso por Unidad (kg) *</label>
                  <input type="number" step="0.001" min="0" name="TypicalWeightPerUnit" value={form.TypicalWeightPerUnit} onChange={onChange} required />
                </div>

                <div className="checkline">
                  <input id="IsChillerStock" type="checkbox" name="IsChillerStock" checked={!!form.IsChillerStock} onChange={onChange} />
                  <label htmlFor="IsChillerStock">Requiere Refrigeración</label>
                </div>
              </section>

              {/* Información Adicional */}
              <section className="card">
                <h2 className="card-title">Información Adicional</h2>
                <p className="card-desc">Notas de marketing e internas opcionales</p>

                <div className="field">
                  <label>Comentarios de Marketing</label>
                  <textarea name="MarketingComments" rows={6} value={form.MarketingComments} onChange={onChange} placeholder="Ingrese descripciones de marketing, características, beneficios..." />
                </div>

                <div className="field">
                  <label>Notas Internas</label>
                  <textarea name="InternalComments" rows={5} value={form.InternalComments} onChange={onChange} placeholder="Ingrese notas internas, instrucciones de manejo..." />
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
