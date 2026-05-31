const pool = require('../config/database')

async function listarDieta(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM dietas WHERE usuario_id = $1 ORDER BY horario',
      [req.usuarioId]
    )

    const totalCalorias = result.rows.reduce((soma, r) => soma + (r.calorias || 0), 0)

    res.json({ refeicoes: result.rows, total_calorias: totalCalorias })

  } catch (err) {
    res.status(500).json({ erro: 'Erro interno do servidor.' })
  }
}

async function adicionarRefeicao(req, res) {
  try {
    const { nome, descricao, horario, calorias } = req.body

    if (!nome) {
      return res.status(400).json({ erro: 'Nome da refeicao e obrigatorio.' })
    }

    const result = await pool.query(
      `INSERT INTO dietas (usuario_id, nome, descricao, horario, calorias)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.usuarioId, nome, descricao, horario, calorias]
    )

    res.status(201).json(result.rows[0])

  } catch (err) {
    res.status(500).json({ erro: 'Erro interno do servidor.' })
  }
}

module.exports = { listarDieta, adicionarRefeicao }