const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const controller = require("../controllers/clientes.controller");

// Todas estas rutas requieren token
router.get("/", auth, controller.listarClientes);
router.get("/:id", auth, controller.detalleCliente);

module.exports = router;
