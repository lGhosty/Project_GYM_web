const AgendamentoRepository = require('../repositories/AgendamentoRepository')
const UsuarioService        = require('./UsuarioService')

const STATUS_VALIDOS = ['pendente', 'confirmado', 'cancelado']

class AgendamentoService {

  async listarAgendamentos(usuarioId, isAdmin) {
    if (isAdmin) return await AgendamentoRepository.findAll()
    return await AgendamentoRepository.findByUsuarioId(usuarioId)
  }

  async criarAgendamento({ usuarioId, adminId, titulo, descricao, dataHora, tipo }) {
    if (!usuarioId || !titulo || !dataHora) {
      throw { status: 400, mensagem: 'usuario_id, titulo e data_hora são obrigatórios.' }
    }

    await UsuarioService.validarAluno(usuarioId)

    return await AgendamentoRepository.create({
      usuarioId,
      criadoPor: adminId,
      titulo,
      descricao,
      dataHora,
      tipo: tipo || 'treino',
    })
  }

  async atualizarStatus(id, status) {
    if (!STATUS_VALIDOS.includes(status)) {
      throw { status: 400, mensagem: `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}.` }
    }

    const agendamento = await AgendamentoRepository.updateStatus(id, status)
    if (!agendamento) {
      throw { status: 404, mensagem: 'Agendamento não encontrado.' }
    }
    return agendamento
  }
}

module.exports = new AgendamentoService()