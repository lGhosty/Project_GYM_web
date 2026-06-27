const express        = require('express')
const router         = express.Router()
const AuthController = require('../controllers/AuthController')

router.post('/cadastro', (req, res) => AuthController.cadastrar(req, res))
router.post('/login',    (req, res) => AuthController.login(req, res))

module.exports = router