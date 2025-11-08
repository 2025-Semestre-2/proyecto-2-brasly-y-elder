import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  FaBars,
  FaUsers,
  FaTruck,
  FaShoppingCart,
  FaBoxes,
  FaChartBar,
  FaChartPie,
  FaCrown,
  FaMedal,
  FaChartLine,
} from "react-icons/fa";
import { Link } from "react-router-dom"; 
import "react-pro-sidebar/dist/css/styles.css";
import "../styles/base.css";
import "../styles/layout.css";
import "../styles/overrides.css";
import "../styles/components.css";

export default function Sidebar({ onCollapse }) {
  const [collapsed, setCollapsed] = useState(true);
  const handleToggle = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onCollapse(newState);
  };

  return (
    <>
      <ProSidebar
        collapsed={collapsed}
        className={`custom-sidebar ${collapsed ? "collapsed" : "expanded"}`}
        style={{ height: "98vh" }}
      >
        <Menu iconShape="square">
          <MenuItem icon={<FaBars />} onClick={handleToggle}>
            {collapsed ? "Abrir" : "Cerrar"}
          </MenuItem>
          <MenuItem icon={<FaUsers />}>
            <Link to="/ModuloCliente">Cliente</Link>
          </MenuItem>
          <MenuItem icon={<FaTruck />}>
            <Link to="/ModuloProveedor">Proveedores</Link>
          </MenuItem>
          <MenuItem icon={<FaBoxes />}>
            <Link to="/ModuloInventario">Inventario</Link>
          </MenuItem>
          <MenuItem icon={<FaShoppingCart />}>
            <Link to="/ModuloVentas">Ventas</Link>
          </MenuItem>
          <MenuItem icon={<FaChartBar />}>
            <Link to="/EstadisticaProveedor">Estadística Proveedores</Link>
          </MenuItem>
          <MenuItem icon={<FaChartPie />}>
            <Link to="/EstadisticaVentas">Estadística Ventas</Link>
          </MenuItem>
          <MenuItem icon={<FaCrown />}>
            <Link to="/TopClientes">Top Clientes</Link>
          </MenuItem>
          <MenuItem icon={<FaMedal />}>
            <Link to="/TopProductos">Top Productos</Link>
          </MenuItem>
          <MenuItem icon={<FaChartLine />}>
            <Link to="/TopProveedores">Top Proveedores</Link>
          </MenuItem>
        </Menu>
      </ProSidebar>
      {!collapsed && <div className="overlay" onClick={handleToggle}></div>}
    </>
  );
}



