const AvaliacaoService = require('../services/AvaliacaoService')

class AvaliacaoController {

  async listar(req, res) {
    try {
      const isAdmin = req.usuarioRole === 'admin'
      const avaliacoes = await AvaliacaoService.listarAvaliacoes(req.usuarioId, isAdmin)
      return res.json(avaliacoes)
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' })
    }
  }

  async criar(req, res) {
    try {
      const { usuario_id, peso, gordura_pct, massa_muscular, observacoes, data_avaliacao } = req.body
      const avaliacao = await AvaliacaoService.criarAvaliacao({
        usuarioId:     usuario_id,
        avaliadorId:   req.usuarioId,
        peso,
        gorduraPct:    gordura_pct,
        massaMuscular: massa_muscular,
        observacoes,
        dataAvaliacao: data_avaliacao,
      })
      return res.status(201).json(avaliacao)
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' })
    }
  }
}

module.exports = new AvaliacaoController()