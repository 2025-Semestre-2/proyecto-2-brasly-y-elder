const router = require('express').Router();
const auth = require('../middlewares/auth');
const sucursal = require('../middlewares/sucursal');
const ctrl = require('../controllers/ventas.controller');

router.get('/', auth, sucursal, ctrl.listar);

module.exports = router;
