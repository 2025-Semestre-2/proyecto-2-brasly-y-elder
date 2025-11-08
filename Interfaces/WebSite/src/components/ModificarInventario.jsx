import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { useNavigate } from "react-router-dom";


toastr.options = {
  closeButton: true,
  progressBar: true,
  newestOnTop: true,
  positionClass: "toast-bottom-right",
  timeOut: 4000,
  extendedTimeOut: 2000,
  preventDuplicates: true,
};

export default function EditarProducto() {
  const { id } = useParams();
  const stockItemId = useMemo(() => Number(id), [id]);

  const [proveedores, setProveedores] = useState([]);
  const [colores, setColores] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    StockItemName: "",
    Brand: "",
    Size: "",
    Barcode: "",
    ColorID: "",
    SupplierID: "",
    UnitPackageID: "",
    OuterPackageID: "",
    QuantityPerOuter: 1,
    LeadTimeDays: 0,
    TypicalWeightPerUnit: 0,
    IsChillerStock: 0,
    MarketingComments: "",
    InternalComments: "",
    UnitPrice: 0,
    RecommendedRetailPrice: 0,
    TaxRate: 0
  });

  const readMaybeJson = async (resp) => {
    const ct = resp.headers.get("content-type") || "";
    if (ct.includes("application/json")) return await resp.json();
    const text = await resp.text();
    try { return JSON.parse(text); } catch { return { error: text }; }
  };

  const cargarListas = async () => {
    const [prov, col, paq] = await Promise.all([
      fetch("http://localhost:3000/proveedores/lista").then(r => r.json()),
      fetch("http://localhost:3000/colores/lista").then(r => r.json()),
      fetch("http://localhost:3000/paquetes/lista").then(r => r.json())
    ]);
    setProveedores(prov);
    setColores(col);
    setPaquetes(paq);
  };

  const cargarProducto = async () => {
    const resp = await fetch(`http://localhost:3000/inventario/Producto?id=${stockItemId}`);
    const data = await readMaybeJson(resp);
    if (!resp.ok) throw new Error(data?.error || "No se pudo cargar el producto");
    const row = data;

    setForm({
      StockItemName: row.StockItemName ?? "",
      Brand: row.Brand ?? "",
      Size: row.Size ?? "",
      Barcode: row.Barcode ?? "",
      ColorID: row.ColorID ?? "",
      SupplierID: row.SupplierID ?? "",
      UnitPackageID: row.UnitPackageID ?? "",
      OuterPackageID: row.OuterPackageID ?? "",
      QuantityPerOuter: row.QuantityPerOuter ?? 1,
      LeadTimeDays: row.LeadTimeDays ?? 0,
      TypicalWeightPerUnit: row.TypicalWeightPerUnit ?? 0,
      IsChillerStock: row.IsChillerStock ? 1 : 0,
      MarketingComments: row.MarketingComments ?? "",
      InternalComments: row.InternalComments ?? "",
      UnitPrice: row.UnitPrice ?? 0,
      RecommendedRetailPrice: row.RecommendedRetailPrice ?? 0,
      TaxRate: row.TaxRate ?? 0
    });
  };

  useEffect(() => {
    (async () => {
      try {
        if (!stockItemId || Number.isNaN(stockItemId)) throw new Error("ID inválido");
        await Promise.all([cargarListas(), cargarProducto()]);
        toastr.info("Producto cargado", "Listo");
      } catch (e) {
        console.error(e);
        await Swal.fire({
          icon: "error",
          title: "No se pudo cargar",
          text: e.message || "Error desconocido al cargar el producto",
          confirmButtonText: "Entendido",
        });
      } finally {
        setCargandoInicial(false);
      }
    })();
  }, [stockItemId]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? (checked ? 1 : 0) : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const payload = {
        ...form,
        QuantityPerOuter: Number(form.QuantityPerOuter) || 1,
        LeadTimeDays: Number(form.LeadTimeDays) || 0,
        TypicalWeightPerUnit: Number(form.TypicalWeightPerUnit) || 0,
        IsChillerStock: form.IsChillerStock ? 1 : 0,
        UnitPrice: Number(form.UnitPrice) || 0,
        RecommendedRetailPrice:
          form.RecommendedRetailPrice === "" ? null : Number(form.RecommendedRetailPrice),
        TaxRate: Number(form.TaxRate) || 0,
        ColorID: form.ColorID === "" ? null : Number(form.ColorID),
        SupplierID: Number(form.SupplierID),
        UnitPackageID: Number(form.UnitPackageID),
        OuterPackageID: Number(form.OuterPackageID),
      };

      const resp = await fetch(`http://localhost:3000/inventario/modificar/${stockItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await readMaybeJson(resp);
      if (!resp.ok) throw new Error(data?.error || "Error al actualizar");

      toastr.success("Producto actualizado correctamente", "Éxito");
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        title: "No se pudo guardar",
        text: err.message || "Error desconocido al actualizar",
        confirmButtonText: "Reintentar",
      });
    } finally {
      setCargando(false);
    }
  };

  if (cargandoInicial) {
    return (
      <main className="content">
        <div className="Sup-contenedor">
          <p>Cargando producto...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="content">
      <div className="Sup-contenedor">
        <button className="boton-volver" onClick={() => navigate(-1)}>Volver</button>
        <form className="FormNuevoProducto" onSubmit={onSubmit}>
          <h1 className="titulo-pagina">Editar Producto (ID: {stockItemId})</h1>
          <p className="subtitulo-pagina">Modifique los campos necesarios y guarde los cambios.</p>

          <div className="grid-pagina">
            <div className="col">
              <section className="card">
                <h2 className="card-title">Información Básica</h2>
                <p className="card-desc">Detalles esenciales del producto e identificación</p>

                <div className="grid-2">
                  <div className="field">
                    <label>Nombre del Producto *</label>
                    <input name="StockItemName" value={form.StockItemName} onChange={onChange} required />
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
                    <input name="Brand" value={form.Brand} onChange={onChange} />
                  </div>
                  <div className="field">
                    <label>Tamaño</label>
                    <input name="Size" value={form.Size} onChange={onChange} />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="field">
                    <label>Código de Barras</label>
                    <input name="Barcode" value={form.Barcode} onChange={onChange} />
                  </div>
                  <div className="field">
                    <label>Proveedor *</label>
                    <select name="SupplierID" value={form.SupplierID} onChange={onChange} required>
                      <option value="">Seleccionar proveedor</option>
                      {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                  </div>
                </div>
              </section>

              <section className="card">
                <h2 className="card-title">Empaque</h2>
                <p className="card-desc">Configuraciones de empaque</p>

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

            <div className="col">
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

              <section className="card">
                <h2 className="card-title">Información Adicional</h2>
                <p className="card-desc">Notas de marketing e internas opcionales</p>

                <div className="field">
                  <label>Comentarios de Marketing</label>
                  <textarea name="MarketingComments" rows={6} value={form.MarketingComments} onChange={onChange} placeholder="Descripciones de marketing, características, beneficios..." />
                </div>

                <div className="field">
                  <label>Notas Internas</label>
                  <textarea name="InternalComments" rows={5} value={form.InternalComments} onChange={onChange} placeholder="Notas internas, instrucciones de manejo..." />
                </div>
              </section>
            </div>
          </div>

          <div className="acciones">
            <button type="submit" disabled={cargando} className="btn-primario">
              {cargando ? "Guardando cambios..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
