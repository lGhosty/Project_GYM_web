const express                = require('express')
const router                 = express.Router()
const auth                   = require('../middlewares/authMiddleware')
const rbac                   = require('../middlewares/rbacMiddleware')
const NotificacaoController  = require('../controllers/NotificacaoController')
 
router.get('/',        auth,               (req, res) => NotificacaoController.listar(req, res))
router.post('/',       auth, rbac('admin'), (req, res) => NotificacaoController.enviar(req, res))
router.put('/:id/ler', auth,               (req, res) => NotificacaoController.marcarLida(req, res))
 
module.exports = router