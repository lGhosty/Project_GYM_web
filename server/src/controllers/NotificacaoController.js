const NotificacaoService = require('../services/NotificacaoService')

class NotificacaoController {

  async listar(req, res) {
    try {
      const notificacoes = await NotificacaoService.listarNotificacoes(req.usuarioId)
      return res.json(notificacoes)
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' })
    }
  }

  async enviar(req, res) {
    try {
      const { usuario_id, titulo, mensagem } = req.body
      const notificacao = await NotificacaoService.enviarNotificacao({
        usuarioId:   usuario_id,
        remetenteId: req.usuarioId,
        titulo,
        mensagem,
      })
      return res.status(201).json(notificacao)
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' })
    }
  }

  async marcarLida(req, res) {
    try {
      const notificacao = await NotificacaoService.marcarLida(req.params.id, req.usuarioId)
      return res.json(notificacao)
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' })
    }
  }
}

module.exports = new NotificacaoController()