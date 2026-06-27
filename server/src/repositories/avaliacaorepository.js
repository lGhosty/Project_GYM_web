const pool            = require('../config/database')
const AvaliacaoModel  = require('../models/AvaliacaoModel')

class AvaliacaoRepository {

  async findByUsuarioId(usuarioId) {
    const result = await pool.query(
      'SELECT * FROM avaliacoes WHERE usuario_id = $1 ORDER BY data_avaliacao DESC',
      [usuarioId]
    )
    return result.rows.map(row => new AvaliacaoModel(row))
  }

  // Admin vê todas as avaliações com o nome do aluno
  async findAll() {
    const result = await pool.query(
      `SELECT a.*, u.nome AS aluno_nome
       FROM avaliacoes a
       JOIN usuarios u ON a.usuario_id = u.id
       ORDER BY a.data_avaliacao DESC`
    )
    return result.rows.map(row => new AvaliacaoModel(row))
  }

  async create({ usuarioId, avaliadorId, peso, gorduraPct, massaMuscular, imc, observacoes, dataAvaliacao }) {
    const result = await pool.query(
      `INSERT INTO avaliacoes
        (usuario_id, avaliador_id, peso, gordura_pct, massa_muscular, imc, observacoes, data_avaliacao)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [usuarioId, avaliadorId, peso, gorduraPct, massaMuscular, imc, observacoes, dataAvaliacao]
    )
    return new AvaliacaoModel(result.rows[0])
  }
}

module.exports = new AvaliacaoRepository()