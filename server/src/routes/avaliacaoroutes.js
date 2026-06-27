const express              = require('express')
const router               = express.Router()
const auth                 = require('../middlewares/authMiddleware')
const rbac                 = require('../middlewares/rbacMiddleware')
const AvaliacaoController  = require('../controllers/AvaliacaoController')
 
router.get('/',  auth,               (req, res) => AvaliacaoController.listar(req, res))
router.post('/', auth, rbac('admin'), (req, res) => AvaliacaoController.criar(req, res))
 
module.exports = router