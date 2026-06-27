const DietaRepository = require('../repositories/DietaRepository')
const UsuarioService  = require('./UsuarioService')

class DietaService {

  async listarDieta(usuarioId) {
    const refeicoes = await DietaRepository.findByUsuarioId(usuarioId)
    const totalCalorias = refeicoes.reduce((soma, r) => soma + (r.calorias || 0), 0)
    return { refeicoes, total_calorias: totalCalorias }
  }

  async adicionarRefeicao({ usuarioId, adminId, nome, descricao, horario, calorias }) {
    if (!usuarioId || !nome) {
      throw { status: 400, mensagem: 'usuario_id e nome são obrigatórios.' }
    }

    await UsuarioService.validarAluno(usuarioId)

    return await DietaRepository.create({
      usuarioId,
      criadoPor: adminId,
      nome,
      descricao,
      horario,
      calorias,
    })
  }

  async deletarRefeicao(id, usuarioId, isAdmin) {
    const refeicao = await DietaRepository.delete(id, usuarioId, isAdmin)
    if (!refeicao) {
      throw { status: 404, mensagem: 'Refeição não encontrada.' }
    }
    return refeicao
  }
}

module.exports = new DietaService()