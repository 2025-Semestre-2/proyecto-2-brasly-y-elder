import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import ModuloCliente from "./components/ModuloCliente";
import InfoClientes from "./components/InfoClientes";
import ModuloProveedor from "./components/ModuloProveedor";
import InfoProveeder from "./components/InfoProveeder";
import ModuloInventario from "./components/ModuloInventario";
import InfoInventario from "./components/InfoInventario";
import ModuloVentas from "./components/ModuloVentas";
import InfoVenta from "./components/InfoVenta";
import EstadisticaProveedor from "./components/EstadisticaProveedor";
import EstadisticaVentas from "./components/EstadisticaVentas";
import TopClientes from "./components/TopClientes";
import TopProductos from "./components/TopProductos";
import TopProveedores from "./components/TopProveedores";
import InsertarInventario from "./components/InsertarInventario";
import ModificarInventario from "./components/ModificarInventario";

import "./styles/base.css";
import "./styles/layout.css";
import "./styles/overrides.css";
import "./styles/components.css";

export default function App() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Router>
      <div className="app-layout">
        <Sidebar onCollapse={setCollapsed} />
        <div className={`right-section ${collapsed ? "collapsed" : "expanded"}`}>
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/ModuloCliente" element={<ModuloCliente />} />
            <Route path="/InfoClientes/:id" element={<InfoClientes />} />
            <Route path="/ModuloProveedor" element={<ModuloProveedor />} />
            <Route path="/InfoProveeder/:id" element={<InfoProveeder />} />
            <Route path="/ModuloInventario" element={<ModuloInventario />} />
            <Route path="/InfoInventario/:id" element={<InfoInventario />} />
            <Route path="/ModuloVentas" element={<ModuloVentas />} />
            <Route path="/InfoVenta/:id" element={<InfoVenta />} />
            <Route path="/EstadisticaProveedor" element={<EstadisticaProveedor />} />
            <Route path="/EstadisticaVentas" element={<EstadisticaVentas />} />
            <Route path="/TopClientes" element={<TopClientes />} />
            <Route path="/TopProductos" element={<TopProductos />} />
            <Route path="/TopProveedores" element={<TopProveedores />} />
            <Route path="/InsertarInventario" element={<InsertarInventario />} />
            <Route path="/ModificarInventario/:id" element={<ModificarInventario />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
