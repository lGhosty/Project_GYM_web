const express           = require('express')
const router            = express.Router()
const auth              = require('../middlewares/authMiddleware')
const rbac              = require('../middlewares/rbacMiddleware')
const TreinoController  = require('../controllers/TreinoController')

router.get('/',       auth,               (req, res) => TreinoController.listar(req, res))
router.post('/',      auth, rbac('admin'), (req, res) => TreinoController.criar(req, res))
router.put('/:id',    auth, rbac('admin'), (req, res) => TreinoController.editar(req, res))
router.delete('/:id', auth, rbac('admin'), (req, res) => TreinoController.deletar(req, res))

module.exports = router