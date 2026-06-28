const DietaService = require('../services/DietaService')

class DietaController {

  async listar(req, res) {
    try {
      const resultado = await DietaService.listarDieta(req.usuarioId)
      return res.json(resultado)
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' })
    }
  }

  async adicionar(req, res) {
    try {
      const { usuario_id, nome, descricao, horario, calorias } = req.body
      const refeicao = await DietaService.adicionarRefeicao({
        usuarioId: usuario_id,
        adminId:   req.usuarioId,
        nome,
        descricao,
        horario,
        calorias,
      })
      return res.status(201).json(refeicao)
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' })
    }
  }

  async deletar(req, res) {
    try {
      const isAdmin = req.usuarioRole === 'admin'
      const refeicao = await DietaService.deletarRefeicao(req.params.id, req.usuarioId, isAdmin)
      return res.json({ mensagem: `Refeição "${refeicao.nome}" deletada.` })
    } catch (err) {
      return res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' })
    }
  }
}

module.exports = new DietaController()