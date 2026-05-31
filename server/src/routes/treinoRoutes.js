const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const { listarTreinos, criarTreino } = require('../controllers/treinoController')

router.get('/',  authMiddleware, listarTreinos)
router.post('/', authMiddleware, criarTreino)

module.exports = router