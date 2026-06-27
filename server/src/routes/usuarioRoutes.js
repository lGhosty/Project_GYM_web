const express             = require('express')
const router              = express.Router()
const auth                = require('../middlewares/authMiddleware')
const rbac                = require('../middlewares/rbacMiddleware')
const UsuarioController   = require('../controllers/UsuarioController')

router.get('/perfil',  auth,               (req, res) => UsuarioController.buscarPerfil(req, res))
router.put('/perfil',  auth,               (req, res) => UsuarioController.atualizarPerfil(req, res))
router.get('/alunos',  auth, rbac('admin'), (req, res) => UsuarioController.listarAlunos(req, res))

module.exports = router