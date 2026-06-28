const NotificacaoRepository = require('../repositories/NotificacaoRepository')
const UsuarioService        = require('./UsuarioService')

class NotificacaoService {

  async listarNotificacoes(usuarioId) {
    return await NotificacaoRepository.findByUsuarioId(usuarioId)
  }

  async enviarNotificacao({ usuarioId, remetenteId, titulo, mensagem }) {
    if (!usuarioId || !titulo || !mensagem) {
      throw { status: 400, mensagem: 'usuario_id, titulo e mensagem são obrigatórios.' }
    }

    await UsuarioService.validarAluno(usuarioId)

    return await NotificacaoRepository.create({ usuarioId, remetenteId, titulo, mensagem })
  }

  async marcarLida(id, usuarioId) {
    const notificacao = await NotificacaoRepository.marcarLida(id, usuarioId)
    if (!notificacao) {
      throw { status: 404, mensagem: 'Notificação não encontrada.' }
    }
    return notificacao
  }
}

module.exports = new NotificacaoService()