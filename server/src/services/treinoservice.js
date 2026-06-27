const TreinoRepository  = require('../repositories/TreinoRepository')
const UsuarioService    = require('./UsuarioService')

class TreinoService {

  async listarTreinos(usuarioId) {
    return await TreinoRepository.findByUsuarioId(usuarioId)
  }

  async criarTreino({ usuarioId, adminId, nome, diaSemana, duracaoMin, exercicios }) {
    if (!usuarioId || !nome || !diaSemana) {
      throw { status: 400, mensagem: 'usuario_id, nome e dia_semana são obrigatórios.' }
    }

    // Valida que o destino é um aluno real
    await UsuarioService.validarAluno(usuarioId)

    return await TreinoRepository.create({
      usuarioId,
      criadoPor: adminId,
      nome,
      diaSemana,
      duracaoMin,
      exercicios,
    })
  }

  async editarTreino(id, dados) {
    const treino = await TreinoRepository.update(id, {
      nome:       dados.nome,
      diaSemana:  dados.dia_semana,
      duracaoMin: dados.duracao_min,
    })
    if (!treino) {
      throw { status: 404, mensagem: 'Treino não encontrado.' }
    }
    return treino
  }

  async deletarTreino(id) {
    const treino = await TreinoRepository.delete(id)
    if (!treino) {
      throw { status: 404, mensagem: 'Treino não encontrado.' }
    }
    return treino
  }
}

module.exports = new TreinoService()