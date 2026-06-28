const AuthService = require('../services/AuthService')

class AuthController {

  async cadastrar(req, res) {
    try {
      const resultado = await AuthService.cadastrar(req.body)
      return res.status(201).json(resultado)
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno do servidor.' })
    }
  }

  async login(req, res) {
    try {
      const resultado = await AuthService.login(req.body)
      return res.json(resultado)
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno do servidor.' })
    }
  }
}

module.exports = new AuthController()