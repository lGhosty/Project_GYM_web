const express          = require('express')
const router           = express.Router()
const auth             = require('../middlewares/authMiddleware')
const rbac             = require('../middlewares/rbacMiddleware')
const DietaController  = require('../controllers/DietaController')

router.get('/',       auth,               (req, res) => DietaController.listar(req, res))
router.post('/',      auth, rbac('admin'), (req, res) => DietaController.adicionar(req, res))
router.delete('/:id', auth,               (req, res) => DietaController.deletar(req, res))

module.exports = router