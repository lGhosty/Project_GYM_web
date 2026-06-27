const UsuarioService = require('../services/UsuarioService')

class UsuarioController {

  async buscarPerfil(req, res) {
    try {
      const usuario = await UsuarioService.buscarPerfil(req.usuarioId)
      return res.json(usuario)
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' })
    }
  }

  async atualizarPerfil(req, res) {
    try {
      const usuario = await UsuarioService.atualizarPerfil(req.usuarioId, req.body)
      return res.json(usuario)
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' })
    }
  }

  async listarAlunos(req, res) {
    try {
      const alunos = await UsuarioService.listarAlunos()
      return res.json(alunos)
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' })
    }
  }
}

module.exports = new UsuarioController()