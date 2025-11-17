const router = require('express').Router();
const auth = require('../middlewares/auth');
const sucursal = require('../middlewares/sucursal');
const ctrl = require('../controllers/clientes.controller');

router.get('/', auth, sucursal, ctrl.listar);
router.get('/detalle', auth, sucursal, ctrl.detalle);

module.exports = router;
