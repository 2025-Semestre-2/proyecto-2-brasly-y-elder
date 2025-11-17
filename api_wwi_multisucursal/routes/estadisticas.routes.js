const router = require("express").Router();
const auth = require("../middlewares/auth");
const roles = require("../middlewares/roles");
const sucursal = require("../middlewares/sucursal");
const ctrl = require("../controllers/estadisticas.controller");

// SOLO CORPORATIVO
router.get("/top-productos", auth, roles("corporativo"), sucursal, ctrl.topProductos);
router.get("/top-clientes", auth, roles("corporativo"), sucursal, ctrl.topClientes);
router.get("/ventas-mes", auth, roles("corporativo"), sucursal, ctrl.ventasPorMes);
router.get("/ventas-categoria", auth, roles("corporativo"), sucursal, ctrl.ventasPorCategoria);

module.exports = router;
