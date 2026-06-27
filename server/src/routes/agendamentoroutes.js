const express                = require('express')
const router                 = express.Router()
const auth                   = require('../middlewares/authMiddleware')
const rbac                   = require('../middlewares/rbacMiddleware')
const AgendamentoController  = require('../controllers/AgendamentoController')
 
router.get('/',      auth,               (req, res) => AgendamentoController.listar(req, res))
router.post('/',     auth, rbac('admin'), (req, res) => AgendamentoController.criar(req, res))
router.put('/:id',   auth,               (req, res) => AgendamentoController.atualizarStatus(req, res))
 
module.exports = router
 