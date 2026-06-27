const AgendamentoService = require('../services/AgendamentoService')

class AgendamentoController {

  async listar(req, res) {
    try {
      const isAdmin = req.usuarioRole === 'admin'
      const agendamentos = await AgendamentoService.listarAgendamentos(req.usuarioId, isAdmin)
      return res.json(agendamentos)
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' })
    }
  }

  async criar(req, res) {
    try {
      const { usuario_id, titulo, descricao, data_hora, tipo } = req.body
      const agendamento = await AgendamentoService.criarAgendamento({
        usuarioId: usuario_id,
        adminId:   req.usuarioId,
        titulo,
        descricao,
        dataHora:  data_hora,
        tipo,
      })
      return res.status(201).json(agendamento)
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' })
    }
  }

  async atualizarStatus(req, res) {
    try {
      const agendamento = await AgendamentoService.atualizarStatus(req.params.id, req.body.status)
      return res.json(agendamento)
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' })
    }
  }
}

module.exports = new AgendamentoController()