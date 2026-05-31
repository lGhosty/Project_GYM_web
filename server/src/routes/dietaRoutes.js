const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const { listarDieta, adicionarRefeicao } = require('../controllers/dietaController')

router.get('/',  authMiddleware, listarDieta)
router.post('/', authMiddleware, adicionarRefeicao)

module.exports = router