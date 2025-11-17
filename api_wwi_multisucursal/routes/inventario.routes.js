const router = require("express").Router();
const auth = require("../middlewares/auth");
const sucursal = require("../middlewares/sucursal");
const ctrl = require("../controllers/inventario.controller");

// LISTADOS
router.get("/", auth, sucursal, ctrl.listado);

// DETALLE
router.get("/detalle", auth, sucursal, ctrl.detalle);

// CRUD
router.post("/", auth, sucursal, ctrl.insertar);
router.put("/:id", auth, sucursal, ctrl.actualizar);
router.delete("/:id", auth, sucursal, ctrl.eliminar);

module.exports = router;
