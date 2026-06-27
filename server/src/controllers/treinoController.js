const TreinoService = require('../services/TreinoService')

class TreinoController {

  async listar(req, res) {
    try {
      const treinos = await TreinoService.listarTreinos(req.usuarioId)
      return res.json(treinos)
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' })
    }
  }

  async criar(req, res) {
    try {
      const { usuario_id, nome, dia_semana, duracao_min, exercicios } = req.body
      const treino = await TreinoService.criarTreino({
        usuarioId:   usuario_id,
        adminId:     req.usuarioId,
        nome,
        diaSemana:   dia_semana,
        duracaoMin:  duracao_min,
        exercicios,
      })
      return res.status(201).json(treino)
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' })
    }
  }

  async editar(req, res) {
    try {
      const treino = await TreinoService.editarTreino(req.params.id, req.body)
      return res.json(treino)
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' })
    }
  }

  async deletar(req, res) {
    try {
      const treino = await TreinoService.deletarTreino(req.params.id)
      return res.json({ mensagem: `Treino "${treino.nome}" deletado com sucesso.` })
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' })
    }
  }
}

module.exports = new TreinoController()