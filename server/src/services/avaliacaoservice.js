const AvaliacaoRepository = require('../repositories/AvaliacaoRepository')
const UsuarioRepository   = require('../repositories/UsuarioRepository')

class AvaliacaoService {

  async listarAvaliacoes(usuarioId, isAdmin) {
    if (isAdmin) return await AvaliacaoRepository.findAll()
    return await AvaliacaoRepository.findByUsuarioId(usuarioId)
  }

  async criarAvaliacao({ usuarioId, avaliadorId, peso, gorduraPct, massaMuscular, observacoes, dataAvaliacao }) {
    if (!usuarioId) {
      throw { status: 400, mensagem: 'usuario_id é obrigatório.' }
    }

    // Calcula o IMC automaticamente se tiver peso e o aluno tiver altura cadastrada
    let imc = null
    if (peso) {
      const aluno = await UsuarioRepository.findById(usuarioId)
      if (aluno && aluno.altura) {
        const alturaM = aluno.altura / 100
        imc = parseFloat((peso / (alturaM * alturaM)).toFixed(2))
      }
    }

    return await AvaliacaoRepository.create({
      usuarioId,
      avaliadorId,
      peso,
      gorduraPct,
      massaMuscular,
      imc,
      observacoes,
      dataAvaliacao: dataAvaliacao || new Date().toISOString().split('T')[0],
    })
  }
}

module.exports = new AvaliacaoService()