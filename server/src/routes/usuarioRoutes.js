const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const { verPerfil, atualizarPerfil } = require('../controllers/usuarioController')

router.get('/perfil',  authMiddleware, verPerfil)
router.put('/perfil',  authMiddleware, atualizarPerfil)

module.exports = router